import { canonicalDb } from "../database/canonicalStore";
import { OnePieceAPIAdapter } from "../adapters/OnePieceAPIAdapter";
import { MediaWikiAdapter, CSVAdapter, JSONAdapter } from "../adapters/SecondaryAdapters";
import { BaseAdapter } from "../adapters/BaseAdapter";
import { EntityNormalizer } from "../normalizers/normalizer";
import { EntityResolver } from "../resolution/entityResolver";
import { PipelineEntityType, ImportBatch } from "../../types/pipeline";

export class IngestionService {
  private adapters: Map<string, BaseAdapter> = new Map();

  constructor() {
    // Register primary adapters
    const opApi = new OnePieceAPIAdapter();
    const wiki = new MediaWikiAdapter();
    const csv = new CSVAdapter();
    const json = new JSONAdapter();

    this.adapters.set("src_onepiece_api", opApi);
    this.adapters.set("src_onepiece_wiki", wiki);
    this.adapters.set("src_community_csv", csv);
    this.adapters.set("src_json_file", json);
  }

  /**
   * Run the complete 9-stage data ingestion pipeline
   */
  public async runIngestion(
    sourceId: string,
    entityType: PipelineEntityType,
    options: { page?: number; limit?: number; customPayload?: any } = {}
  ): Promise<ImportBatch> {
    // 1. Source Registry Verification
    const source = canonicalDb.getSource(sourceId);
    if (!source) {
      throw new Error(`Source '${sourceId}' is not registered in the Source Registry.`);
    }

    // 2. Initialize Batch
    const batch = canonicalDb.createBatch(sourceId, entityType);
    canonicalDb.updateSource(sourceId, {
      sync_status: "SYNCING",
      last_attempted_sync: new Date().toISOString(),
    });

    try {
      // 3. Data Fetcher Layer
      let rawRecords: Record<string, any>[] = [];
      let sourceUrl = source.base_url;

      if (options.customPayload) {
        rawRecords = Array.isArray(options.customPayload) ? options.customPayload : [options.customPayload];
        batch.logs.push(`[${new Date().toISOString()}] Received direct payload: ${rawRecords.length} records.`);
      } else {
        const adapter = this.adapters.get(sourceId) || this.adapters.get("src_onepiece_api")!;
        batch.logs.push(`[${new Date().toISOString()}] Dispatching adapter: ${adapter.name} (${adapter.sourceType})`);

        const fetchResult = await adapter.fetchRecords(entityType, {
          page: options.page || 1,
          limit: options.limit || 10,
        });

        rawRecords = fetchResult.records;
        sourceUrl = fetchResult.sourceUrl;
        batch.logs.push(
          `[${new Date().toISOString()}] Data Fetcher retrieved ${rawRecords.length} records. (${
            fetchResult.isMockFallback ? "Resilient offline sample active" : "Live API response"
          })`
        );
      }

      batch.records_fetched = rawRecords.length;

      // 4. Ingestion Loop (Raw Storage -> Normalization -> Deduplication -> Canon Check -> Admin Review Queue)
      for (const raw of rawRecords) {
        try {
          const externalId = String(raw.id || raw.pageid || raw.csv_row_id || Date.now());

          // Step 4a: Store in Raw Data Storage (Isolated with SHA-256 Checksum)
          const rawRecord = canonicalDb.storeRawRecord(
            batch.batch_id,
            sourceId,
            sourceUrl,
            externalId,
            entityType,
            raw
          );

          // Step 4b: Normalization Layer
          const normalizedResult = EntityNormalizer.normalize(raw, entityType, source);
          batch.records_normalized++;

          // Step 4c: Entity Resolution & Duplicate Detection
          const duplicateCandidates = EntityResolver.detectDuplicates(
            normalizedResult.normalizedData.id || externalId,
            normalizedResult.normalizedData.name,
            entityType,
            normalizedResult.normalizedData.aliases || []
          );

          if (duplicateCandidates.length > 0) {
            batch.records_duplicates_flagged++;
            duplicateCandidates.forEach((cand) => {
              canonicalDb.duplicateCandidates.set(cand.candidate_id, cand);
            });
            batch.logs.push(
              `[${new Date().toISOString()}] Duplicate detected: '${normalizedResult.normalizedData.name}' matches '${duplicateCandidates[0].existing_entity_name}' (${duplicateCandidates[0].similarity_score}% similarity)`
            );
          }

          // Step 4d: Canon Verification (Strict rule: Theories cannot become CANON_CONFIRMED)
          let verifiedCanonStatus = normalizedResult.proposedCanonStatus;
          if (source.source_type === "THEORY" && verifiedCanonStatus === "CANON_CONFIRMED") {
            verifiedCanonStatus = "THEORY";
            batch.logs.push(`[${new Date().toISOString()}] Security guard: Demoted theory source from CANON_CONFIRMED to THEORY.`);
          }

          // Step 4e: Queue into Admin Review Queue
          canonicalDb.queuePendingReview({
            batch_id: batch.batch_id,
            source_id: sourceId,
            source_name: source.source_name,
            entity_type: entityType,
            external_id: externalId,
            raw_record_id: rawRecord.raw_record_id,
            normalized_data: normalizedResult.normalizedData,
            status: "PENDING_REVIEW",
            proposed_canon_status: verifiedCanonStatus,
            confidence_score: normalizedResult.confidenceScore,
            duplicate_candidates: duplicateCandidates.length > 0 ? duplicateCandidates : undefined,
          });

          batch.records_pending_review++;
        } catch (itemErr: any) {
          batch.errors.push(`Record processing error: ${itemErr.message || itemErr}`);
        }
      }

      // Mark batch completed
      batch.status = "COMPLETED";
      batch.completed_at = new Date().toISOString();
      batch.logs.push(
        `[${new Date().toISOString()}] Pipeline finished: ${batch.records_pending_review} queued for Admin Review.`
      );

      canonicalDb.updateBatch(batch.batch_id, batch);
      canonicalDb.updateSource(sourceId, {
        sync_status: "SUCCESS",
        last_successful_sync: new Date().toISOString(),
      });

      return batch;
    } catch (pipelineErr: any) {
      batch.status = "FAILED";
      batch.completed_at = new Date().toISOString();
      batch.errors.push(`Pipeline failure: ${pipelineErr.message || pipelineErr}`);
      canonicalDb.updateBatch(batch.batch_id, batch);
      canonicalDb.updateSource(sourceId, { sync_status: "FAILED" });
      throw pipelineErr;
    }
  }
}

export const ingestionService = new IngestionService();

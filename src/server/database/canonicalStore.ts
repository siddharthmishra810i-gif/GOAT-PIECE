import crypto from "crypto";
import {
  SourceRecord,
  ImportBatch,
  RawDataRecord,
  EvidenceRecord,
  EntityRevision,
  DuplicateCandidate,
  PendingReviewItem,
  CanonicalCharacter,
  CanonicalDevilFruit,
  CanonicalLocation,
  CanonicalShip,
  CanonicalBountyHistory,
  CanonStatus,
  PipelineEntityType,
} from "../../types/pipeline";

class CanonicalDatabaseStore {
  // 1. Source Registry
  public sources: Map<string, SourceRecord> = new Map();

  // 2. Import Batches
  public batches: Map<string, ImportBatch> = new Map();

  // 3. Raw Data Storage (isolated from normalized data)
  public rawRecords: Map<string, RawDataRecord> = new Map();

  // 4. Pending Review Items
  public pendingReviews: Map<string, PendingReviewItem> = new Map();

  // 5. Duplicate Detection Candidates
  public duplicateCandidates: Map<string, DuplicateCandidate> = new Map();

  // 6. Evidence & Source Traceability
  public evidenceStore: Map<string, EvidenceRecord> = new Map();

  // 7. Entity Revision History (Version 1 -> Version 2 ...)
  public revisions: Map<string, EntityRevision[]> = new Map(); // entity_id -> revisions list

  // 8. Canonical Database Tables
  public characters: Map<string, CanonicalCharacter> = new Map();
  public devilFruits: Map<string, CanonicalDevilFruit> = new Map();
  public locations: Map<string, CanonicalLocation> = new Map();
  public ships: Map<string, CanonicalShip> = new Map();
  public bountyHistories: Map<string, CanonicalBountyHistory[]> = new Map(); // character_id -> histories

  constructor() {
    this.seedInitialSources();
    this.seedBaselineCanonicalData();
  }

  private seedInitialSources() {
    const defaultSources: SourceRecord[] = [
      {
        source_id: "src_onepiece_api",
        source_name: "One Piece API",
        source_type: "API",
        base_url: "https://www.onepieceapi.com/",
        api_endpoint: "https://www.onepieceapi.com/api/v1",
        reliability_level: 9,
        last_successful_sync: null,
        last_attempted_sync: null,
        sync_status: "IDLE",
        notes: "Primary structured REST API for Characters, Devil Fruits, Ships, Islands, and Bounties.",
        rate_limit_rpm: 60,
        auth_required: false,
      },
      {
        source_id: "src_onepiece_wiki",
        source_name: "One Piece Fandom Wiki (MediaWiki)",
        source_type: "WIKI",
        base_url: "https://onepiece.fandom.com/",
        api_endpoint: "https://onepiece.fandom.com/api.php",
        reliability_level: 8,
        last_successful_sync: null,
        last_attempted_sync: null,
        sync_status: "IDLE",
        notes: "Comprehensive fan-edited encyclopedia with extensive volume and chapter cross-references.",
        rate_limit_rpm: 30,
        auth_required: false,
      },
      {
        source_id: "src_official_sbs",
        source_name: "Eiichiro Oda SBS Columns (Official Shueisha)",
        source_type: "OFFICIAL",
        base_url: "https://one-piece.com/",
        api_endpoint: "internal/canon/sbs",
        reliability_level: 10,
        last_successful_sync: "2026-09-01T12:00:00Z",
        last_attempted_sync: "2026-09-01T12:00:00Z",
        sync_status: "SUCCESS",
        notes: "Author direct Q&A answers published in manga tankōbon volumes.",
        rate_limit_rpm: 100,
        auth_required: false,
      },
      {
        source_id: "src_community_csv",
        source_name: "Community Bounties & Epithets Dataset (CSV)",
        source_type: "COMMUNITY",
        base_url: "local://imports/community-bounties.csv",
        api_endpoint: "file://local",
        reliability_level: 7,
        last_successful_sync: null,
        last_attempted_sync: null,
        sync_status: "IDLE",
        notes: "Community structured tabular dataset tracking historical marine bounties and translations.",
        rate_limit_rpm: 1000,
        auth_required: false,
      },
      {
        source_id: "src_ohara_theories",
        source_name: "Scholars of Ohara Lore & Speculation Forum",
        source_type: "THEORY",
        base_url: "https://grandline-theories.community/",
        api_endpoint: "https://grandline-theories.community/api/feed",
        reliability_level: 5,
        last_successful_sync: null,
        last_attempted_sync: null,
        sync_status: "IDLE",
        notes: "Fan speculation and hypothesis repository. Strictly quarantined as THEORY / SPECULATION.",
        rate_limit_rpm: 30,
        auth_required: false,
      },
    ];

    for (const src of defaultSources) {
      this.sources.set(src.source_id, src);
    }
  }

  private seedBaselineCanonicalData() {
    // Seed an initial verified baseline canonical character to demonstrate duplicate detection
    // e.g. Existing canonical "Monkey D. Luffy"
    const luffyId = "char_luffy";
    const luffy: CanonicalCharacter = {
      id: luffyId,
      name: "Monkey D. Luffy",
      japanese_name: "モンキー・D・ルフィ",
      romanized_name: "Monkī D. Rufi",
      aliases: ["Straw Hat", "Lucy", "Fifth Emperor", "Joy Boy", "Nika"],
      bounty: "3,000,000,000 Berries",
      bounty_number: 3000000000,
      status: "Alive",
      affiliation: "Straw Hat Pirates",
      crew_id: "crew_straw_hats",
      crew_name: "Straw Hat Pirates",
      role: "Captain",
      race: "Human",
      origin_island: "Foosha Village (Dawn Island)",
      devil_fruit: "Hito Hito no Mi, Model: Nika",
      haki: ["Haoshoku (Conqueror's)", "Busoshoku (Armament)", "Kenbunshoku (Observation)", "Advanced Conqueror's Infusion"],
      canon_status: "CANON_CONFIRMED",
      current_version: 1,
      primary_source_id: "src_official_sbs",
      evidence_count: 2,
      first_appearance_chapter: 1,
      first_appearance_episode: 1,
      updated_at: "2026-09-01T12:00:00Z",
    };
    this.characters.set(luffyId, luffy);

    // Initial revision for baseline Luffy
    this.recordRevision({
      revision_id: `rev_luffy_v1`,
      entity_type: "character",
      entity_id: luffyId,
      version_number: 1,
      changed_at: "2026-09-01T12:00:00Z",
      source_id: "src_official_sbs",
      source_name: "Eiichiro Oda SBS Columns (Official Shueisha)",
      approved_by: "System Chief Archivist",
      comment: "Initial canonical database baseline entry.",
      diff: [
        { field: "name", old_value: null, new_value: "Monkey D. Luffy" },
        { field: "bounty", old_value: null, new_value: "3,000,000,000 Berries" },
      ],
      snapshot: luffy,
    });

    // Evidence for baseline Luffy
    const ev1: EvidenceRecord = {
      evidence_id: "ev_luffy_ch1",
      entity_id: luffyId,
      entity_type: "character",
      source_id: "src_official_sbs",
      source_name: "Eiichiro Oda SBS Columns (Official Shueisha)",
      source_url: "https://one-piece.com/comics/ch1",
      external_id: "manga_ch1_p1",
      raw_record_id: "raw_seed_001",
      retrieval_date: "2026-09-01T12:00:00Z",
      last_verified_date: "2026-09-01T12:00:00Z",
      confidence: 1.0,
      canon_status: "CANON_CONFIRMED",
      citation_notes: "Manga Chapter 1 'Romance Dawn' - Debut of Monkey D. Luffy and eating of the Gomu Gomu no Mi.",
    };
    this.evidenceStore.set(ev1.evidence_id, ev1);

    // Baseline Devil Fruit: Hito Hito no Mi, Model: Nika
    const nikaId = "df_nika";
    const nikaFruit: CanonicalDevilFruit = {
      id: nikaId,
      name: "Hito Hito no Mi, Model: Nika",
      japanese_name: "ヒトヒトの実 モデル“ニカ”",
      type: "Mythical Zoan",
      current_user: "Monkey D. Luffy",
      previous_users: ["Joy Boy"],
      awakening_status: "Confirmed",
      description: "A Mythical Zoan fruit giving the user the properties of rubber and divine combat freedom. Renamed 'Gomu Gomu no Mi' by the World Government to obscure its true nature.",
      canon_status: "CANON_CONFIRMED",
      current_version: 1,
      primary_source_id: "src_official_sbs",
      evidence_count: 1,
      first_appearance_chapter: 1,
      updated_at: "2026-09-01T12:00:00Z",
    };
    this.devilFruits.set(nikaId, nikaFruit);

    // Baseline Location: Egghead Island
    const eggheadId = "loc_egghead";
    const eggheadLoc: CanonicalLocation = {
      id: eggheadId,
      name: "Egghead (Future Island)",
      japanese_name: "エッグヘッド",
      sea_region: "New World",
      island_type: "Winter / Government Science Research",
      affiliation: "World Government / Dr. Vegapunk",
      log_pose_time: "Unknown / Locked to Vegapunk Punk Records",
      first_appearance_chapter: 1060,
      description: "Island of the Future, 500 years ahead of current civilization, powered by the Ancient Kingdom's eternal fire (Mother Flame).",
      canon_status: "CANON_CONFIRMED",
      current_version: 1,
      primary_source_id: "src_official_sbs",
      evidence_count: 1,
      updated_at: "2026-09-01T12:00:00Z",
    };
    this.locations.set(eggheadId, eggheadLoc);
  }

  // --- Source Operations ---
  public getAllSources(): SourceRecord[] {
    return Array.from(this.sources.values());
  }

  public getSource(sourceId: string): SourceRecord | undefined {
    return this.sources.get(sourceId);
  }

  public updateSource(sourceId: string, patch: Partial<SourceRecord>): SourceRecord | undefined {
    const src = this.sources.get(sourceId);
    if (!src) return undefined;
    const updated = { ...src, ...patch };
    this.sources.set(sourceId, updated);
    return updated;
  }

  // --- Batch Operations ---
  public createBatch(sourceId: string, entityType: PipelineEntityType): ImportBatch {
    const src = this.sources.get(sourceId);
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const batch: ImportBatch = {
      batch_id: batchId,
      source_id: sourceId,
      source_name: src ? src.source_name : sourceId,
      entity_type: entityType,
      started_at: new Date().toISOString(),
      completed_at: null,
      status: "IN_PROGRESS",
      records_fetched: 0,
      records_normalized: 0,
      records_pending_review: 0,
      records_duplicates_flagged: 0,
      errors: [],
      logs: [`[${new Date().toISOString()}] Batch initialized for source ${src?.source_name || sourceId} (${entityType})`],
    };
    this.batches.set(batchId, batch);
    return batch;
  }

  public getBatch(batchId: string): ImportBatch | undefined {
    return this.batches.get(batchId);
  }

  public getAllBatches(): ImportBatch[] {
    return Array.from(this.batches.values()).sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );
  }

  public updateBatch(batchId: string, patch: Partial<ImportBatch>): ImportBatch | undefined {
    const b = this.batches.get(batchId);
    if (!b) return undefined;
    const updated = { ...b, ...patch };
    this.batches.set(batchId, updated);
    return updated;
  }

  // --- Raw Data Storage ---
  public storeRawRecord(
    batchId: string,
    sourceId: string,
    sourceUrl: string,
    externalId: string,
    entityType: PipelineEntityType,
    rawPayload: Record<string, any>
  ): RawDataRecord {
    const rawRecordId = `raw_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const checksum = crypto
      .createHash("sha256")
      .update(JSON.stringify(rawPayload))
      .digest("hex");

    const record: RawDataRecord = {
      raw_record_id: rawRecordId,
      batch_id: batchId,
      source_id: sourceId,
      source_url: sourceUrl,
      retrieved_at: new Date().toISOString(),
      external_id: String(externalId),
      checksum,
      entity_type: entityType,
      raw_payload: rawPayload,
    };

    this.rawRecords.set(rawRecordId, record);
    return record;
  }

  public getRawRecord(rawRecordId: string): RawDataRecord | undefined {
    return this.rawRecords.get(rawRecordId);
  }

  // --- Pending Review Queue ---
  public queuePendingReview(item: Omit<PendingReviewItem, "review_id" | "created_at">): PendingReviewItem {
    const reviewId = `revq_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const pendingItem: PendingReviewItem = {
      ...item,
      review_id: reviewId,
      created_at: new Date().toISOString(),
    };
    this.pendingReviews.set(reviewId, pendingItem);
    return pendingItem;
  }

  public getPendingReviews(filterStatus?: PendingReviewItem["status"]): PendingReviewItem[] {
    const all = Array.from(this.pendingReviews.values());
    if (filterStatus) {
      return all.filter((r) => r.status === filterStatus);
    }
    return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getPendingReviewById(reviewId: string): PendingReviewItem | undefined {
    return this.pendingReviews.get(reviewId);
  }

  // --- Evidence Records ---
  public recordEvidence(evidence: EvidenceRecord): EvidenceRecord {
    this.evidenceStore.set(evidence.evidence_id, evidence);
    return evidence;
  }

  public getEvidenceForEntity(entityId: string): EvidenceRecord[] {
    return Array.from(this.evidenceStore.values()).filter((e) => e.entity_id === entityId);
  }

  // --- Revisions ---
  public recordRevision(rev: EntityRevision): EntityRevision {
    const list = this.revisions.get(rev.entity_id) || [];
    list.unshift(rev);
    this.revisions.set(rev.entity_id, list);
    return rev;
  }

  public getRevisionsForEntity(entityId: string): EntityRevision[] {
    return this.revisions.get(entityId) || [];
  }

  public getAllRevisions(): EntityRevision[] {
    const all: EntityRevision[] = [];
    this.revisions.forEach((list) => all.push(...list));
    return all.sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());
  }

  // --- Admin Review Actions ---
  public approveAndPublish(
    reviewId: string,
    adminName = "Archivist Admin",
    overrides?: Partial<Record<string, any>>
  ): { success: boolean; entity: any; error?: string } {
    const review = this.pendingReviews.get(reviewId);
    if (!review) return { success: false, entity: null, error: "Review item not found" };

    const mergedData = { ...review.normalized_data, ...(overrides || {}) };
    const entityType = review.entity_type;
    const source = this.sources.get(review.source_id);

    let publishedEntity: any = null;
    let entityId = mergedData.id;

    if (entityType === "character") {
      const existing = this.characters.get(entityId);
      const version = existing ? existing.current_version + 1 : 1;

      const characterRecord: CanonicalCharacter = {
        id: entityId || `char_${Date.now()}`,
        name: mergedData.name,
        japanese_name: mergedData.japanese_name || existing?.japanese_name,
        romanized_name: mergedData.romanized_name || existing?.romanized_name,
        aliases: Array.from(new Set([...(mergedData.aliases || []), ...(existing?.aliases || [])])),
        bounty: mergedData.bounty || existing?.bounty || null,
        bounty_number: mergedData.bounty_number || existing?.bounty_number || 0,
        status: mergedData.status || existing?.status || "Unknown",
        affiliation: mergedData.affiliation || existing?.affiliation || "Independent",
        crew_id: mergedData.crew_id || existing?.crew_id,
        crew_name: mergedData.crew_name || existing?.crew_name,
        role: mergedData.role || existing?.role || "Fighter",
        race: mergedData.race || existing?.race || "Human",
        origin_island: mergedData.origin_island || existing?.origin_island,
        devil_fruit: mergedData.devil_fruit || existing?.devil_fruit,
        haki: Array.from(new Set([...(mergedData.haki || []), ...(existing?.haki || [])])),
        canon_status: mergedData.canon_status || review.proposed_canon_status,
        current_version: version,
        primary_source_id: review.source_id,
        evidence_count: (existing?.evidence_count || 0) + 1,
        first_appearance_chapter: mergedData.first_appearance_chapter || existing?.first_appearance_chapter,
        first_appearance_episode: mergedData.first_appearance_episode || existing?.first_appearance_episode,
        updated_at: new Date().toISOString(),
      };

      this.characters.set(characterRecord.id, characterRecord);
      publishedEntity = characterRecord;
      entityId = characterRecord.id;

      // Add revision
      const diff: { field: string; old_value: any; new_value: any }[] = [];
      if (existing) {
        Object.keys(characterRecord).forEach((k) => {
          if ((existing as any)[k] !== (characterRecord as any)[k]) {
            diff.push({ field: k, old_value: (existing as any)[k], new_value: (characterRecord as any)[k] });
          }
        });
      } else {
        diff.push({ field: "CREATE", old_value: null, new_value: characterRecord.name });
      }

      this.recordRevision({
        revision_id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        entity_type: "character",
        entity_id: entityId,
        version_number: version,
        changed_at: new Date().toISOString(),
        source_id: review.source_id,
        source_name: source?.source_name || review.source_id,
        batch_id: review.batch_id,
        approved_by: adminName,
        comment: existing ? `Updated via import batch approval` : `Published initial canonical record from import batch`,
        diff,
        snapshot: characterRecord,
      });
    } else if (entityType === "devil_fruit") {
      const existing = this.devilFruits.get(entityId);
      const version = existing ? existing.current_version + 1 : 1;

      const fruitRecord: CanonicalDevilFruit = {
        id: entityId || `df_${Date.now()}`,
        name: mergedData.name,
        japanese_name: mergedData.japanese_name || existing?.japanese_name,
        type: mergedData.type || existing?.type || "Unknown",
        current_user: mergedData.current_user || existing?.current_user || "Unknown",
        previous_users: mergedData.previous_users || existing?.previous_users || [],
        awakening_status: mergedData.awakening_status || existing?.awakening_status || "Unknown",
        description: mergedData.description || existing?.description || "",
        canon_status: mergedData.canon_status || review.proposed_canon_status,
        current_version: version,
        primary_source_id: review.source_id,
        evidence_count: (existing?.evidence_count || 0) + 1,
        first_appearance_chapter: mergedData.first_appearance_chapter || existing?.first_appearance_chapter,
        updated_at: new Date().toISOString(),
      };

      this.devilFruits.set(fruitRecord.id, fruitRecord);
      publishedEntity = fruitRecord;
      entityId = fruitRecord.id;

      this.recordRevision({
        revision_id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        entity_type: "devil_fruit",
        entity_id: entityId,
        version_number: version,
        changed_at: new Date().toISOString(),
        source_id: review.source_id,
        source_name: source?.source_name || review.source_id,
        batch_id: review.batch_id,
        approved_by: adminName,
        comment: `Approved Devil Fruit import`,
        diff: [{ field: "PUBLISH", old_value: null, new_value: fruitRecord.name }],
        snapshot: fruitRecord,
      });
    } else if (entityType === "location") {
      const existing = this.locations.get(entityId);
      const version = existing ? existing.current_version + 1 : 1;

      const locRecord: CanonicalLocation = {
        id: entityId || `loc_${Date.now()}`,
        name: mergedData.name,
        japanese_name: mergedData.japanese_name || existing?.japanese_name,
        sea_region: mergedData.sea_region || existing?.sea_region || "Grand Line",
        island_type: mergedData.island_type || existing?.island_type || "Summer",
        affiliation: mergedData.affiliation || existing?.affiliation || "Independent",
        log_pose_time: mergedData.log_pose_time || existing?.log_pose_time,
        first_appearance_chapter: mergedData.first_appearance_chapter || existing?.first_appearance_chapter,
        description: mergedData.description || existing?.description || "",
        canon_status: mergedData.canon_status || review.proposed_canon_status,
        current_version: version,
        primary_source_id: review.source_id,
        evidence_count: (existing?.evidence_count || 0) + 1,
        updated_at: new Date().toISOString(),
      };

      this.locations.set(locRecord.id, locRecord);
      publishedEntity = locRecord;
      entityId = locRecord.id;

      this.recordRevision({
        revision_id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        entity_type: "location",
        entity_id: entityId,
        version_number: version,
        changed_at: new Date().toISOString(),
        source_id: review.source_id,
        source_name: source?.source_name || review.source_id,
        batch_id: review.batch_id,
        approved_by: adminName,
        comment: `Approved Location import`,
        diff: [{ field: "PUBLISH", old_value: null, new_value: locRecord.name }],
        snapshot: locRecord,
      });
    } else if (entityType === "ship") {
      const existing = this.ships.get(entityId);
      const version = existing ? existing.current_version + 1 : 1;

      const shipRecord: CanonicalShip = {
        id: entityId || `ship_${Date.now()}`,
        name: mergedData.name,
        affiliation: mergedData.affiliation || existing?.affiliation || "Pirate",
        shipwright: mergedData.shipwright || existing?.shipwright,
        type: mergedData.type || existing?.type,
        status: mergedData.status || existing?.status || "Active",
        first_appearance_chapter: mergedData.first_appearance_chapter || existing?.first_appearance_chapter,
        description: mergedData.description || existing?.description || "",
        canon_status: mergedData.canon_status || review.proposed_canon_status,
        current_version: version,
        primary_source_id: review.source_id,
        evidence_count: (existing?.evidence_count || 0) + 1,
        updated_at: new Date().toISOString(),
      };

      this.ships.set(shipRecord.id, shipRecord);
      publishedEntity = shipRecord;
      entityId = shipRecord.id;

      this.recordRevision({
        revision_id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        entity_type: "ship",
        entity_id: entityId,
        version_number: version,
        changed_at: new Date().toISOString(),
        source_id: review.source_id,
        source_name: source?.source_name || review.source_id,
        batch_id: review.batch_id,
        approved_by: adminName,
        comment: `Approved Ship import`,
        diff: [{ field: "PUBLISH", old_value: null, new_value: shipRecord.name }],
        snapshot: shipRecord,
      });
    } else if (entityType === "bounty") {
      const bountyRecord: CanonicalBountyHistory = {
        id: `bh_${Date.now()}`,
        character_id: mergedData.character_id || entityId,
        character_name: mergedData.character_name || mergedData.name,
        amount: mergedData.amount || mergedData.bounty_number || 0,
        formatted_amount: mergedData.formatted_amount || `${(mergedData.amount || 0).toLocaleString()} Berries`,
        issued_after_arc: mergedData.issued_after_arc,
        issued_chapter: mergedData.issued_chapter,
        condition: mergedData.condition || "Dead or Alive",
        canon_status: mergedData.canon_status || review.proposed_canon_status,
        source_id: review.source_id,
        date_recorded: new Date().toISOString(),
      };

      const histories = this.bountyHistories.get(bountyRecord.character_id) || [];
      histories.unshift(bountyRecord);
      this.bountyHistories.set(bountyRecord.character_id, histories);
      publishedEntity = bountyRecord;
      entityId = bountyRecord.id;
    }

    // Attach Evidence Record for Traceability
    const evidence: EvidenceRecord = {
      evidence_id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      entity_id: entityId,
      entity_type: entityType,
      source_id: review.source_id,
      source_name: source?.source_name || review.source_id,
      source_url: source?.base_url || "https://www.onepieceapi.com/",
      external_id: review.external_id,
      raw_record_id: review.raw_record_id,
      retrieval_date: review.created_at,
      last_verified_date: new Date().toISOString(),
      confidence: review.confidence_score,
      canon_status: mergedData.canon_status || review.proposed_canon_status,
      citation_notes: `Imported via batch ${review.batch_id} from ${source?.source_name}. Approved by ${adminName}.`,
    };
    this.recordEvidence(evidence);

    // Update review item state
    review.status = "APPROVED";
    review.reviewed_at = new Date().toISOString();
    review.reviewed_by = adminName;
    review.admin_notes = overrides?.admin_notes || "Approved into canonical database.";
    this.pendingReviews.set(reviewId, review);

    return { success: true, entity: publishedEntity };
  }

  public rejectReview(reviewId: string, reason: string, adminName = "Archivist Admin"): boolean {
    const review = this.pendingReviews.get(reviewId);
    if (!review) return false;
    review.status = "REJECTED";
    review.reviewed_at = new Date().toISOString();
    review.reviewed_by = adminName;
    review.admin_notes = reason;
    this.pendingReviews.set(reviewId, review);
    return true;
  }

  public mergeIntoExisting(
    reviewId: string,
    targetCanonicalId: string,
    adminName = "Archivist Admin"
  ): { success: boolean; entity?: any; error?: string } {
    const review = this.pendingReviews.get(reviewId);
    if (!review) return { success: false, error: "Review item not found" };

    const entityType = review.entity_type;
    const existing = entityType === "character" ? this.characters.get(targetCanonicalId) : null;
    if (!existing) return { success: false, error: `Existing canonical ${entityType} '${targetCanonicalId}' not found` };

    // Merge aliases and fields without destroying existing verified canon
    const newAliases = review.normalized_data.aliases || [];
    const mergedAliases = Array.from(new Set([...existing.aliases, ...newAliases, review.normalized_data.name]));

    const oldVersion = existing.current_version;
    existing.aliases = mergedAliases;
    existing.current_version = oldVersion + 1;
    existing.evidence_count += 1;
    existing.updated_at = new Date().toISOString();
    this.characters.set(targetCanonicalId, existing);

    // Record merge revision
    this.recordRevision({
      revision_id: `rev_merge_${Date.now()}`,
      entity_type: "character",
      entity_id: targetCanonicalId,
      version_number: existing.current_version,
      changed_at: new Date().toISOString(),
      source_id: review.source_id,
      source_name: review.source_name,
      batch_id: review.batch_id,
      approved_by: adminName,
      comment: `Merged duplicate import entity '${review.normalized_data.name}' into canonical record '${existing.name}'. Added aliases: ${newAliases.join(", ")}`,
      diff: [
        { field: "aliases", old_value: existing.aliases, new_value: mergedAliases },
        { field: "MERGE_ENTITY", old_value: review.external_id, new_value: targetCanonicalId },
      ],
      snapshot: existing,
    });

    // Record evidence
    this.recordEvidence({
      evidence_id: `ev_merge_${Date.now()}`,
      entity_id: targetCanonicalId,
      entity_type: "character",
      source_id: review.source_id,
      source_name: review.source_name,
      source_url: "https://www.onepieceapi.com/",
      external_id: review.external_id,
      raw_record_id: review.raw_record_id,
      retrieval_date: review.created_at,
      last_verified_date: new Date().toISOString(),
      confidence: review.confidence_score,
      canon_status: review.proposed_canon_status,
      citation_notes: `Merged into ${existing.name} by ${adminName}. Raw record ID: ${review.raw_record_id}`,
    });

    review.status = "MERGED";
    review.reviewed_at = new Date().toISOString();
    review.reviewed_by = adminName;
    review.admin_notes = `Merged into canonical entity ${targetCanonicalId} (${existing.name})`;
    this.pendingReviews.set(reviewId, review);

    return { success: true, entity: existing };
  }
}

// Global Singleton
export const canonicalDb = new CanonicalDatabaseStore();

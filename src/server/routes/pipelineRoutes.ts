import { Router } from "express";
import { canonicalDb } from "../database/canonicalStore";
import { ingestionService } from "../pipeline/ingestionService";

export const pipelineRouter = Router();

// --- 1. Source Registry Endpoints ---
pipelineRouter.get("/pipeline/sources", (_req, res) => {
  const sources = canonicalDb.getAllSources();
  res.json({ sources });
});

pipelineRouter.post("/pipeline/sources", (req, res) => {
  try {
    const { source_name, source_type, base_url, api_endpoint, reliability_level, notes } = req.body;
    if (!source_name || !source_type || !base_url) {
      return res.status(400).json({ error: "source_name, source_type, and base_url are required" });
    }
    const sourceId = `src_${Date.now()}_${source_name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    const newSource = {
      source_id: sourceId,
      source_name,
      source_type,
      base_url,
      api_endpoint: api_endpoint || base_url,
      reliability_level: reliability_level || 5,
      last_successful_sync: null,
      last_attempted_sync: null,
      sync_status: "IDLE" as const,
      notes: notes || "",
    };
    canonicalDb.sources.set(sourceId, newSource);
    res.json({ success: true, source: newSource });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. Ingestion Batches & Triggering ---
pipelineRouter.get("/pipeline/batches", (_req, res) => {
  const batches = canonicalDb.getAllBatches();
  res.json({ batches });
});

pipelineRouter.get("/pipeline/batches/:id", (req, res) => {
  const batch = canonicalDb.getBatch(req.params.id);
  if (!batch) return res.status(404).json({ error: "Batch not found" });
  res.json({ batch });
});

pipelineRouter.post("/pipeline/ingest", async (req, res) => {
  try {
    const { sourceId = "src_onepiece_api", entityType = "character", options = {} } = req.body;
    const batch = await ingestionService.runIngestion(sourceId, entityType, options);
    res.json({ success: true, batch });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- 3. Raw Data Record Inspector ---
pipelineRouter.get("/pipeline/raw/:id", (req, res) => {
  const record = canonicalDb.getRawRecord(req.params.id);
  if (!record) return res.status(404).json({ error: "Raw record not found" });
  res.json({ record });
});

// --- 4. Admin Review Queue & Moderation ---
pipelineRouter.get("/pipeline/reviews", (req, res) => {
  const { status } = req.query;
  const reviews = canonicalDb.getPendingReviews(status as any);
  res.json({ reviews });
});

pipelineRouter.post("/pipeline/reviews/:id/approve", (req, res) => {
  try {
    const { adminName = "Admin Archivist", overrides } = req.body;
    const result = canonicalDb.approveAndPublish(req.params.id, adminName, overrides);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true, entity: result.entity });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

pipelineRouter.post("/pipeline/reviews/:id/reject", (req, res) => {
  try {
    const { reason = "Rejected by administrator", adminName = "Admin Archivist" } = req.body;
    const ok = canonicalDb.rejectReview(req.params.id, reason, adminName);
    if (!ok) return res.status(404).json({ error: "Review item not found" });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

pipelineRouter.post("/pipeline/reviews/:id/merge", (req, res) => {
  try {
    const { targetCanonicalId, adminName = "Admin Archivist" } = req.body;
    if (!targetCanonicalId) {
      return res.status(400).json({ error: "targetCanonicalId is required for entity merge" });
    }
    const result = canonicalDb.mergeIntoExisting(req.params.id, targetCanonicalId, adminName);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true, entity: result.entity });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- 5. Canonical Database Queries ---
pipelineRouter.get("/canonical/characters", (_req, res) => {
  const characters = Array.from(canonicalDb.characters.values());
  res.json({ characters });
});

pipelineRouter.get("/canonical/devil-fruits", (_req, res) => {
  const fruits = Array.from(canonicalDb.devilFruits.values());
  res.json({ fruits });
});

pipelineRouter.get("/canonical/locations", (_req, res) => {
  const locations = Array.from(canonicalDb.locations.values());
  res.json({ locations });
});

pipelineRouter.get("/canonical/ships", (_req, res) => {
  const ships = Array.from(canonicalDb.ships.values());
  res.json({ ships });
});

pipelineRouter.get("/canonical/bounties", (_req, res) => {
  const allBounties: any[] = [];
  canonicalDb.bountyHistories.forEach((bList) => allBounties.push(...bList));
  res.json({ bounties: allBounties });
});

// --- 6. Evidence & Revision History ---
pipelineRouter.get("/canonical/evidence/:entityId", (req, res) => {
  const evidence = canonicalDb.getEvidenceForEntity(req.params.entityId);
  res.json({ evidence });
});

pipelineRouter.get("/canonical/revisions", (_req, res) => {
  const revisions = canonicalDb.getAllRevisions();
  res.json({ revisions });
});

pipelineRouter.get("/canonical/revisions/:entityId", (req, res) => {
  const revisions = canonicalDb.getRevisionsForEntity(req.params.entityId);
  res.json({ revisions });
});

// --- 7. Full Automated Pipeline Demonstration Endpoint ---
pipelineRouter.post("/pipeline/demonstrate-import", async (_req, res) => {
  try {
    // 1. Ingest characters from One Piece API
    const charBatch = await ingestionService.runIngestion("src_onepiece_api", "character", { limit: 5 });
    // 2. Ingest devil fruits from One Piece API
    const fruitBatch = await ingestionService.runIngestion("src_onepiece_api", "devil_fruit", { limit: 4 });
    // 3. Ingest ships from One Piece API
    const shipBatch = await ingestionService.runIngestion("src_onepiece_api", "ship", { limit: 3 });
    // 4. Ingest locations from One Piece API
    const locBatch = await ingestionService.runIngestion("src_onepiece_api", "location", { limit: 3 });

    res.json({
      success: true,
      message: "Data Ingestion Pipeline demonstration completed successfully.",
      batches: [charBatch, fruitBatch, shipBatch, locBatch],
      pendingReviewsCount: canonicalDb.getPendingReviews("PENDING_REVIEW").length,
      duplicateCandidatesCount: canonicalDb.duplicateCandidates.size,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

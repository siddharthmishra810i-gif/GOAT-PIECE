import React, { useState, useEffect } from "react";
import {
  Database,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  History,
  ShieldCheck,
  ShieldAlert,
  GitMerge,
  Split,
  Eye,
  Plus,
  Search,
  ExternalLink,
  Layers,
  Terminal,
  Clock,
  Sparkles,
  Server,
  FileText,
  XCircle,
  HelpCircle,
} from "lucide-react";
import {
  SourceRecord,
  ImportBatch,
  PendingReviewItem,
  CanonicalCharacter,
  CanonicalDevilFruit,
  CanonicalLocation,
  CanonicalShip,
  CanonicalBountyHistory,
  EntityRevision,
  EvidenceRecord,
  RawDataRecord,
  CanonStatus,
  PipelineEntityType,
} from "../types/pipeline";

interface DataArchitectureDashboardProps {
  onSelectCharacter?: (id: string) => void;
}

export const DataArchitectureDashboard: React.FC<DataArchitectureDashboardProps> = () => {
  // Navigation sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "sources" | "reviews" | "canonical" | "revisions" | "raw">(
    "pipeline"
  );

  // Data state
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReviewItem[]>([]);
  const [canonicalCharacters, setCanonicalCharacters] = useState<CanonicalCharacter[]>([]);
  const [canonicalFruits, setCanonicalFruits] = useState<CanonicalDevilFruit[]>([]);
  const [canonicalLocations, setCanonicalLocations] = useState<CanonicalLocation[]>([]);
  const [canonicalShips, setCanonicalShips] = useState<CanonicalShip[]>([]);
  const [canonicalBounties, setCanonicalBounties] = useState<CanonicalBountyHistory[]>([]);
  const [allRevisions, setAllRevisions] = useState<EntityRevision[]>([]);

  // Loading and feedback state
  const [isLoading, setIsLoading] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestFeedback, setIngestFeedback] = useState<string | null>(null);

  // Ingest form state
  const [selectedSourceId, setSelectedSourceId] = useState<string>("src_onepiece_api");
  const [selectedEntityType, setSelectedEntityType] = useState<PipelineEntityType>("character");
  const [ingestLimit, setIngestLimit] = useState<number>(5);

  // Modals / Inspectors
  const [inspectingRaw, setInspectingRaw] = useState<RawDataRecord | null>(null);
  const [inspectingEvidence, setInspectingEvidence] = useState<{ entityId: string; records: EvidenceRecord[] } | null>(null);
  const [inspectingRevisions, setInspectingRevisions] = useState<{ entityId: string; entityName: string; records: EntityRevision[] } | null>(null);
  const [editReviewItem, setEditReviewItem] = useState<PendingReviewItem | null>(null);

  // New source modal
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState<SourceRecord["source_type"]>("API");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceReliability, setNewSourceReliability] = useState(8);
  const [newSourceNotes, setNewSourceNotes] = useState("");

  // Filter for Canonical Database view
  const [canonicalFilterType, setCanonicalFilterType] = useState<"character" | "devil_fruit" | "location" | "ship" | "bounty">("character");
  const [canonicalSearchQuery, setCanonicalSearchQuery] = useState("");

  // Load all initial data from backend API
  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const [srcRes, batchRes, revRes, charRes, fruitRes, locRes, shipRes, bountyRes, revsRes] = await Promise.all([
        fetch("/api/pipeline/sources").then((r) => r.json()),
        fetch("/api/pipeline/batches").then((r) => r.json()),
        fetch("/api/pipeline/reviews").then((r) => r.json()),
        fetch("/api/canonical/characters").then((r) => r.json()),
        fetch("/api/canonical/devil-fruits").then((r) => r.json()),
        fetch("/api/canonical/locations").then((r) => r.json()),
        fetch("/api/canonical/ships").then((r) => r.json()),
        fetch("/api/canonical/bounties").then((r) => r.json()),
        fetch("/api/canonical/revisions").then((r) => r.json()),
      ]);

      if (srcRes.sources) setSources(srcRes.sources);
      if (batchRes.batches) setBatches(batchRes.batches);
      if (revRes.reviews) setPendingReviews(revRes.reviews);
      if (charRes.characters) setCanonicalCharacters(charRes.characters);
      if (fruitRes.fruits) setCanonicalFruits(fruitRes.fruits);
      if (locRes.locations) setCanonicalLocations(locRes.locations);
      if (shipRes.ships) setCanonicalShips(shipRes.ships);
      if (bountyRes.bounties) setCanonicalBounties(bountyRes.bounties);
      if (revsRes.revisions) setAllRevisions(revsRes.revisions);
    } catch (err) {
      console.error("Failed to load pipeline data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Trigger automated end-to-end pipeline demonstration
  const handleDemonstratePipeline = async () => {
    setIsIngesting(true);
    setIngestFeedback("Executing full ingestion pipeline from One Piece API (Fetch → Raw Storage → Normalization → Deduplication → Review Queue)...");
    try {
      const res = await fetch("/api/pipeline/demonstrate-import", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIngestFeedback(`Pipeline executed! ${data.pendingReviewsCount} records queued for Admin Review with ${data.duplicateCandidatesCount} duplicate candidates flagged for human verification.`);
        await refreshAllData();
      } else {
        setIngestFeedback(`Pipeline error: ${data.error}`);
      }
    } catch (err: any) {
      setIngestFeedback(`Network error during ingestion: ${err.message}`);
    } finally {
      setIsIngesting(false);
      setTimeout(() => setIngestFeedback(null), 8000);
    }
  };

  // Trigger manual source ingestion
  const handleTriggerIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIngesting(true);
    setIngestFeedback(`Connecting to source and fetching ${selectedEntityType} records...`);
    try {
      const res = await fetch("/api/pipeline/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: selectedSourceId,
          entityType: selectedEntityType,
          options: { limit: ingestLimit },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIngestFeedback(`Ingested ${data.batch.records_fetched} records from ${data.batch.source_name}! Stored raw data, normalized schemas, and queued for review.`);
        await refreshAllData();
      } else {
        setIngestFeedback(`Ingestion error: ${data.error}`);
      }
    } catch (err: any) {
      setIngestFeedback(`Ingestion failed: ${err.message}`);
    } finally {
      setIsIngesting(false);
      setTimeout(() => setIngestFeedback(null), 6000);
    }
  };

  // Admin Review: Approve & Publish
  const handleApprove = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/pipeline/reviews/${reviewId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminName: "Chief Archivist Admin" }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Review: Reject
  const handleReject = async (reviewId: string) => {
    const reason = prompt("Enter rejection reason (e.g., 'Contradicts Chapter 1060 canon' or 'Duplicate malformed record'):");
    if (!reason) return;
    try {
      const res = await fetch(`/api/pipeline/reviews/${reviewId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, adminName: "Chief Archivist Admin" }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Review: Merge into Existing Canonical Entity
  const handleMerge = async (reviewId: string, targetCanonicalId: string) => {
    try {
      const res = await fetch(`/api/pipeline/reviews/${reviewId}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCanonicalId,
          adminName: "Chief Archivist Admin",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshAllData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // View Raw Record modal
  const handleViewRaw = async (rawRecordId: string) => {
    try {
      const res = await fetch(`/api/pipeline/raw/${rawRecordId}`);
      const data = await res.json();
      if (data.record) {
        setInspectingRaw(data.record);
      }
    } catch (err) {
      console.error("Failed to fetch raw record", err);
    }
  };

  // View Evidence Traceability modal
  const handleViewEvidence = async (entityId: string) => {
    try {
      const res = await fetch(`/api/canonical/evidence/${entityId}`);
      const data = await res.json();
      setInspectingEvidence({ entityId, records: data.evidence || [] });
    } catch (err) {
      console.error(err);
    }
  };

  // View Revision History modal
  const handleViewRevisions = async (entityId: string, entityName: string) => {
    try {
      const res = await fetch(`/api/canonical/revisions/${entityId}`);
      const data = await res.json();
      setInspectingRevisions({ entityId, entityName, records: data.revisions || [] });
    } catch (err) {
      console.error(err);
    }
  };

  // Register New Source
  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;
    try {
      const res = await fetch("/api/pipeline/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_name: newSourceName,
          source_type: newSourceType,
          base_url: newSourceUrl,
          reliability_level: newSourceReliability,
          notes: newSourceNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddSourceModal(false);
        setNewSourceName("");
        setNewSourceUrl("");
        setNewSourceNotes("");
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCanonBadge = (status: CanonStatus) => {
    switch (status) {
      case "CANON_CONFIRMED":
        return { color: "bg-emerald-950 text-emerald-300 border-emerald-800", icon: CheckCircle2 };
      case "CANON_REFERENCE":
        return { color: "bg-sky-950 text-sky-300 border-sky-800", icon: ShieldCheck };
      case "STRONG_EVIDENCE":
        return { color: "bg-blue-950 text-blue-300 border-blue-800", icon: ShieldCheck };
      case "PLAUSIBLE":
        return { color: "bg-amber-950 text-amber-300 border-amber-800", icon: Sparkles };
      case "THEORY":
      case "SPECULATION":
        return { color: "bg-purple-950 text-purple-300 border-purple-800", icon: AlertTriangle };
      case "DISPROVEN":
        return { color: "bg-rose-950 text-rose-300 border-rose-800", icon: XCircle };
      default:
        return { color: "bg-slate-800 text-slate-300 border-slate-700", icon: HelpCircle };
    }
  };

  const pendingCount = pendingReviews.filter((r) => r.status === "PENDING_REVIEW").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Platform Title Banner */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                Data Architecture & Ingestion Platform
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                Live Server Connected
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
              One Piece API & Canon Data Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Multi-source data ingestion engine. Decouples external data sources (REST API, MediaWiki, CSV) from the canonical database using schema normalization, entity resolution deduplication, raw checksum logging, and mandatory admin verification.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDemonstratePipeline}
              disabled={isIngesting}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isIngesting ? "Ingesting Pipeline..." : "Run One Piece API Import Demo"}</span>
            </button>

            <button
              onClick={refreshAllData}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 active:scale-95 transition-all"
              title="Refresh all metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Real-time Ingestion Feedback Banner */}
        {ingestFeedback && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-center space-x-3 text-xs text-amber-200 animate-fadeIn">
            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
            <span className="font-mono">{ingestFeedback}</span>
          </div>
        )}

        {/* Live Architecture Flow Map */}
        <div className="pt-3 border-t border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
            9-Stage Data Ingestion Pipeline:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1.5 text-center text-[10px] font-mono">
            {[
              { step: "1. Sources", desc: "One Piece API / Wiki", color: "border-sky-500/30 bg-sky-950/30 text-sky-300" },
              { step: "2. Registry", desc: `${sources.length} Registered`, color: "border-sky-500/30 bg-sky-950/30 text-sky-300" },
              { step: "3. Fetcher", desc: "Rate Limit / Timeout", color: "border-blue-500/30 bg-blue-950/30 text-blue-300" },
              { step: "4. Raw Storage", desc: "SHA-256 Checksums", color: "border-indigo-500/30 bg-indigo-950/30 text-indigo-300" },
              { step: "5. Normalizer", desc: "Internal Schema", color: "border-purple-500/30 bg-purple-950/30 text-purple-300" },
              { step: "6. Resolution", desc: "Duplicate Detection", color: "border-amber-500/40 bg-amber-950/30 text-amber-300" },
              { step: "7. Canon Guard", desc: "Anti-Hallucination", color: "border-emerald-500/30 bg-emerald-950/30 text-emerald-300" },
              { step: "8. Admin Review", desc: `${pendingCount} Pending`, color: pendingCount > 0 ? "border-amber-500 bg-amber-500/20 text-amber-200 font-bold" : "border-slate-700 bg-slate-900 text-slate-400" },
              { step: "9. Canonical DB", desc: "Live Fan Encyclopedia", color: "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-bold" },
            ].map((st, idx) => (
              <div key={idx} className={`p-2 rounded-lg border ${st.color} flex flex-col justify-center`}>
                <div className="font-bold">{st.step}</div>
                <div className="text-[9px] opacity-80 mt-0.5">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          {[
            { id: "pipeline", label: "Pipeline & Ingest System", icon: Layers },
            { id: "reviews", label: `Admin Review Queue (${pendingCount})`, icon: ShieldCheck, badge: pendingCount > 0 },
            { id: "canonical", label: "Canonical Database", icon: Database },
            { id: "sources", label: `Source Registry (${sources.length})`, icon: Server },
            { id: "revisions", label: `Revision History (${allRevisions.length})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-900/30"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-amber-200 border border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- SUBTAB 1: PIPELINE & INGEST SYSTEM --- */}
      {activeSubTab === "pipeline" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ingest Control Form Card */}
          <div className="lg:col-span-5 rounded-2xl bg-[#09152b] border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-sky-400" />
                <h3 className="font-display text-base font-bold text-slate-100">
                  Execute Data Ingestion
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Adapter / Importer Layer</span>
            </div>

            <form onSubmit={handleTriggerIngest} className="space-y-4 text-xs">
              {/* Select Registered Source */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  External Data Source:
                </label>
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  {sources.map((s) => (
                    <option key={s.source_id} value={s.source_id}>
                      {s.source_name} ({s.source_type} - Reliability {s.reliability_level}/10)
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Entity Type */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Target Entity Type:
                </label>
                <select
                  value={selectedEntityType}
                  onChange={(e) => setSelectedEntityType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="character">Characters (Character, Aliases, Bounties)</option>
                  <option value="devil_fruit">Devil Fruits (Name, Type, Users, Awakening)</option>
                  <option value="location">Islands & Locations (Sea, Type, Debut)</option>
                  <option value="ship">Ships & Vessels (Type, Shipwright, Status)</option>
                  <option value="bounty">Bounties (BountyHistory, Arc, Chapter)</option>
                </select>
              </div>

              {/* Fetch Limit */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Records Limit / Page Size:
                </label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={ingestLimit}
                  onChange={(e) => setIngestLimit(parseInt(e.target.value, 10) || 5)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:outline-none"
                />
              </div>

              {/* Architecture Safety Guarantees Callout */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div className="font-bold text-amber-300 font-mono flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pipeline Safety Guarantees:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  <li>Never blindly overwrites existing verified canonical records.</li>
                  <li>Original payloads stored with SHA-256 checksums in Raw Storage.</li>
                  <li>Fuzzy Levenshtein & alias deduplication flags potential conflicts.</li>
                  <li>All entries quarantine in PENDING_REVIEW before publishing.</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isIngesting}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isIngesting ? "animate-spin" : ""}`} />
                <span>{isIngesting ? "Processing Ingestion Pipeline..." : "Dispatch Ingestion Pipeline"}</span>
              </button>
            </form>
          </div>

          {/* Import Batches Log History */}
          <div className="lg:col-span-7 rounded-2xl bg-[#09152b] border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h3 className="font-display text-base font-bold text-slate-100">
                  Ingestion Batches & Pipeline Logs ({batches.length})
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Incremental Audit Trail</span>
            </div>

            {batches.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-mono space-y-2">
                <div>No ingestion batches have run yet.</div>
                <div>Click "Run One Piece API Import Demo" above to start your first sync!</div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {batches.map((batch) => (
                  <div
                    key={batch.batch_id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-amber-300">{batch.batch_id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                          {batch.entity_type}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          batch.status === "COMPLETED"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : batch.status === "FAILED"
                            ? "bg-rose-950 text-rose-300 border border-rose-800"
                            : "bg-amber-950 text-amber-300 border border-amber-800"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono pt-1 pb-1 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div>
                        <div className="text-slate-500 text-[10px]">Fetched</div>
                        <div className="font-bold text-slate-200">{batch.records_fetched}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Normalized</div>
                        <div className="font-bold text-slate-200">{batch.records_normalized}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Duplicates Flagged</div>
                        <div className="font-bold text-amber-300">{batch.records_duplicates_flagged}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Queued Review</div>
                        <div className="font-bold text-emerald-400">{batch.records_pending_review}</div>
                      </div>
                    </div>

                    {/* Batch Logs snippet */}
                    <div className="p-2 rounded bg-black/50 font-mono text-[10px] text-slate-400 space-y-0.5 max-h-24 overflow-y-auto">
                      {batch.logs.slice(-4).map((l, i) => (
                        <div key={i} className="truncate">
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: ADMIN REVIEW QUEUE --- */}
      {activeSubTab === "reviews" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#09152b] border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="font-display text-base font-bold text-slate-100">
                Admin Review & Moderation Queue
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Inspect raw payloads, review duplicate detection scores, verify canonical evidence, and publish to the Canonical Database.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-slate-400">Status:</span>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold">
                {pendingCount} Awaiting Decision
              </span>
            </div>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#09152b] border border-slate-800 text-slate-400 space-y-3">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
              <div className="font-bold text-sm text-slate-200">Admin Review Queue is Clear!</div>
              <p className="text-xs max-w-md mx-auto text-slate-400">
                All imported items have been verified and published. Run an ingestion batch to bring in new records from the One Piece API.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => {
                const norm = review.normalized_data;
                const badge = getCanonBadge(review.proposed_canon_status);
                const BadgeIcon = badge.icon;
                const hasDuplicates = review.duplicate_candidates && review.duplicate_candidates.length > 0;

                return (
                  <div
                    key={review.review_id}
                    className={`rounded-2xl border p-5 shadow-xl transition-all ${
                      review.status === "APPROVED"
                        ? "bg-emerald-950/15 border-emerald-900/50"
                        : review.status === "REJECTED"
                        ? "bg-rose-950/15 border-rose-900/50 opacity-60"
                        : review.status === "MERGED"
                        ? "bg-purple-950/15 border-purple-900/50"
                        : hasDuplicates
                        ? "bg-[#0b162c] border-amber-500/50"
                        : "bg-[#09152b] border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: Entity Overview */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            {review.entity_type}
                          </span>
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                            <BadgeIcon className="w-3 h-3" />
                            <span>{review.proposed_canon_status}</span>
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Source: <strong className="text-slate-200">{review.source_name}</strong>
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            (Confidence: {Math.round(review.confidence_score * 100)}%)
                          </span>
                        </div>

                        <div className="flex items-baseline space-x-3">
                          <h4 className="font-display text-lg font-bold text-slate-100">
                            {norm.name}
                          </h4>
                          {norm.japanese_name && (
                            <span className="text-xs text-amber-300/80 font-mono">
                              {norm.japanese_name}
                            </span>
                          )}
                        </div>

                        {/* Normalized Field Preview */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          {norm.bounty && (
                            <div>
                              <span className="text-slate-500">Bounty:</span>{" "}
                              <span className="text-amber-300 font-bold">{norm.bounty}</span>
                            </div>
                          )}
                          {norm.affiliation && (
                            <div>
                              <span className="text-slate-500">Affiliation:</span>{" "}
                              <span className="text-slate-200">{norm.affiliation}</span>
                            </div>
                          )}
                          {norm.role && (
                            <div>
                              <span className="text-slate-500">Role:</span>{" "}
                              <span className="text-slate-200">{norm.role}</span>
                            </div>
                          )}
                          {norm.devil_fruit && (
                            <div>
                              <span className="text-slate-500">Fruit:</span>{" "}
                              <span className="text-purple-300">{norm.devil_fruit}</span>
                            </div>
                          )}
                          {norm.type && (
                            <div>
                              <span className="text-slate-500">Type:</span>{" "}
                              <span className="text-slate-200">{norm.type}</span>
                            </div>
                          )}
                          {norm.sea_region && (
                            <div>
                              <span className="text-slate-500">Sea:</span>{" "}
                              <span className="text-slate-200">{norm.sea_region}</span>
                            </div>
                          )}
                        </div>

                        {/* Aliases */}
                        {norm.aliases && norm.aliases.length > 0 && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            <span className="text-slate-500">Aliases:</span>{" "}
                            {norm.aliases.join(", ")}
                          </div>
                        )}

                        {/* Duplicate Alert Card */}
                        {hasDuplicates && review.status === "PENDING_REVIEW" && (
                          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/60 space-y-2 text-xs">
                            <div className="flex items-center justify-between text-amber-300 font-bold font-mono">
                              <span className="flex items-center space-x-1.5">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                <span>Potential Duplicate Detected by Entity Resolution Engine!</span>
                              </span>
                              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">
                                {review.duplicate_candidates![0].similarity_score}% Match
                              </span>
                            </div>
                            <div className="text-slate-300 text-[11px]">
                              Incoming record <strong className="text-amber-200">"{norm.name}"</strong> matches existing canonical entity:{" "}
                              <strong className="text-emerald-300">
                                "{review.duplicate_candidates![0].existing_entity_name}"
                              </strong>{" "}
                              ({review.duplicate_candidates![0].existing_entity_id}).
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              Reasons: {review.duplicate_candidates![0].match_reasons.join(" · ")}
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                              <button
                                onClick={() =>
                                  handleMerge(review.review_id, review.duplicate_candidates![0].existing_entity_id)
                                }
                                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono shadow transition-all"
                              >
                                <GitMerge className="w-3.5 h-3.5" />
                                <span>Merge into "{review.duplicate_candidates![0].existing_entity_name}"</span>
                              </button>
                              <button
                                onClick={() => handleApprove(review.review_id)}
                                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all"
                              >
                                <Split className="w-3.5 h-3.5" />
                                <span>Keep Separate & Publish as New</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions & Traceability Inspector */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 shrink-0">
                        {review.status === "PENDING_REVIEW" ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleViewRaw(review.raw_record_id)}
                              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                              title="Inspect original raw JSON and SHA-256 checksum"
                            >
                              <FileCode className="w-3.5 h-3.5 text-sky-400" />
                              <span>Raw Data & Hash</span>
                            </button>

                            <button
                              onClick={() => handleApprove(review.review_id)}
                              className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono shadow-md transition-all active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve & Publish</span>
                            </button>

                            <button
                              onClick={() => handleReject(review.review_id)}
                              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-mono transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-right text-xs font-mono">
                            <span
                              className={`px-2.5 py-1 rounded font-bold uppercase ${
                                review.status === "APPROVED"
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : review.status === "MERGED"
                                  ? "bg-purple-950 text-purple-300 border border-purple-800"
                                  : "bg-rose-950 text-rose-300 border border-rose-800"
                              }`}
                            >
                              {review.status}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">
                              By {review.reviewed_by || "Admin"} · {review.reviewed_at?.split("T")[0]}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- SUBTAB 3: CANONICAL DATABASE --- */}
      {activeSubTab === "canonical" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#09152b] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            {/* Entity Table Filter */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono">
              <span className="text-slate-400 mr-1 text-[11px]">Canonical Table:</span>
              {[
                { id: "character", label: `Characters (${canonicalCharacters.length})` },
                { id: "devil_fruit", label: `Devil Fruits (${canonicalFruits.length})` },
                { id: "location", label: `Locations (${canonicalLocations.length})` },
                { id: "ship", label: `Ships (${canonicalShips.length})` },
                { id: "bounty", label: `Bounties (${canonicalBounties.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCanonicalFilterType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                    canonicalFilterType === tab.id
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search filter */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search canonical entities..."
                value={canonicalSearchQuery}
                onChange={(e) => setCanonicalSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Canonical Table Display */}
          <div className="rounded-2xl border border-slate-800 bg-[#09152b] overflow-hidden shadow-2xl">
            {canonicalFilterType === "character" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 text-[10px] uppercase">
                      <th className="p-3">Canonical Entity</th>
                      <th className="p-3">Aliases</th>
                      <th className="p-3">Bounty</th>
                      <th className="p-3">Canon Status</th>
                      <th className="p-3 text-center">Version</th>
                      <th className="p-3 text-center">Traceability & Revision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {canonicalCharacters
                      .filter((c) =>
                        c.name.toLowerCase().includes(canonicalSearchQuery.toLowerCase()) ||
                        c.aliases.some((a) => a.toLowerCase().includes(canonicalSearchQuery.toLowerCase()))
                      )
                      .map((char) => {
                        const badge = getCanonBadge(char.canon_status);
                        const BadgeIcon = badge.icon;
                        return (
                          <tr key={char.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-slate-100 text-sm">{char.name}</div>
                              {char.japanese_name && (
                                <div className="text-[11px] text-amber-300/80">{char.japanese_name}</div>
                              )}
                              <div className="text-[10px] text-slate-500">ID: {char.id}</div>
                            </td>
                            <td className="p-3 text-slate-300">
                              {char.aliases && char.aliases.length > 0 ? char.aliases.join(", ") : "—"}
                            </td>
                            <td className="p-3 text-amber-300 font-bold">
                              {char.bounty || "Unknown"}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                                <BadgeIcon className="w-3 h-3" />
                                <span>{char.canon_status}</span>
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[11px] font-bold">
                                v{char.current_version}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center space-x-1.5">
                                <button
                                  onClick={() => handleViewEvidence(char.id)}
                                  className="px-2.5 py-1 rounded bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 text-[11px] flex items-center space-x-1"
                                  title="View source citation and provenance trace"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>Source ({char.evidence_count})</span>
                                </button>
                                <button
                                  onClick={() => handleViewRevisions(char.id, char.name)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center space-x-1"
                                  title="View revision changelog"
                                >
                                  <History className="w-3 h-3" />
                                  <span>History</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}

            {canonicalFilterType === "devil_fruit" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 text-[10px] uppercase">
                      <th className="p-3">Devil Fruit</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Current User</th>
                      <th className="p-3">Awakening</th>
                      <th className="p-3">Canon Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {canonicalFruits.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-900/40">
                        <td className="p-3">
                          <div className="font-bold text-slate-100">{f.name}</div>
                          {f.japanese_name && <div className="text-[11px] text-amber-300/80">{f.japanese_name}</div>}
                        </td>
                        <td className="p-3 text-purple-300">{f.type}</td>
                        <td className="p-3 text-slate-200">{f.current_user}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${f.awakening_status === "Confirmed" ? "bg-emerald-950 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                            {f.awakening_status}
                          </span>
                        </td>
                        <td className="p-3 text-emerald-400 font-bold">{f.canon_status}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleViewEvidence(f.id)}
                            className="px-2 py-1 rounded bg-sky-950 border border-sky-800 text-sky-300 text-[11px]"
                          >
                            Evidence ({f.evidence_count})
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {canonicalFilterType === "location" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 text-[10px] uppercase">
                      <th className="p-3">Island / Location</th>
                      <th className="p-3">Sea Region</th>
                      <th className="p-3">Affiliation</th>
                      <th className="p-3">Canon Status</th>
                      <th className="p-3 text-center">Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {canonicalLocations.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-slate-100">{l.name}</td>
                        <td className="p-3 text-sky-300">{l.sea_region}</td>
                        <td className="p-3 text-slate-200">{l.affiliation}</td>
                        <td className="p-3 text-emerald-400 font-bold">{l.canon_status}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleViewEvidence(l.id)}
                            className="px-2 py-1 rounded bg-sky-950 border border-sky-800 text-sky-300 text-[11px]"
                          >
                            Evidence ({l.evidence_count})
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {canonicalFilterType === "ship" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 text-[10px] uppercase">
                      <th className="p-3">Vessel Name</th>
                      <th className="p-3">Affiliation</th>
                      <th className="p-3">Shipwright</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {canonicalShips.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-slate-100">{s.name}</td>
                        <td className="p-3 text-slate-200">{s.affiliation}</td>
                        <td className="p-3 text-amber-300">{s.shipwright || "Unknown"}</td>
                        <td className="p-3 text-slate-300">{s.status}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleViewEvidence(s.id)}
                            className="px-2 py-1 rounded bg-sky-950 border border-sky-800 text-sky-300 text-[11px]"
                          >
                            Evidence ({s.evidence_count})
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUBTAB 4: SOURCE REGISTRY --- */}
      {activeSubTab === "sources" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#09152b] border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-slate-100">
                Registered Data Sources
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Multi-source registry managing API endpoints, reliability ratings, rate limits, and synchronization health.
              </p>
            </div>
            <button
              onClick={() => setShowAddSourceModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Source</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src) => (
              <div
                key={src.source_id}
                className="p-5 rounded-2xl bg-[#09152b] border border-slate-800 space-y-3 shadow-xl"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-amber-300 font-bold">
                      {src.source_type}
                    </span>
                    <h4 className="font-display text-lg font-bold text-slate-100 mt-1">
                      {src.source_name}
                    </h4>
                    <div className="text-[11px] font-mono text-sky-400 truncate max-w-sm">
                      {src.base_url}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      src.sync_status === "SUCCESS"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : src.sync_status === "SYNCING"
                        ? "bg-sky-950 text-sky-300 border border-sky-800 animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {src.sync_status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {src.notes}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                  <div>
                    <div className="text-slate-500">Reliability</div>
                    <div className="font-bold text-amber-300">{src.reliability_level} / 10</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Rate Limit</div>
                    <div className="text-slate-200">{src.rate_limit_rpm || 60} rpm</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Last Sync</div>
                    <div className="text-slate-300">{src.last_successful_sync?.split("T")[0] || "Never"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB 5: REVISION HISTORY (GLOBAL AUDIT TRAIL) --- */}
      {activeSubTab === "revisions" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#09152b] border border-slate-800 text-xs space-y-1">
            <h3 className="font-display text-base font-bold text-slate-100">
              Complete Revision & Versioning Log
            </h3>
            <p className="text-slate-400">
              Tracks every modification, field delta, source attribution, and approving archivist for all canonical records.
            </p>
          </div>

          <div className="space-y-3">
            {allRevisions.map((rev) => (
              <div
                key={rev.revision_id}
                className="p-4 rounded-2xl bg-[#09152b] border border-slate-800 space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-300">{rev.revision_id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {rev.entity_type} · {rev.entity_id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      v{rev.version_number}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{rev.changed_at}</span>
                </div>

                <div className="text-slate-200">{rev.comment}</div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <div>
                    Source: <span className="text-sky-300">{rev.source_name}</span>
                  </div>
                  <div>
                    Approved By: <span className="text-emerald-300 font-bold">{rev.approved_by}</span>
                  </div>
                </div>

                {/* Diff table */}
                {rev.diff && rev.diff.length > 0 && (
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800 text-[10px] space-y-1">
                    {rev.diff.map((d, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="text-amber-400 font-bold uppercase">{d.field}:</span>
                        <span className="text-rose-400 line-through truncate max-w-xs">
                          {typeof d.old_value === "object" ? JSON.stringify(d.old_value) : String(d.old_value)}
                        </span>
                        <span>→</span>
                        <span className="text-emerald-400 font-medium truncate max-w-sm">
                          {typeof d.new_value === "object" ? JSON.stringify(d.new_value) : String(d.new_value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL: RAW RECORD & CHECKSUM INSPECTOR --- */}
      {inspectingRaw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-[#09152b] border border-sky-500/50 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-sky-400" />
                <h3 className="font-display text-base font-bold text-slate-100">
                  Raw Data Storage & Provenance Hash
                </h3>
              </div>
              <button
                onClick={() => setInspectingRaw(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500">Raw Record ID:</span>
                  <div className="text-amber-300 font-bold">{inspectingRaw.raw_record_id}</div>
                </div>
                <div>
                  <span className="text-slate-500">External ID:</span>
                  <div className="text-slate-200">{inspectingRaw.external_id}</div>
                </div>
                <div>
                  <span className="text-slate-500">Source ID:</span>
                  <div className="text-sky-400">{inspectingRaw.source_id}</div>
                </div>
                <div>
                  <span className="text-slate-500">Retrieved At:</span>
                  <div className="text-slate-300">{inspectingRaw.retrieved_at}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] uppercase">SHA-256 Cryptographic Checksum:</span>
                <div className="p-2 rounded bg-black/70 border border-slate-800 text-[11px] text-emerald-400 break-all select-all">
                  {inspectingRaw.checksum}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] uppercase">Original Raw Payload:</span>
                <pre className="p-3 rounded-xl bg-black/80 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto max-h-60">
                  {JSON.stringify(inspectingRaw.raw_payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingRaw(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: SOURCE TRACEABILITY & EVIDENCE --- */}
      {inspectingEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-[#09152b] border border-amber-500/50 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-display text-base font-bold text-slate-100">
                  Source Evidence & Provenance Trace
                </h3>
              </div>
              <button
                onClick={() => setInspectingEvidence(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="text-slate-300 font-mono">
                Entity ID: <strong className="text-amber-300">{inspectingEvidence.entityId}</strong>
              </div>

              {inspectingEvidence.records.length === 0 ? (
                <div className="p-6 text-center text-slate-500 font-mono">
                  No explicit evidence citations recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {inspectingEvidence.records.map((ev) => (
                    <div
                      key={ev.evidence_id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">{ev.source_name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                          {ev.canon_status}
                        </span>
                      </div>

                      <div className="text-slate-300 font-sans text-xs">{ev.citation_notes}</div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                        <div>
                          External ID: <span className="text-slate-200">{ev.external_id}</span>
                        </div>
                        <div>
                          Confidence:{" "}
                          <span className="text-emerald-400 font-bold">
                            {Math.round(ev.confidence * 100)}%
                          </span>
                        </div>
                        <div>
                          Retrieved: <span className="text-slate-300">{ev.retrieval_date.split("T")[0]}</span>
                        </div>
                        <div>
                          Verified: <span className="text-slate-300">{ev.last_verified_date.split("T")[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingEvidence(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: REVISION HISTORY (ENTITY SPECIFIC) --- */}
      {inspectingRevisions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-[#09152b] border border-purple-500/50 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-purple-400" />
                <h3 className="font-display text-base font-bold text-slate-100">
                  Revision History: {inspectingRevisions.entityName}
                </h3>
              </div>
              <button
                onClick={() => setInspectingRevisions(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {inspectingRevisions.records.map((rev) => (
                <div
                  key={rev.revision_id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">Version {rev.version_number}</span>
                    <span className="text-slate-500 text-[10px]">{rev.changed_at}</span>
                  </div>
                  <div className="text-slate-300 font-sans">{rev.comment}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <div>Source: {rev.source_name}</div>
                    <div className="text-emerald-400">Approved by: {rev.approved_by}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingRevisions(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: REGISTER NEW SOURCE --- */}
      {showAddSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#09152b] border border-amber-500/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display text-base font-bold text-slate-100">
                Register New External Data Source
              </h3>
              <button
                onClick={() => setShowAddSourceModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Source Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official Shueisha Vivre Card Database"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Source Type:</label>
                  <select
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                  >
                    <option value="API">API</option>
                    <option value="OFFICIAL">OFFICIAL</option>
                    <option value="WIKI">WIKI</option>
                    <option value="COMMUNITY">COMMUNITY</option>
                    <option value="THEORY">THEORY</option>
                    <option value="USER_SUBMITTED">USER_SUBMITTED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Reliability (1-10):</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newSourceReliability}
                    onChange={(e) => setNewSourceReliability(parseInt(e.target.value, 10) || 5)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Base URL / Endpoint:</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Notes / Scope:</label>
                <textarea
                  rows={2}
                  placeholder="Describe data contents and update frequency..."
                  value={newSourceNotes}
                  onChange={(e) => setNewSourceNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSourceModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Register Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

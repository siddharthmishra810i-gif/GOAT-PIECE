export type SourceType = 
  | "OFFICIAL" 
  | "API" 
  | "WIKI" 
  | "COMMUNITY" 
  | "THEORY" 
  | "USER_SUBMITTED";

export type SyncStatus = 
  | "IDLE" 
  | "SYNCING" 
  | "SUCCESS" 
  | "FAILED" 
  | "PARTIAL";

export type CanonStatus = 
  | "CANON_CONFIRMED" 
  | "CANON_REFERENCE" 
  | "STRONG_EVIDENCE" 
  | "PLAUSIBLE" 
  | "THEORY" 
  | "SPECULATION" 
  | "DISPROVEN" 
  | "UNKNOWN";

export type PipelineEntityType = 
  | "character" 
  | "devil_fruit" 
  | "location" 
  | "ship" 
  | "bounty" 
  | "crew" 
  | "weapon" 
  | "chapter" 
  | "mystery" 
  | "theory";

export interface SourceRecord {
  source_id: string;
  source_name: string;
  source_type: SourceType;
  base_url: string;
  api_endpoint: string;
  reliability_level: number; // 1 to 10
  last_successful_sync: string | null;
  last_attempted_sync: string | null;
  sync_status: SyncStatus;
  notes: string;
  rate_limit_rpm?: number;
  auth_required?: boolean;
}

export interface ImportBatch {
  batch_id: string;
  source_id: string;
  source_name: string;
  entity_type: PipelineEntityType;
  started_at: string;
  completed_at: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  records_fetched: number;
  records_normalized: number;
  records_pending_review: number;
  records_duplicates_flagged: number;
  errors: string[];
  logs: string[];
}

export interface RawDataRecord {
  raw_record_id: string;
  batch_id: string;
  source_id: string;
  source_url: string;
  retrieved_at: string;
  external_id: string;
  checksum: string; // SHA-256 hash of raw_payload
  entity_type: PipelineEntityType;
  raw_payload: Record<string, any>;
}

export interface EvidenceRecord {
  evidence_id: string;
  entity_id: string;
  entity_type: PipelineEntityType;
  source_id: string;
  source_name: string;
  source_url: string;
  external_id: string;
  raw_record_id: string;
  retrieval_date: string;
  last_verified_date: string;
  confidence: number; // 0.0 - 1.0
  canon_status: CanonStatus;
  citation_notes: string;
}

export interface EntityRevision {
  revision_id: string;
  entity_type: PipelineEntityType;
  entity_id: string;
  version_number: number;
  changed_at: string;
  source_id: string;
  source_name: string;
  batch_id?: string;
  approved_by: string;
  comment: string;
  diff: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  snapshot: Record<string, any>;
}

export interface DuplicateCandidate {
  candidate_id: string;
  new_item_temp_id: string;
  new_item_name: string;
  existing_entity_id: string;
  existing_entity_name: string;
  entity_type: PipelineEntityType;
  similarity_score: number; // 0 to 100%
  match_reasons: string[];
  status: "PENDING_CONFIRMATION" | "MERGED" | "KEPT_SEPARATE" | "REJECTED";
}

export interface PendingReviewItem {
  review_id: string;
  batch_id: string;
  source_id: string;
  source_name: string;
  entity_type: PipelineEntityType;
  external_id: string;
  raw_record_id: string;
  normalized_data: Record<string, any>;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "MERGED";
  proposed_canon_status: CanonStatus;
  confidence_score: number;
  duplicate_candidates?: DuplicateCandidate[];
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
}

// Canonical standardized entities
export interface CanonicalCharacter {
  id: string;
  name: string;
  japanese_name?: string;
  romanized_name?: string;
  aliases: string[];
  bounty: string | null;
  bounty_number: number;
  status: "Alive" | "Deceased" | "Unknown" | "Imprisoned";
  affiliation: string;
  crew_id?: string;
  crew_name?: string;
  role: string;
  race: string;
  origin_island?: string;
  devil_fruit?: string;
  haki: string[];
  canon_status: CanonStatus;
  current_version: number;
  primary_source_id: string;
  evidence_count: number;
  first_appearance_chapter?: number;
  first_appearance_episode?: number;
  updated_at: string;
}

export interface CanonicalDevilFruit {
  id: string;
  name: string;
  japanese_name?: string;
  type: "Paramecia" | "Zoan" | "Ancient Zoan" | "Mythical Zoan" | "Logia" | "Unknown";
  current_user: string;
  previous_users: string[];
  awakening_status: "Confirmed" | "Unawakened" | "Unknown";
  description: string;
  canon_status: CanonStatus;
  current_version: number;
  primary_source_id: string;
  evidence_count: number;
  first_appearance_chapter?: number;
  updated_at: string;
}

export interface CanonicalLocation {
  id: string;
  name: string;
  japanese_name?: string;
  sea_region: string;
  island_type: string;
  affiliation: string;
  log_pose_time?: string;
  first_appearance_chapter?: number;
  description: string;
  canon_status: CanonStatus;
  current_version: number;
  primary_source_id: string;
  evidence_count: number;
  updated_at: string;
}

export interface CanonicalShip {
  id: string;
  name: string;
  affiliation: string;
  shipwright?: string;
  type?: string;
  status: "Active" | "Destroyed" | "Decommissioned" | "Unknown";
  first_appearance_chapter?: number;
  description: string;
  canon_status: CanonStatus;
  current_version: number;
  primary_source_id: string;
  evidence_count: number;
  updated_at: string;
}

export interface CanonicalBountyHistory {
  id: string;
  character_id: string;
  character_name: string;
  amount: number;
  formatted_amount: string;
  issued_after_arc?: string;
  issued_chapter?: number;
  condition: "Dead or Alive" | "Only Alive" | "Dead Only";
  canon_status: CanonStatus;
  source_id: string;
  date_recorded: string;
}

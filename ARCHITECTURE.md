# Grand Line Archives — Canonical Data Architecture & Ingestion Pipeline

This document details the multi-source data ingestion engine, normalization pipeline, entity resolution deduplication system, and canonical database architecture powering the **Grand Line Archives** fan-made One Piece encyclopedia.

---

## 1. Core Architecture Principles

1. **Decoupled Canonical Storage**: The frontend never depends directly on external third-party APIs for user requests. External data is fetched, validated, cryptographically hashed, normalized, and stored in our own internal canonical database.
2. **Never Overwrite Canon Blindly**: Existing confirmed canonical records are protected with strict versioning and change audits.
3. **Strict Canon vs. Theory Quarantine**: AI-generated theories, forum speculation, and unverified hypotheses can NEVER automatically become `CANON_CONFIRMED`.
4. **Source Traceability**: Every entity record maintains full provenance back to its origin source, external ID, timestamp, and SHA-256 raw payload checksum.
5. **Human-in-the-Loop Moderation**: All incoming records enter a `PENDING_REVIEW` queue where archivists can inspect raw payloads, review fuzzy duplicate matches, edit attributes, merge duplicates, and publish to canon.

---

## 2. Ingestion Pipeline Workflow

```
External Sources (One Piece API, MediaWiki, SBS, Community CSV)
       │
       ▼
1. Source Registry (Reliability, Rate Limits, Sync Status)
       │
       ▼
2. Data Fetcher (Timeout: 4s, Exponential Retries, Pagination)
       │
       ▼
3. Raw Data Storage (Isolated with SHA-256 Checksum)
       │
       ▼
4. Normalization Layer (Transforms external schemas into internal domain entities)
       │
       ▼
5. Entity Resolution & Deduplication (Levenshtein distance, Jaccard token overlap, alias matching)
       │
       ▼
6. Canon Verification Guard (Guarantees non-canon demotion & integrity)
       │
       ▼
7. Admin Review Queue (PENDING_REVIEW: Inspect, Edit, Merge, Approve, Reject)
       │
       ▼
8. Canonical Database (Versioned Tables: Characters, Fruits, Islands, Ships, Bounties)
       │
       ▼
9. Provenance & Revisions (Revision Changelogs: Version 1 -> Version 2, Evidence store)
```

---

## 3. Database Schema Overview

### Canonical Tables

1. **`CanonicalCharacter`**:
   - `id`: Unique internal ID (e.g., `char_luffy`)
   - `name`: Romanized canonical name
   - `japanese_name`: Original kanji/kana
   - `aliases`: Array of known monikers and epithets
   - `bounty`: Formatted bounty string
   - `bounty_number`: Numeric value for sorting and charts
   - `status`: Alive, Deceased, Unknown
   - `affiliation`: Primary crew, Marine rank, or faction
   - `role`: Role in crew / organization
   - `race`: Human, Fish-Man, Giant, Lunarian, Buccaneer, etc.
   - `origin_island`: Birthplace / hometown
   - `devil_fruit`: Current fruit name
   - `haki`: Array of demonstrated Haki forms
   - `canon_status`: `CANON_CONFIRMED` | `CANON_REFERENCE` | `STRONG_EVIDENCE` | `THEORY`
   - `current_version`: Integer incremented on each approved change
   - `primary_source_id`: Source reference
   - `evidence_count`: Number of linked citations
   - `first_appearance_chapter` & `first_appearance_episode`

2. **`CanonicalDevilFruit`**:
   - `id`, `name`, `japanese_name`, `type` (Paramecia, Zoan, Ancient Zoan, Mythical Zoan, Logia)
   - `current_user`, `previous_users`
   - `awakening_status` (Confirmed, Unawakened, Unknown)
   - `description`, `canon_status`, `current_version`

3. **`CanonicalLocation`**:
   - `id`, `name`, `japanese_name`, `sea_region` (East Blue, Paradise, New World, etc.)
   - `island_type` (Spring, Summer, Autumn, Winter), `affiliation`, `log_pose_time`
   - `first_appearance_chapter`, `canon_status`, `current_version`

4. **`CanonicalShip`**:
   - `id`, `name`, `affiliation`, `shipwright`, `type`, `status`, `debut_chapter`, `canon_status`

5. **`CanonicalBountyHistory`**:
   - `id`, `character_id`, `character_name`, `amount`, `formatted_amount`, `issued_after_arc`, `issued_chapter`, `condition`

---

## 4. Entity Resolution & Deduplication Engine

To resolve duplicate or slightly differing names (such as `"Monkey D. Luffy"`, `"Luffy"`, and `"Monkey D Luffy"`), the system executes a 4-tier similarity analysis:
- **Clean Normalization**: Strips punctuation (dots, commas, hyphens), converts to lowercase, collapses whitespace.
- **Alias Intersection**: Cross-references against canonical character aliases (e.g. "Straw Hat", "Lucy", "Luffy").
- **Levenshtein Distance**: Calculates character edit distance ratio.
- **Jaccard Word Token Overlap**: Compares token sets to handle reordered words.
- **Result**: Flags items with $\ge 75\%$ similarity as `DuplicateCandidate` for human admin review. Never merges automatically when uncertain.

---

## 5. API Endpoints

- `GET /api/pipeline/sources` — List all registered sources and sync statuses
- `POST /api/pipeline/sources` — Register a new source
- `POST /api/pipeline/ingest` — Dispatch ingestion batch for a given source and entity type
- `GET /api/pipeline/batches` — List ingestion batches and streaming audit logs
- `GET /api/pipeline/raw/:id` — Retrieve original raw record with SHA-256 checksum
- `GET /api/pipeline/reviews` — Retrieve moderation queue items
- `POST /api/pipeline/reviews/:id/approve` — Approve and publish to Canonical Database
- `POST /api/pipeline/reviews/:id/reject` — Reject record with archivist reason
- `POST /api/pipeline/reviews/:id/merge` — Merge duplicate record into existing canonical record
- `GET /api/canonical/characters` — Query canonical characters
- `GET /api/canonical/evidence/:id` — View evidence provenance trace for an entity
- `GET /api/canonical/revisions/:id` — View full version diff changelog
- `POST /api/pipeline/demonstrate-import` — Automated end-to-end One Piece API demonstration

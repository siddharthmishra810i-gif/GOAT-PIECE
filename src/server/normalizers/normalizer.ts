import {
  PipelineEntityType,
  SourceRecord,
  CanonStatus,
} from "../../types/pipeline";

export interface NormalizedResult {
  externalId: string;
  normalizedData: Record<string, any>;
  proposedCanonStatus: CanonStatus;
  confidenceScore: number;
}

export class EntityNormalizer {
  /**
   * Normalize an external raw payload into the internal database entity format.
   * Does NOT assume any external API's schema is our permanent schema.
   */
  public static normalize(
    rawRecord: Record<string, any>,
    entityType: PipelineEntityType,
    source: SourceRecord
  ): NormalizedResult {
    const proposedCanonStatus = this.determineProposedCanonStatus(source, rawRecord);
    const confidenceScore = Math.min(1.0, Math.max(0.1, (source.reliability_level || 7) / 10));

    switch (entityType) {
      case "character":
        return this.normalizeCharacter(rawRecord, source, proposedCanonStatus, confidenceScore);
      case "devil_fruit":
        return this.normalizeDevilFruit(rawRecord, source, proposedCanonStatus, confidenceScore);
      case "location":
        return this.normalizeLocation(rawRecord, source, proposedCanonStatus, confidenceScore);
      case "ship":
        return this.normalizeShip(rawRecord, source, proposedCanonStatus, confidenceScore);
      case "bounty":
        return this.normalizeBounty(rawRecord, source, proposedCanonStatus, confidenceScore);
      default:
        return {
          externalId: String(rawRecord.id || rawRecord.pageid || rawRecord.csv_row_id || Date.now()),
          normalizedData: { ...rawRecord },
          proposedCanonStatus,
          confidenceScore,
        };
    }
  }

  private static determineProposedCanonStatus(source: SourceRecord, rawRecord: Record<string, any>): CanonStatus {
    // If the source itself is a theory or community speculation source, NEVER mark as canon
    if (source.source_type === "THEORY" || source.source_type === "USER_SUBMITTED") {
      return "THEORY";
    }

    if (source.source_type === "OFFICIAL") {
      return "CANON_CONFIRMED";
    }

    if (source.source_type === "API") {
      // The One Piece API provides canonical manga/anime data
      return "CANON_CONFIRMED";
    }

    if (source.source_type === "WIKI") {
      return "CANON_REFERENCE";
    }

    if (rawRecord.verified_status) {
      return rawRecord.verified_status as CanonStatus;
    }

    return "STRONG_EVIDENCE";
  }

  private static normalizeCharacter(
    raw: Record<string, any>,
    source: SourceRecord,
    canonStatus: CanonStatus,
    confidence: number
  ): NormalizedResult {
    const externalId = String(raw.id || raw.pageid || raw.csv_row_id || `ext_${Date.now()}`);

    // Parse aliases
    let aliases: string[] = [];
    if (Array.isArray(raw.alias)) {
      aliases = raw.alias;
    } else if (typeof raw.alias === "string") {
      aliases = raw.alias.split(",").map((s: string) => s.trim()).filter(Boolean);
    } else if (raw.epithet) {
      aliases.push(String(raw.epithet));
    }

    // Parse bounty numbers
    let bountyNumber = 0;
    let formattedBounty: string | null = null;
    if (raw.bounty_raw && typeof raw.bounty_raw === "number") {
      bountyNumber = raw.bounty_raw;
      formattedBounty = `${bountyNumber.toLocaleString()} Berries`;
    } else if (raw.bounty) {
      const numericStr = String(raw.bounty).replace(/[^0-9]/g, "");
      bountyNumber = parseInt(numericStr, 10) || 0;
      formattedBounty = raw.bounty.includes("Berries") ? raw.bounty : `${bountyNumber.toLocaleString()} Berries`;
    }

    // Standardized Internal Character Entity
    const normalizedData = {
      id: `char_${externalId.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`,
      name: (raw.name || raw.character_name || raw.title || "Unknown Character").trim(),
      japanese_name: raw.japanese_name || raw.infobox?.japanese_name || undefined,
      romanized_name: raw.roman_name || raw.romanized_name || undefined,
      aliases,
      bounty: formattedBounty,
      bounty_number: bountyNumber,
      status: raw.status || "Alive",
      affiliation: raw.crew || raw.affiliation || raw.infobox?.affiliation || "Independent",
      role: raw.role || raw.infobox?.role || "Pirate",
      race: raw.race || raw.infobox?.race || "Human",
      origin_island: raw.origin || undefined,
      devil_fruit: raw.fruit_name || undefined,
      haki: Array.isArray(raw.haki) ? raw.haki : [],
      canon_status: canonStatus,
      first_appearance_chapter: raw.first_manga ? parseInt(String(raw.first_manga), 10) : undefined,
      first_appearance_episode: raw.first_anime ? parseInt(String(raw.first_anime), 10) : undefined,
      description: raw.extract || raw.description || `Canonical record imported from ${source.source_name}.`,
    };

    return {
      externalId,
      normalizedData,
      proposedCanonStatus: canonStatus,
      confidenceScore: confidence,
    };
  }

  private static normalizeDevilFruit(
    raw: Record<string, any>,
    source: SourceRecord,
    canonStatus: CanonStatus,
    confidence: number
  ): NormalizedResult {
    const externalId = String(raw.id || `df_${Date.now()}`);

    const normalizedData = {
      id: `df_${externalId.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`,
      name: (raw.name || "Unknown Fruit").trim(),
      japanese_name: raw.japanese_name,
      type: raw.type || "Unknown",
      current_user: raw.user || raw.current_user || "Unknown",
      previous_users: raw.previous_user ? [raw.previous_user] : [],
      awakening_status: raw.awakened ? "Confirmed" : "Unawakened",
      description: raw.description || "",
      canon_status: canonStatus,
      first_appearance_chapter: raw.debut_chapter ? parseInt(String(raw.debut_chapter), 10) : undefined,
    };

    return {
      externalId,
      normalizedData,
      proposedCanonStatus: canonStatus,
      confidenceScore: confidence,
    };
  }

  private static normalizeLocation(
    raw: Record<string, any>,
    source: SourceRecord,
    canonStatus: CanonStatus,
    confidence: number
  ): NormalizedResult {
    const externalId = String(raw.id || `loc_${Date.now()}`);

    const normalizedData = {
      id: `loc_${externalId.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`,
      name: (raw.name || "Unknown Island").trim(),
      japanese_name: raw.japanese_name,
      sea_region: raw.sea || "Grand Line",
      island_type: raw.type || "Summer",
      affiliation: raw.affiliation || "Independent",
      log_pose_time: raw.log_pose,
      first_appearance_chapter: raw.debut_chapter ? parseInt(String(raw.debut_chapter), 10) : undefined,
      description: raw.description || "",
      canon_status: canonStatus,
    };

    return {
      externalId,
      normalizedData,
      proposedCanonStatus: canonStatus,
      confidenceScore: confidence,
    };
  }

  private static normalizeShip(
    raw: Record<string, any>,
    source: SourceRecord,
    canonStatus: CanonStatus,
    confidence: number
  ): NormalizedResult {
    const externalId = String(raw.id || `ship_${Date.now()}`);

    const normalizedData = {
      id: `ship_${externalId.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`,
      name: (raw.name || "Unknown Vessel").trim(),
      affiliation: raw.affiliation || "Pirate",
      shipwright: raw.shipwright,
      type: raw.type,
      status: raw.status || "Active",
      first_appearance_chapter: raw.debut_chapter ? parseInt(String(raw.debut_chapter), 10) : undefined,
      description: raw.description || "",
      canon_status: canonStatus,
    };

    return {
      externalId,
      normalizedData,
      proposedCanonStatus: canonStatus,
      confidenceScore: confidence,
    };
  }

  private static normalizeBounty(
    raw: Record<string, any>,
    source: SourceRecord,
    canonStatus: CanonStatus,
    confidence: number
  ): NormalizedResult {
    const externalId = String(raw.id || `bounty_${Date.now()}`);
    const amount = typeof raw.amount === "number" ? raw.amount : parseInt(String(raw.amount).replace(/[^0-9]/g, ""), 10) || 0;

    const normalizedData = {
      id: `bh_${externalId}`,
      character_name: raw.character_name || "Unknown",
      amount,
      formatted_amount: raw.formatted || `${amount.toLocaleString()} Berries`,
      issued_after_arc: raw.arc,
      issued_chapter: raw.chapter ? parseInt(String(raw.chapter), 10) : undefined,
      condition: raw.condition || "Dead or Alive",
      canon_status: canonStatus,
    };

    return {
      externalId,
      normalizedData,
      proposedCanonStatus: canonStatus,
      confidenceScore: confidence,
    };
  }
}

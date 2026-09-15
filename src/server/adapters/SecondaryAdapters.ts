import { BaseAdapter, AdapterFetchResult } from "./BaseAdapter";
import { PipelineEntityType, SourceType } from "../../types/pipeline";

export class MediaWikiAdapter implements BaseAdapter {
  public name = "One Piece Wiki MediaWiki Adapter";
  public sourceId = "src_onepiece_wiki";
  public sourceType: SourceType = "WIKI";
  public baseUrl = "https://onepiece.fandom.com/";

  public async fetchRecords(
    entityType: PipelineEntityType,
    options: { page?: number; limit?: number; query?: string } = {}
  ): Promise<AdapterFetchResult> {
    const endpoint = `${this.baseUrl}api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(
      entityType === "character" ? "Characters" : "Devil_Fruits"
    )}&format=json`;

    // Authentic fallback data formatted as MediaWiki API extracts
    const wikiCharacters = [
      {
        pageid: 10452,
        title: "Jinbe",
        extract: "Jinbe, known as 'Knight of the Sea', is the helmsman of the Straw Hat Pirates. Former Warlord of the Sea and captain of the Sun Pirates.",
        infobox: {
          japanese_name: "ジンベエ",
          bounty: "1,100,000,000 Berries",
          affiliation: "Straw Hat Pirates",
          role: "Helmsman",
          race: "Fish-Man (Whale Shark)",
          debut_chapter: "528",
        },
      },
      {
        pageid: 10453,
        title: "Franky",
        extract: "Franky is the shipwright for the Straw Hat Pirates. A cyborg from Water 7, formerly the leader of the Franky Family dismantle gang.",
        infobox: {
          japanese_name: "フランキー",
          bounty: "394,000,000 Berries",
          affiliation: "Straw Hat Pirates",
          role: "Shipwright",
          race: "Cyborg / Human",
          debut_chapter: "329",
        },
      },
    ];

    return {
      records: wikiCharacters,
      total: wikiCharacters.length,
      hasMore: false,
      sourceUrl: endpoint,
      isMockFallback: true,
    };
  }

  public validateSchema(rawRecord: Record<string, any>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!rawRecord.title && !rawRecord.pageid) {
      errors.push("MediaWiki record missing 'title' and 'pageid'");
    }
    return { isValid: errors.length === 0, errors };
  }
}

export class CSVAdapter implements BaseAdapter {
  public name = "CSV Dataset Adapter";
  public sourceId = "src_community_csv";
  public sourceType: SourceType = "COMMUNITY";
  public baseUrl = "local://imports/dataset.csv";

  public async fetchRecords(
    entityType: PipelineEntityType,
    options: { page?: number; limit?: number } = {}
  ): Promise<AdapterFetchResult> {
    // Sample CSV parsed rows
    const csvRecords = [
      {
        csv_row_id: 1,
        character_name: "Shanks",
        epithet: "Red-Haired",
        bounty: "4,048,900,000 Berries",
        crew: "Red Hair Pirates",
        first_chapter: "1",
        verified_status: "CANON_CONFIRMED",
      },
      {
        csv_row_id: 2,
        character_name: "Marshall D. Teach",
        epithet: "Blackbeard",
        bounty: "3,996,000,000 Berries",
        crew: "Blackbeard Pirates",
        first_chapter: "223",
        verified_status: "CANON_CONFIRMED",
      },
    ];

    return {
      records: csvRecords,
      total: csvRecords.length,
      hasMore: false,
      sourceUrl: this.baseUrl,
      isMockFallback: true,
    };
  }

  public parseCSVString(csvContent: string): Record<string, any>[] {
    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    const results: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: Record<string, any> = { csv_row_id: i };
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });
      results.push(row);
    }
    return results;
  }

  public validateSchema(rawRecord: Record<string, any>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!rawRecord.character_name && !rawRecord.name) {
      errors.push("CSV record missing 'character_name' or 'name' column");
    }
    return { isValid: errors.length === 0, errors };
  }
}

export class JSONAdapter implements BaseAdapter {
  public name = "Direct JSON File Adapter";
  public sourceId = "src_json_file";
  public sourceType: SourceType = "USER_SUBMITTED";
  public baseUrl = "upload://file.json";

  public async fetchRecords(
    entityType: PipelineEntityType,
    options: { page?: number; limit?: number } = {}
  ): Promise<AdapterFetchResult> {
    return {
      records: [],
      total: 0,
      hasMore: false,
      sourceUrl: this.baseUrl,
    };
  }

  public validateSchema(rawRecord: Record<string, any>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!rawRecord || typeof rawRecord !== "object") {
      errors.push("Record must be a valid JSON object");
    }
    return { isValid: errors.length === 0, errors };
  }
}

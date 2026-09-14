import { BaseAdapter, AdapterFetchResult } from "./BaseAdapter";
import { PipelineEntityType, SourceType } from "../../types/pipeline";

// Sample authentic records representing the One Piece API payload schema
const SAMPLE_ONE_PIECE_API_CHARACTERS = [
  {
    id: "opapi_char_001",
    name: "Monkey D. Luffy",
    japanese_name: "モンキー・D・ルフィ",
    roman_name: "Monkey D. Luffy",
    bounty: "3,000,000,000",
    bounty_raw: 3000000000,
    status: "Alive",
    crew: "Straw Hat Pirates",
    role: "Captain",
    race: "Human",
    origin: "Foosha Village (Goa Kingdom)",
    fruit_name: "Hito Hito no Mi, Model: Nika",
    fruit_type: "Mythical Zoan",
    haki: ["Conqueror's Haki", "Armament Haki", "Observation Haki"],
    first_manga: 1,
    first_anime: 1,
    alias: "Straw Hat Luffy, Lucy, Joy Boy",
  },
  {
    id: "opapi_char_002",
    name: "Roronoa Zoro",
    japanese_name: "ロロノア・ゾロ",
    roman_name: "Roronoa Zoro",
    bounty: "1,111,000,000",
    bounty_raw: 1111000000,
    status: "Alive",
    crew: "Straw Hat Pirates",
    role: "Swordsman / Combatant",
    race: "Human",
    origin: "Shimotsuki Village (East Blue)",
    fruit_name: null,
    fruit_type: null,
    haki: ["Conqueror's Haki", "Advanced Armament Haki", "Observation Haki"],
    first_manga: 3,
    first_anime: 2,
    alias: "Pirate Hunter Zoro, King of Hell",
  },
  {
    id: "opapi_char_003",
    name: "Nico Robin",
    japanese_name: "ニコ・ロビン",
    roman_name: "Nico Robin",
    bounty: "930,000,000",
    bounty_raw: 930000000,
    status: "Alive",
    crew: "Straw Hat Pirates",
    role: "Archaeologist",
    race: "Human",
    origin: "Ohara (West Blue)",
    fruit_name: "Hana Hana no Mi",
    fruit_type: "Paramecia",
    haki: ["Armament Haki", "Fishman Karate"],
    first_manga: 114,
    first_anime: 67,
    alias: "Devil Child, Light of the Revolution",
  },
  {
    id: "opapi_char_004",
    name: "Trafalgar D. Water Law",
    japanese_name: "トラファルガー・D・ワーテル・ロー",
    roman_name: "Trafalgar D. Water Law",
    bounty: "3,000,000,000",
    bounty_raw: 3000000000,
    status: "Alive",
    crew: "Heart Pirates",
    role: "Captain & Doctor",
    race: "Human",
    origin: "Flevance (North Blue)",
    fruit_name: "Ope Ope no Mi",
    fruit_type: "Paramecia",
    haki: ["Armament Haki", "Observation Haki"],
    first_manga: 498,
    first_anime: 392,
    alias: "Surgeon of Death",
  },
  // Purposeful variant to demonstrate duplicate resolution against "Monkey D. Luffy"
  {
    id: "opapi_char_005",
    name: "Monkey D Luffy",
    japanese_name: "モンキー・D・ルフィ",
    roman_name: "Monkey D Luffy",
    bounty: "3,000,000,000 Berries",
    bounty_raw: 3000000000,
    status: "Alive",
    crew: "Straw Hat Fleet",
    role: "Emperor of the Sea",
    race: "Human",
    origin: "Dawn Island",
    fruit_name: "Gomu Gomu no Mi",
    fruit_type: "Paramecia / Mythical Zoan",
    haki: ["Supreme Conqueror", "Ryou"],
    first_manga: 1,
    first_anime: 1,
    alias: "Luffy, Strawhat",
  },
];

const SAMPLE_ONE_PIECE_API_FRUITS = [
  {
    id: "opapi_df_001",
    name: "Ope Ope no Mi",
    japanese_name: "オペオペの実",
    type: "Paramecia",
    user: "Trafalgar D. Water Law",
    previous_user: "Unknown Doctor",
    awakened: true,
    description: "Allows user to create a spherical 'ROOM' within which they have absolute surgical manipulation of space, matter, and souls.",
  },
  {
    id: "opapi_df_002",
    name: "Mera Mera no Mi",
    japanese_name: "メラメラの実",
    type: "Logia",
    user: "Sabo",
    previous_user: "Portgas D. Ace",
    awakened: false,
    description: "Grants ability to create, manipulate, and transform into fire at will.",
  },
  {
    id: "opapi_df_003",
    name: "Uo Uo no Mi, Model: Seiryu",
    japanese_name: "ウオウオの実 モデル 青龍",
    type: "Mythical Zoan",
    user: "Kaido",
    previous_user: "None",
    awakened: true,
    description: "Bestows transformation into a colossal Azure Dragon, controlling flame clouds, lightning, and hurricane wind blasts.",
  },
  {
    id: "opapi_df_004",
    name: "Gura Gura no Mi",
    japanese_name: "グラグラの実",
    type: "Paramecia",
    user: "Marshall D. Teach",
    previous_user: "Edward Newgate",
    awakened: false,
    description: "Regarded as the strongest Paramecia, able to generate seismic vibrations and oceanic shockwaves capable of destroying the world.",
  },
];

const SAMPLE_ONE_PIECE_API_SHIPS = [
  {
    id: "opapi_ship_001",
    name: "Thousand Sunny",
    affiliation: "Straw Hat Pirates",
    shipwright: "Franky (with Galley-La Co. wood)",
    type: "Sloop / Brigantine (Treasure Tree Adam)",
    status: "Active",
    debut_chapter: 436,
    description: "Second ship of the Straw Hats, featuring Soldier Dock System, Gaon Cannon, and Coup de Burst emergency escape thrusters.",
  },
  {
    id: "opapi_ship_002",
    name: "Going Merry",
    affiliation: "Straw Hat Pirates",
    shipwright: "Merry (Syrup Village)",
    type: "Caravel",
    status: "Decommissioned",
    debut_chapter: 41,
    description: "First ship of the Straw Hats that developed a Klabautermann spirit before receiving a Viking funeral at Enies Lobby.",
  },
  {
    id: "opapi_ship_003",
    name: "Oro Jackson",
    affiliation: "Roger Pirates",
    shipwright: "Tom (Water 7)",
    type: "Galleon (Treasure Tree Adam)",
    status: "Unknown",
    debut_chapter: 506,
    description: "The only ship in recorded history to reach Laugh Tale, sailed by Pirate King Gol D. Roger and his crew.",
  },
];

const SAMPLE_ONE_PIECE_API_ISLANDS = [
  {
    id: "opapi_island_001",
    name: "Wano Country",
    japanese_name: "ワノ国",
    sea: "New World",
    type: "Autumn / Multi-climate Plateau",
    affiliation: "Kozuki Clan & Straw Hat Protectorate",
    log_pose: "Inaccessible via normal Log Pose",
    debut_chapter: 909,
    description: "Isolated fortress nation seated atop flooded mountain caldera. Guarding Ancient Weapon Pluton deep beneath Mount Fuji.",
  },
  {
    id: "opapi_island_002",
    name: "Water 7",
    japanese_name: "ウォーターセブン",
    sea: "Paradise",
    type: "Canal Metropolis / Spring",
    affiliation: "Galley-La Company / World Government ally",
    log_pose: "7 days",
    debut_chapter: 323,
    description: "The city of water and master shipwrights, linked by the Sea Train Puffing Tom and braving the annual Aqua Laguna tidal wave.",
  },
  {
    id: "opapi_island_003",
    name: "Elbaf",
    japanese_name: "エルバフ",
    sea: "New World",
    type: "Giant Warland / Primeval",
    affiliation: "Giant Warrior Pirates",
    log_pose: "Requires specific Giant Log Pose",
    debut_chapter: 1126,
    description: "The strongest nation of giants, holding the sacred Yggdrasil tree and home to Dorry, Brogy, and ancient warrior heritage.",
  },
];

const SAMPLE_ONE_PIECE_API_BOUNTIES = [
  {
    id: "opapi_bounty_001",
    character_name: "Monkey D. Luffy",
    amount: 30000000,
    formatted: "30,000,000 Berries",
    arc: "Arlong Park Arc",
    chapter: 96,
    condition: "Dead or Alive",
  },
  {
    id: "opapi_bounty_002",
    character_name: "Monkey D. Luffy",
    amount: 100000000,
    formatted: "100,000,000 Berries",
    arc: "Alabasta Arc",
    chapter: 213,
    condition: "Dead or Alive",
  },
  {
    id: "opapi_bounty_003",
    character_name: "Monkey D. Luffy",
    amount: 300000000,
    formatted: "300,000,000 Berries",
    arc: "Enies Lobby Arc",
    chapter: 435,
    condition: "Dead or Alive",
  },
  {
    id: "opapi_bounty_004",
    character_name: "Monkey D. Luffy",
    amount: 1500000000,
    formatted: "1,500,000,000 Berries",
    arc: "Whole Cake Island Arc",
    chapter: 903,
    condition: "Dead or Alive",
  },
];

export class OnePieceAPIAdapter implements BaseAdapter {
  public name = "One Piece API Adapter";
  public sourceId = "src_onepiece_api";
  public sourceType: SourceType = "API";
  public baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = process.env.ONE_PIECE_API_URL || "https://www.onepieceapi.com/";
    this.apiKey = process.env.ONE_PIECE_API_KEY;
  }

  public async fetchRecords(
    entityType: PipelineEntityType,
    options: { page?: number; limit?: number; query?: string } = {}
  ): Promise<AdapterFetchResult> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const endpoint = `${this.baseUrl.replace(/\/$/, "")}/api/v1/${entityType}s?page=${page}&limit=${limit}`;

    // Attempt live fetch with timeout and retries
    let liveRecords: any[] | null = null;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts && !liveRecords) {
      attempts++;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

        const headers: Record<string, string> = {
          Accept: "application/json",
          "User-Agent": "GrandLineArchives-Ingestion/1.0",
        };
        if (this.apiKey) {
          headers["Authorization"] = `Bearer ${this.apiKey}`;
        }

        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const json = await response.json();
          if (Array.isArray(json)) {
            liveRecords = json;
          } else if (json.data && Array.isArray(json.data)) {
            liveRecords = json.data;
          } else if (json.results && Array.isArray(json.results)) {
            liveRecords = json.results;
          }
        }
      } catch (err) {
        // Retry or fallback to offline sample
      }
    }

    if (liveRecords && liveRecords.length > 0) {
      return {
        records: liveRecords,
        total: liveRecords.length,
        hasMore: false,
        sourceUrl: endpoint,
        isMockFallback: false,
      };
    }

    // High-Fidelity Normalized Sample Fallback
    // Guarantees reliable testing & ingestion even when external site is unreachable or rate-limited
    let fallbackData: any[] = [];
    switch (entityType) {
      case "character":
        fallbackData = SAMPLE_ONE_PIECE_API_CHARACTERS;
        break;
      case "devil_fruit":
        fallbackData = SAMPLE_ONE_PIECE_API_FRUITS;
        break;
      case "ship":
        fallbackData = SAMPLE_ONE_PIECE_API_SHIPS;
        break;
      case "location":
        fallbackData = SAMPLE_ONE_PIECE_API_ISLANDS;
        break;
      case "bounty":
        fallbackData = SAMPLE_ONE_PIECE_API_BOUNTIES;
        break;
      default:
        fallbackData = SAMPLE_ONE_PIECE_API_CHARACTERS;
    }

    return {
      records: fallbackData,
      total: fallbackData.length,
      hasMore: false,
      sourceUrl: endpoint,
      isMockFallback: true,
    };
  }

  public validateSchema(
    rawRecord: Record<string, any>,
    entityType: PipelineEntityType
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!rawRecord || typeof rawRecord !== "object") {
      return { isValid: false, errors: ["Record must be an object"] };
    }

    if (!rawRecord.id && !rawRecord.name) {
      errors.push("Record lacks both 'id' and 'name' identifiers");
    }

    if (entityType === "character") {
      if (!rawRecord.name) errors.push("Character missing required field 'name'");
    } else if (entityType === "devil_fruit") {
      if (!rawRecord.name) errors.push("Devil Fruit missing required field 'name'");
    } else if (entityType === "location") {
      if (!rawRecord.name) errors.push("Location missing required field 'name'");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

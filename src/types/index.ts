export type SeaRegion = 
  | "East Blue"
  | "West Blue"
  | "North Blue"
  | "South Blue"
  | "Grand Line"
  | "Paradise"
  | "New World"
  | "Red Line"
  | "Calm Belt"
  | "Sky Ocean";

export type CanonStatus = "Canon" | "Anime Filler" | "Movie" | "SBS" | "Vivre Card" | "Theory";

export type TheoryProbability = 
  | "Confirmed" 
  | "Strongly Supported" 
  | "Plausible" 
  | "Speculative" 
  | "Contradicted" 
  | "Disproven";

export type FruitType = 
  | "Paramecia" 
  | "Special Paramecia"
  | "Zoan" 
  | "Ancient Zoan" 
  | "Mythical Zoan" 
  | "Logia"
  | "Unknown";

export type HakiType = 
  | "Kenbunshoku (Observation)" 
  | "Busoshoku (Armament)" 
  | "Haoshoku (Conqueror's)" 
  | "Advanced Observation (Future Sight)" 
  | "Advanced Armament (Emission / Internal Destruction)" 
  | "Advanced Conqueror's (Infusion / Coating)"
  | string;

export interface HakiInfo {
  id: string;
  name: string;
  japaneseName: string;
  description: string;
  basicApplications: string[];
  advancedApplications: string[];
  confirmedUsers: string[];
  rulesAndLimits: string;
}

export interface Character {
  id: string;
  name: string;
  japaneseName: string;
  romanizedName?: string;
  aliases: string[];
  imageUrl?: string;
  bounty?: string;
  bountyNumber?: number;
  firstMangaChapter: number;
  firstAnimeEpisode: number;
  status: "Alive" | "Deceased" | "Unknown" | "Imprisoned" | string;
  affiliation: string;
  crewId?: string;
  crewName?: string;
  role: string;
  family?: string;
  race: string;
  originIslandId?: string;
  originIslandName?: string;
  devilFruitId?: string;
  devilFruitName?: string;
  haki?: HakiType[];
  fightingStyle?: string;
  weapons?: string[];
  relationships?: {
    characterId: string;
    characterName: string;
    relation: string;
  }[];
  visitedLocationIds?: string[];
  majorBattles?: {
    opponent: string;
    location: string;
    chapter: number;
    outcome: string;
  }[];
  importantEvents?: {
    chapter: number;
    description: string;
  }[];
  historicalSignificance?: string;
  mysteriesInvolved?: string[];
  theoriesInvolved?: string[];
  description: string;
  sources?: {
    type: "OFFICIAL" | "SBS" | "VIVRE_CARD" | "SECONDARY";
    citation: string;
    url?: string;
  }[];
  avatarBgColor?: string;
  avatarIcon?: string;
}

export interface CanonicalClaim {
  claim: string;
  canon_status: "CANON" | "SBS" | "VIVRE_CARD" | "THEORY";
  manga_chapter: number;
  anime_episode?: number;
  source: string;
  first_revealed_chapter: number;
  spoiler_level: number;
}

export interface IslandLandmark {
  id: string;
  name: string;
  japaneseName?: string;
  type: "town" | "palace" | "port" | "mountain" | "ruins" | "facility" | "battlefield";
  description: string;
  relativeCoords: { x: number; y: number }; // relative offset around island center in svg units (-30 to +30)
  mangaChapter?: number;
  keyEvent?: string;
}

export interface Location {
  id: string;
  name: string;
  japaneseName: string;
  seaRegion: SeaRegion;
  subRegion?: string;
  coordinates: { x: number; y: number }; // percentage on interactive map 0-100
  firstMangaChapter: number;
  firstAnimeEpisode: number;
  unlockChapter?: number;
  arcId: string;
  arcName: string;
  rulerOrAuthority?: string;
  climate?: string;
  logPoseRecordTime?: string;
  landmarks?: IslandLandmark[];
  hasPoneglyph?: boolean;
  poneglyphType?: "Road" | "Rio" | "Historical";
  isSkyIsland?: boolean;
  history: string;
  inhabitants?: string[];
  affiliation?: string;
  historyTimeline?: { yearOrEra: string; event: string; chapter: number }[];
  importantEvents: {
    title: string;
    chapter: number;
    description: string;
  }[];
  charactersConnected: string[];
  relatedMysteries: string[];
  relatedTheories: string[];
  chapters: string; // e.g. "Ch. 909-1057"
  episodes: string; // e.g. "Ep. 890-1085"
  source: string;
  description: string;
  accentColor?: string;
}

export interface Arc {
  id: string;
  name: string;
  sagaName?: string;
  saga?: string;
  mangaChapters?: string;
  animeEpisodes?: string;
  startChapter: number;
  endChapter: number;
  startEpisode: number;
  endEpisode: number;
  primaryLocationId?: string;
  primaryLocationName?: string;
  mainLocations?: string[];
  mainAntagonists?: string[];
  keyEvents?: string[];
  significance?: string;
  yearReleased?: number;
  summary: string;
  keyRevelations?: string[];
  majorBattles?: string[];
}

export interface Chapter {
  number?: number;
  chapterNumber?: number;
  title: string;
  japaneseTitle?: string;
  releaseDate: string;
  arcId: string;
  arcName?: string;
  sagaName?: string;
  summary: string;
  majorEvents?: string[];
  charactersIntroduced?: string[];
  firstAppearances?: string[];
  charactersFeatured: string[];
  locations?: string[];
  locationsFeatured?: string[];
  hasColorSpread?: boolean;
  importantRevelations?: string[];
  majorRevelations?: string[];
  foreshadowingIntroduced?: string[];
  foreshadowingAnswered?: string[];
  mysteriesIntroduced?: string[];
  mysteriesAnswered?: string[];
  coverStory?: string;
  sbsVolume?: number;
  officialVizUrl?: string;
}

export interface Episode {
  number: number;
  title: string;
  airDate: string;
  arcId: string;
  arcName: string;
  mangaChaptersCovered: string; // e.g. "Ch. 1044-1045"
  isFiller: boolean;
  characters: string[];
  locations: string[];
  majorEvents: string[];
  officialCrunchyrollUrl: string;
}

export interface Mystery {
  id: string;
  title: string;
  question: string;
  description?: string;
  category: "Ancient History" | "Treasure & Weapons" | "World Government" | "Powers & Lineage" | "Locations";
  firstIntroducedChapter: number;
  status: "Unsolved" | "Partially Solved" | "Answered";
  knownFacts: string[];
  confirmedAnswers?: string[];
  clues: {
    chapter: number;
    description: string;
  }[];
  relevantChapters: number[];
  relevantSbs?: string;
  charactersInvolved: string[];
  locationsInvolved: string[];
  leadingTheories: string[];
  counterarguments?: string[];
  lastUpdatedChapter: number;
}

export interface TheoryEvidenceItem {
  evidence: string;
  chapter: number;
  episode?: number;
  strength: 1 | 2 | 3 | 4 | 5; // 1 to 5 stars
  type: "Event" | "Dialogue" | "Visual / Cover" | "SBS" | "Foreshadowing";
  notes?: string;
}

export interface Theory {
  id: string;
  title: string;
  author: string;
  communitySource: "Reddit" | "YouTube" | "Arlong Park Forums" | "Grand Line Archives Community" | "SBS Discussion";
  dateCreated: string;
  summary: string;
  evidence: string[];
  evidenceItems?: TheoryEvidenceItem[];
  argumentsFor?: string[];
  argumentsAgainst?: string[];
  supportingChapters: number[];
  contradictingEvidence: string[];
  contradictingChapters?: number[];
  relatedCharacters: string[];
  relatedLocations: string[];
  relatedMysteries: string[];
  probability: TheoryProbability;
  votes: number;
  downvotes?: number;
  status: "Active Discussion" | "Confirmed Canon" | "Plausible / Unconfirmed" | "Debunked by Oda";
}

export interface Foreshadowing {
  id: string;
  title?: string;
  topic?: string;
  description?: string;
  analysis?: string;
  setupChapter?: number;
  setupEpisode?: number;
  payoffChapter?: number;
  payoffEpisode?: number;
  chapterGap?: number;
  yearsBetween?: string;
  setupContext?: string;
  payoffContext?: string;
  significance?: string;
  quote?: string;
  characters?: string[];
  clueChapter?: number;
  clueEpisode?: number;
  clueDescription?: string;
  payoffDescription?: string;
  explanation?: string;
  charactersInvolved?: string[];
  isConfirmed?: boolean;
}

export interface DevilFruit {
  id: string;
  name: string;
  japaneseName: string;
  englishName?: string;
  romajiName?: string;
  meaning?: string;
  englishMeaning?: string;
  type: FruitType;
  model?: string;
  subType?: string;
  imageUrl?: string;
  currentUser?: string;
  currentHolder?: string;
  currentHolderId?: string;
  currentUserAffiliation?: string;
  previousUser?: string;
  previousHolders?: string[];
  firstChapter?: number;
  firstMangaChapter?: number;
  firstAppearanceChapter?: number;
  firstEpisode?: number;
  firstAppearanceEpisode?: number;
  description?: string;
  abilities?: string | string[];
  isAwakened?: boolean;
  awakeningStatus?: string;
  awakeningDescription?: string;
  awakeningAbilities?: string | string[];
  awakenedAbilities?: string | string[];
  strengths?: string | string[];
  limitations?: string | string[];
  weaknesses?: string | string[];
  scientificNotes?: string;
  history?: string;
  etymology?: string;
  canonStatus?: "Canon" | "Non-Canon";
}

export interface CrewMember {
  characterId: string;
  characterName: string;
  role: string;
}

export interface Crew {
  id: string;
  name: string;
  japaneseName: string;
  captainId: string;
  captainName: string;
  shipName: string;
  totalBounty: string;
  affiliation: string;
  members: CrewMember[];
  originSea: string;
  firstMangaChapter: number;
  status: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  era: string;
  year?: string;
  relativeTime?: string;
  title: string;
  description: string;
  chapterReference?: number;
  spoilerChapter?: number;
  charactersInvolved: string[];
  locationsInvolved?: string[];
  location?: string;
  relevantChapters?: number[];
  canonStatus?: CanonStatus;
}

export interface GraphNode {
  id: string;
  label: string;
  category: "Character" | "Crew" | "Location" | "Arc" | "Mystery" | "Theory" | "Ancient History" | "Devil Fruit";
  groupColor: string;
  chapter: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
}

export interface UserSpoilerState {
  mangaChapter: number;
  animeEpisode: number;
  isCaughtUp: boolean;
  revealAllSpoilers: boolean;
  revealedItemIds: Record<string, boolean>;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Character" | "Location" | "Chapter" | "Episode" | "Mystery" | "Theory" | "Devil Fruit" | "Foreshadowing" | "Crew" | "Battle";
  chapterRevealed: number;
  urlIdentifier: string;
}

export interface Battle {
  id: string;
  name: string;
  combatantsSideA: string[];
  combatantsSideB: string[];
  locationId: string;
  locationName: string;
  chapter: number;
  episode?: number;
  arc: string;
  winner: string;
  outcome: string;
  majorTechniques: string[];
  devilFruitsUsed: string[];
  hakiUsed: string[];
  consequences: string;
  summary: string;
}

export interface BountyMilestone {
  amount: number;
  formatted: string;
  chapter: number;
  episode?: number;
  reason: string;
  eventTitle: string;
  aliasTitle?: string;
  posterImageNote?: string;
}

export interface CharacterBountyHistory {
  characterId: string;
  characterName: string;
  japaneseName: string;
  currentBounty: string;
  currentBountyNumber: number;
  imageUrl?: string;
  history: BountyMilestone[];
}

export type BountyTier =
  | "Legendary"
  | "Emperor"
  | "Supreme Threat"
  | "High Threat"
  | "Grand Line Commander"
  | "Super Rookie"
  | "Pirate";

export interface PirateBountyItem {
  id: string;
  name: string;
  japaneseName: string;
  romajiName?: string;
  aliases?: string[];
  epithet?: string;
  bountyAmount: number;
  formattedBounty: string;
  status: "Alive" | "Deceased" | "Unknown" | "Imprisoned" | string;
  imageUrl: string;
  bounties: {
    id: string;
    amount: number;
    isActive: boolean;
  }[];
  tier: BountyTier;
  affiliation?: string;
  crewName?: string;
  role?: string;
  isPirate: boolean;
  isMarineTarget?: boolean;
  characterId?: string;
  evolutionStages?: BountyMilestone[];
}

export interface VoyageStep {
  order: number;
  locationId: string;
  locationName: string;
  seaRegion: SeaRegion;
  coordinates: { x: number; y: number };
  chapterRange: string;
  startChapter: number;
  endChapter: number;
  episodeRange: string;
  keyEvents: string[];
  battles: string[];
  crewMilestone: string;
  description: string;
}

export interface VoyageGroup {
  id: string;
  name: string;
  leader: string;
  shipName: string;
  flagIcon: string;
  color: string;
  description: string;
  steps: VoyageStep[];
}

export interface CharacterLifeEvent {
  id: string;
  period: string; // e.g. "Childhood", "Meeting Shanks", "Marineford", "Wano"
  title: string;
  chapter: number;
  episode?: number;
  locationId: string;
  locationName: string;
  description: string;
  significance: string;
  relatedCharacterIds: string[];
}

export interface CharacterTimeline {
  characterId: string;
  characterName: string;
  epithet: string;
  events: CharacterLifeEvent[];
}

export interface FactionMember {
  id: string;
  name: string;
  title: string;
  status?: string;
  bounty?: string;
  subordinates?: FactionMember[];
}

export interface FactionGroup {
  id: string;
  name: string;
  japaneseName: string;
  category: "World Government" | "Four Emperors" | "Revolutionary Army" | "Kingdoms" | "Pirate Alliances";
  leadership: string;
  headquarters: string;
  ideology: string;
  summary: string;
  hierarchy: FactionMember[];
  relatedFactions: { id: string; name: string; relation: string }[];
}

export interface ChapterBreakdown {
  chapterNumber: number;
  title: string;
  japaneseTitle?: string;
  arcName: string;
  releaseYear: number;
  newCharacters: string[];
  newLocations: string[];
  newInformation: string[];
  newMysteries: string[];
  questionsAnswered: string[];
  foreshadowingIntroduced: string[];
  importantEvents: string[];
  theoriesAffected: string[];
  summary: string;
}

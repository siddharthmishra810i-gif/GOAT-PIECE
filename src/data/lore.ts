export interface RaceInfo {
  id: string;
  name: string;
  japaneseName: string;
  habitat: string;
  traits: string[];
  historyAndPersecution: string;
  notableMembers: string[];
  firstAppearanceChapter: number;
}

export interface PoneglyphInfo {
  id: string;
  name: string;
  type: "Historical" | "Instructional" | "Road" | "Rio";
  currentLocation: string;
  discoveredChapter: number;
  contentsOrPurpose: string;
}

export interface SbsTrivia {
  volume: number;
  question: string;
  odaAnswer: string;
  significance: string;
  topic: string;
}

export const racesData: RaceInfo[] = [
  {
    id: "buccaneers",
    name: "Buccaneer Tribe",
    japaneseName: "バッカニア族",
    habitat: "Sorbet Kingdom / Ancient Lands",
    traits: [
      "Blood of ancient giants flowing through human stature.",
      "Immense physical durability, superhuman muscle density, and spiritual resilience.",
      "Inherent religious faith in the mythical Warrior of Liberation, Sun God Nika.",
    ],
    historyAndPersecution: "Hunted to near-total extinction by the World Government for committing an undisclosed 'grave crime' in the ancient past against the 20 Founding Dynasties. Even having a trace of Buccaneer blood results in perpetual enslavement.",
    notableMembers: ["Bartholomew Kuma", "Clapp"],
    firstAppearanceChapter: 1095,
  },
  {
    id: "lunarians",
    name: "Lunarian Tribe",
    japaneseName: "ルナーリア族",
    habitat: "Formerly the Red Line (Before Mary Geoise existed)",
    traits: [
      "Dark skin, silver/white hair, and black feathered wings.",
      "A flame perpetually burning on their back; while lit, their defense is virtually impenetrable.",
      "Extinguishing the flame trades invincibility for blinding supersonic speed.",
    ],
    historyAndPersecution: "Revered as 'Gods' in ancient folklore who lived atop the Red Line long before the World Government was established. Hunted to near-total eradication; the Marines offered 100,000,000 Berries for even a clue to their whereabouts. Their Lineage Factor was used to create the Seraphim cyborgs.",
    notableMembers: ["King the Conflagration (Alber)", "S-Hawk", "S-Snake", "S-Bear", "S-Shark"],
    firstAppearanceChapter: 1023,
  },
  {
    id: "three_eye_tribe",
    name: "Three-Eye Tribe",
    japaneseName: "三つ目族",
    habitat: "Scattered across the Grand Line / Totto Land",
    traits: [
      "Possess a third eye on their forehead.",
      "Upon a true 'awakening' of the third eye, possesses the latent psychic capacity to decipher the ancient script of Poneglyphs.",
    ],
    historyAndPersecution: "Fiercely sought by Emperors like Charlotte Linlin as an alternative method to decipher the Road Poneglyphs without Nico Robin.",
    notableMembers: ["Charlotte Pudding"],
    firstAppearanceChapter: 651,
  },
  {
    id: "giants",
    name: "Giants of Elbaf",
    japaneseName: "エルバフの巨人族",
    habitat: "Warland Elbaf",
    traits: [
      "Colossal stature (average 12 to 20+ meters tall) and lifespans exceeding 300 years.",
      "Warriors of honor and physical supremacy wielding ancient Elbaf Spear techniques (Hakoku Sovereignty).",
    ],
    historyAndPersecution: "Respected as the mightiest military force on Earth. Charlotte Linlin and the World Government have both sought giant-ification science to replicate their battlefield supremacy.",
    notableMembers: ["Dorry", "Brogy", "Jaguar D. Saul", "Oimo", "Kashi", "Hajrudin"],
    firstAppearanceChapter: 116,
  },
  {
    id: "minks",
    name: "Mink Tribe",
    japaneseName: "ミンク族",
    habitat: "Mokomo Dukedom, Zou (Back of Zunesha)",
    traits: [
      "Humanoid mammalian species with natural fur, claws, and acute animal instincts.",
      "Every single member from infancy is a natural warrior who can discharge 'Electro' through their bodies.",
      "Sulong Form: Under the direct light of the full moon, they tap into their primal beast nature, gaining blinding speed and immense power.",
    ],
    historyAndPersecution: "Deep historic ties to the Kozuki Clan of Wano spanning hundreds of years. Kept secluded from the World Government atop Zunesha.",
    notableMembers: ["Inuarashi", "Nekomamushi", "Carrot", "Bepo", "Pedro"],
    firstAppearanceChapter: 804,
  },
  {
    id: "fishmen_merfolk",
    name: "Fish-Men & Merfolk",
    japaneseName: "魚人族・人魚族",
    habitat: "Fish-Man Island (Ryugu Kingdom) / 10,000m Below Sea Level",
    traits: [
      "Fish-Men possess 10 times the physical strength of humans on land and double in water; master Fish-Man Karate and Water Shot.",
      "Merfolk are the fastest swimmers in all oceans; can communicate with ocean fish.",
    ],
    historyAndPersecution: "Suffered centuries of violent discrimination and human slave trafficking. Sealed a sacred ancient promise with Joy Boy 800 years ago involving Ark Noah.",
    notableMembers: ["Jinbe", "Fisher Tiger", "Queen Otohime", "Princess Shirahoshi (Poseidon)", "Arlong"],
    firstAppearanceChapter: 69,
  },
];

export const poneglyphsData: PoneglyphInfo[] = [
  {
    id: "pg_road_zou",
    name: "Whale Tree Road Poneglyph",
    type: "Road",
    currentLocation: "Zou (Inside the Whale Tree)",
    discoveredChapter: 818,
    contentsOrPurpose: "One of the 4 crimson Road Poneglyphs that marks one coordinate of Laugh Tale. Guarded by the Mink Tribe for centuries.",
  },
  {
    id: "pg_road_whole_cake",
    name: "Big Mom's Road Poneglyph",
    type: "Road",
    currentLocation: "Whole Cake Island (Treasure Room)",
    discoveredChapter: 846,
    contentsOrPurpose: "One of the 4 crimson Road Poneglyphs, kept in Linlin's treasure vault and stolen by Brook via paper rubbing.",
  },
  {
    id: "pg_road_wano",
    name: "Wano Road Poneglyph",
    type: "Road",
    currentLocation: "Wano Country (Base of Mt. Fuji / Submerged Wano)",
    discoveredChapter: 967,
    contentsOrPurpose: "One of the 4 crimson Road Poneglyphs, protected by the Kozuki clan and Kaido.",
  },
  {
    id: "pg_road_missing",
    name: "The Missing 4th Road Poneglyph",
    type: "Road",
    currentLocation: "Formerly Fish-Man Island (Sea Forest) / Currently with 'The Man Marked by Flames' (Hinokizu)",
    discoveredChapter: 967,
    contentsOrPurpose: "Was present beside Joy Boy's apology letter on Fish-Man Island 25 years ago during Roger's visit, but moved before the modern era.",
  },
  {
    id: "pg_joy_boy_apology",
    name: "Joy Boy's Letter of Apology",
    type: "Historical",
    currentLocation: "Fish-Man Island (Sea Forest)",
    discoveredChapter: 628,
    contentsOrPurpose: "Joy Boy's personal apology to the mermaid princess of that era for being unable to fulfill his promise regarding Ark Noah.",
  },
  {
    id: "pg_alabasta_pluton",
    name: "Alabasta Crypt Poneglyph",
    type: "Historical",
    currentLocation: "Alabasta (Alubarna Royal Crypt)",
    discoveredChapter: 203,
    contentsOrPurpose: "Records the history of the kingdom and discloses the exact location of Ancient Weapon Pluton in Wano.",
  },
];

export const sbsTriviaData: SbsTrivia[] = [
  {
    volume: 105,
    topic: "Zoro's Lineage",
    question: "Is Zoro related to Shimotsuki Ushimaru and the legendary Sword God Ryuma?",
    odaAnswer: "Yes! Zoro's grandmother Shimotsuki Furiko was the older sister of Shimotsuki Ushimaru (the former Daimyo of Ringo). Furiko married Roronoa Pinzoro in the East Blue. Zoro is the grandnephew of Ushimaru and a direct descendant of the legendary Sword God Ryuma!",
    significance: "Conclusively confirms Zoro's samurai nobility and ties to Wano without needing to bog down the manga's pacing.",
  },
  {
    volume: 90,
    topic: "The One Piece Treasure",
    question: "Is the One Piece really a physical object or is it friendship?",
    odaAnswer: "I hate stories where the prize is just 'the bond you formed' or 'you grew as a person.' Luffy and the crew have gone through so much hardship! The One Piece is 100% a real, tangible physical treasure!",
    significance: "De-bunks decades of meta-tropes and assures readers of a concrete resolution.",
  },
  {
    volume: 4,
    topic: "Luffy's Stretching Limit",
    question: "How far can Luffy's body stretch?",
    odaAnswer: "Luffy's body can stretch up to approximately 72 Gomu Gomus! Beyond that, it might start to rip.",
    significance: "Classic early SBS humor that established Luffy's rubber physics.",
  },
];

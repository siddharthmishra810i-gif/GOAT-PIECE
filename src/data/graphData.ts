export interface GraphNode {
  id: string;
  label: string;
  category: "character" | "crew" | "location" | "mystery" | "theory" | "weapon" | "concept";
  color: string;
  firstChapter: number;
  description: string;
  tags?: string[];
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  relationType: "captain" | "member" | "allied" | "enemy" | "origin" | "discovered" | "involved" | "theory_subject" | "lineage" | "legacy";
  revealedChapter: number;
}

export const graphNodesData: GraphNode[] = [
  // Core Concepts & Legends
  { id: "joyboy", label: "Joy Boy", category: "concept", color: "#e11d48", firstChapter: 628, description: "Legendary figure of the Void Century who left the treasure on Laugh Tale and promised Fish-Man Island freedom." },
  { id: "m_void_century", label: "Void Century", category: "mystery", color: "#8b5cf6", firstChapter: 395, description: "The 100-year blank period 800-900 years ago during which the Ancient Kingdom fell and the world sank 200 meters." },
  { id: "ancient_kingdom", label: "Ancient Kingdom", category: "concept", color: "#6366f1", firstChapter: 395, description: "Advanced civilization with technology 500+ years beyond modern times that opposing 20 allied kingdoms erased." },
  { id: "nika", label: "Sun God Nika", category: "concept", color: "#f59e0b", firstChapter: 1018, description: "Mythical Warrior of Liberation with a body of rubber who brings smiles and dances to the heartbeat of freedom." },
  { id: "luffy", label: "Monkey D. Luffy", category: "character", color: "#ef4444", firstChapter: 1, description: "Captain of the Straw Hat Pirates, Emperor, and current wielder of the Mythical Zoan Nika fruit." },
  { id: "zunesha", label: "Zunesha", category: "character", color: "#0d9488", firstChapter: 802, description: "Millennium-old colossal elephant carrying the Mokomo Dukedom; former comrade of Joy Boy who committed an ancient crime." },
  { id: "fishman_island", label: "Fish-Man Island", category: "location", color: "#10b981", firstChapter: 607, description: "10,000 meters under the sea, home of Shirahoshi (Poseidon) and ancient Ark Noah." },
  { id: "poneglyphs", label: "Poneglyphs", category: "concept", color: "#0284c7", firstChapter: 202, description: "Indestructible stone cubes carved by the Kozuki Clan preserving true history and coordinates to Laugh Tale." },
  { id: "roger", label: "Gol D. Roger", category: "character", color: "#eab308", firstChapter: 1, description: "The King of the Pirates who sailed the entire Grand Line, reached Laugh Tale, and learned the Void Century truth." },
  { id: "laugh_tale", label: "Laugh Tale", category: "location", color: "#fbbf24", firstChapter: 105, description: "The final island pinpointed by the intersection of the 4 Road Poneglyphs." },
  { id: "m_one_piece", label: "The One Piece", category: "mystery", color: "#f59e0b", firstChapter: 1, description: "Joy Boy's physical treasure left on Laugh Tale that caused Roger and his entire crew to burst into laughter." },

  // Connected Key Characters & Powers
  { id: "robin", label: "Nico Robin", category: "character", color: "#8b5cf6", firstChapter: 114, description: "Sole survivor of Ohara and only living scholar able to decipher the ancient Poneglyph script." },
  { id: "shanks", label: "Red-Haired Shanks", category: "character", color: "#dc2626", firstChapter: 1, description: "Emperor of the Sea, former apprentice of Roger, and guardian of the new era." },
  { id: "imu", label: "Saint Imu", category: "character", color: "#0f172a", firstChapter: 906, description: "Supreme sovereign of the Empty Throne and ruler of the World Government from the Void Century." },
  { id: "vegapunk", label: "Dr. Vegapunk", category: "character", color: "#06b6d4", firstChapter: 1061, description: "Scientist whose broadcast confirmed the world is sinking into the ocean." },
  { id: "emet", label: "Iron Giant Emet", category: "concept", color: "#78716c", firstChapter: 1067, description: "900-year-old automaton of the Ancient Kingdom who stored Joy Boy's sealed Conqueror's Haki knot." },
  { id: "loki", label: "Prince Loki", category: "character", color: "#ca8a04", firstChapter: 858, description: "Accursed Giant Prince of Elbaf who ate the legendary devil fruit passed down in the royal family." },
  { id: "elbaf", label: "Kingdom of Elbaf", category: "location", color: "#b45309", firstChapter: 1126, description: "Strongest warrior nation in the world and keeper of Ohara's rescued historical library." },
  { id: "wano", label: "Wano Country", category: "location", color: "#d97706", firstChapter: 909, description: "Land of the Kozuki Clan stonemasons, birthplace of the Poneglyphs, and tomb of Pluton." },
  { id: "m_ancient_weapons", label: "Ancient Weapons", category: "weapon", color: "#06b6d4", firstChapter: 193, description: "Pluton (battleship), Poseidon (Shirahoshi), and Uranus (sky weapon)." },
  { id: "m_will_of_d", label: "The Will of D.", category: "mystery", color: "#ec4899", firstChapter: 154, description: "The hereditary moniker of people feared as the natural enemies of the Gods." },
  { id: "nefertari_lili", label: "Queen Nefertari D. Lili", category: "character", color: "#f472b6", firstChapter: 1084, description: "Monarch of Alabasta 800 years ago who refused to ascend to Mary Geoise and scattered the Poneglyphs." },
  { id: "t_red_line", label: "Red Line Destruction", category: "theory", color: "#f43f5e", firstChapter: 649, description: "Theory that the Red Line will be shattered to create the All Blue and unite the world." },
];

export const graphEdgesData: GraphEdge[] = [
  // The Signature Core Canonical Chain (Joy Boy -> Void Century -> Ancient Kingdom -> Nika -> Luffy -> Zunesha -> Fish-Man Island -> Poneglyphs -> Roger -> Laugh Tale -> One Piece)
  { id: "c1", source: "joyboy", target: "m_void_century", label: "Void Century Protagonist", relationType: "involved", revealedChapter: 628 },
  { id: "c2", source: "joyboy", target: "ancient_kingdom", label: "Champion of Ancient Kingdom", relationType: "allied", revealedChapter: 1113 },
  { id: "c3", source: "ancient_kingdom", target: "m_void_century", label: "Fell in 100-Year War", relationType: "involved", revealedChapter: 395 },
  { id: "c4", source: "joyboy", target: "nika", label: "First Inheritor of Nika", relationType: "lineage", revealedChapter: 1044 },
  { id: "c5", source: "nika", target: "luffy", label: "Awakened via Gear 5", relationType: "lineage", revealedChapter: 1044 },
  { id: "c6", source: "joyboy", target: "luffy", label: "Inherited Will Across 800 Yrs", relationType: "legacy", revealedChapter: 1044 },
  { id: "c7", source: "joyboy", target: "zunesha", label: "Ancient Comrades", relationType: "allied", revealedChapter: 1040 },
  { id: "c8", source: "zunesha", target: "luffy", label: "Heard the Drums of Liberation", relationType: "allied", revealedChapter: 1043 },
  { id: "c9", source: "joyboy", target: "fishman_island", label: "Apology Letter on Poneglyph", relationType: "involved", revealedChapter: 649 },
  { id: "c10", source: "fishman_island", target: "m_ancient_weapons", label: "Home to Poseidon (Shirahoshi)", relationType: "involved", revealedChapter: 626 },
  { id: "c11", source: "joyboy", target: "poneglyphs", label: "Messages Inscribed for the Future", relationType: "legacy", revealedChapter: 649 },
  { id: "c12", source: "wano", target: "poneglyphs", label: "Kozuki Clan Crafted Stones", relationType: "origin", revealedChapter: 818 },
  { id: "c13", source: "poneglyphs", target: "roger", label: "Deciphered by Oden for Roger", relationType: "discovered", revealedChapter: 966 },
  { id: "c14", source: "roger", target: "laugh_tale", label: "Navigated to Final Island", relationType: "discovered", revealedChapter: 967 },
  { id: "c15", source: "joyboy", target: "laugh_tale", label: "Left the Great Treasure", relationType: "origin", revealedChapter: 967 },
  { id: "c16", source: "laugh_tale", target: "m_one_piece", label: "Location of the One Piece", relationType: "involved", revealedChapter: 967 },
  { id: "c17", source: "joyboy", target: "m_one_piece", label: "Creator / Origin of Treasure", relationType: "origin", revealedChapter: 967 },

  // World Government & Ancient Warfare
  { id: "c18", source: "imu", target: "m_void_century", label: "20 Kings Coalition Victor", relationType: "enemy", revealedChapter: 1085 },
  { id: "c19", source: "imu", target: "joyboy", label: "Ancient Nemesis", relationType: "enemy", revealedChapter: 1085 },
  { id: "c20", source: "nefertari_lili", target: "poneglyphs", label: "Scattered Stones Globally", relationType: "involved", revealedChapter: 1085 },
  { id: "c21", source: "nefertari_lili", target: "m_will_of_d", label: "Bearer of Nefertari D.", relationType: "lineage", revealedChapter: 1085 },
  { id: "c22", source: "luffy", target: "m_will_of_d", label: "Bearer of the D", relationType: "lineage", revealedChapter: 154 },
  { id: "c23", source: "roger", target: "m_will_of_d", label: "Gol D. Roger", relationType: "lineage", revealedChapter: 154 },

  // Science, Elbaf & Modern Climax
  { id: "c24", source: "vegapunk", target: "ancient_kingdom", label: "Reverse-Engineered Tech", relationType: "discovered", revealedChapter: 1065 },
  { id: "c25", source: "vegapunk", target: "emet", label: "Studied 900-Yr Iron Giant", relationType: "involved", revealedChapter: 1067 },
  { id: "c26", source: "joyboy", target: "emet", label: "Imbued with Haki Knot", relationType: "allied", revealedChapter: 1122 },
  { id: "c27", source: "robin", target: "poneglyphs", label: "Sole Poneglyph Reader", relationType: "discovered", revealedChapter: 202 },
  { id: "c28", source: "shanks", target: "roger", label: "Apprentice / Inherited Hat", relationType: "lineage", revealedChapter: 19 },
  { id: "c29", source: "shanks", target: "luffy", label: "Passed Straw Hat & Nika Bet", relationType: "allied", revealedChapter: 1 },
  { id: "c30", source: "loki", target: "elbaf", label: "Accursed Giant Prince", relationType: "origin", revealedChapter: 858 },
  { id: "c31", source: "luffy", target: "elbaf", label: "Next Island of the Final Saga", relationType: "discovered", revealedChapter: 1126 },
  { id: "c32", source: "wano", target: "m_ancient_weapons", label: "Houses Battleship Pluton", relationType: "involved", revealedChapter: 1053 },
  { id: "c33", source: "t_red_line", target: "m_one_piece", label: "Unites Oceans into One", relationType: "theory_subject", revealedChapter: 649 },
];


import { ChapterBreakdown } from "../types";
import { chaptersData } from "./chapters";
import { charactersData } from "./characters";
import { locationsData } from "./locations";
import { mysteriesData } from "./mysteries";
import { battlesData } from "./battles";
import { foreshadowingData } from "./foreshadowing";

export const landmarkBreakdowns: Record<number, ChapterBreakdown> = {
  1: {
    chapterNumber: 1,
    title: "Romance Dawn",
    japaneseTitle: "ROMANCE DAWN — 冒険の夜明け",
    arcName: "Romance Dawn",
    releaseYear: 1997,
    newCharacters: ["Monkey D. Luffy", "Red-Haired Shanks", "Benn Beckman", "Lucky Roux", "Yasopp", "Makino", "Higuma", "Lord of the Coast"],
    newLocations: ["Foosha Village", "Dawn Island", "East Blue"],
    newInformation: [
      "Devil Fruits grant supernatural abilities at the cost of the user never being able to swim again.",
      "The legendary pirate Shanks anchored in Foosha Village for one year.",
      "Luffy accidentally consumed the Gomu Gomu no Mi / Nika Fruit from Shanks' treasure chest.",
      "Shanks sacrificed his left arm to save Luffy from the Lord of the Coast.",
      "The Straw Hat is passed from Shanks to Luffy as a sacred pledge to meet again when Luffy becomes a great pirate.",
    ],
    newMysteries: [
      "Who was the original owner of the Straw Hat?",
      "What is the true nature and origin of the Devil Fruits?",
      "What is Gol D. Roger's One Piece treasure?",
    ],
    questionsAnswered: ["How did Luffy acquire his rubber body?", "Why does Luffy treasure his Straw Hat above all else?"],
    foreshadowingIntroduced: ["Sun God Nika & Drums of Liberation (eaten in Ch. 1)", "Luffy's secret true dream that shocked Shanks"],
    importantEvents: ["Luffy cuts himself under his left eye to prove bravery", "Shanks sacrifices arm to the Sea King", "Luffy departs at age 17 in a small dinghy"],
    theoriesAffected: ["Will of D. lineage", "Sun God Nika reincarnation"],
    summary: "The historic opening of Eiichiro Oda's epic. Seven-year-old Monkey D. Luffy eats a legendary Devil Fruit, is rescued by pirate captain Shanks, and begins his lifelong quest to become the King of the Pirates.",
  },
  100: {
    chapterNumber: 100,
    title: "The Legend Begins",
    japaneseTitle: "伝説は始まった",
    arcName: "Loguetown Arc",
    releaseYear: 1999,
    newCharacters: ["Monkey D. Dragon (The Revolutionary)"],
    newLocations: ["Loguetown Scaffold", "Entrance to the Grand Line"],
    newInformation: [
      "Gol D. Roger was born and executed in Loguetown.",
      "A miraculous green lightning storm struck the execution scaffold, saving Luffy from Buggy's blade.",
      "A mysterious cloaked man with facial tattoos named Monkey D. Dragon halted Captain Smoker with torrential gale-force winds.",
    ],
    newMysteries: ["Who is the tattooed man who summoned the storm?", "Why did Luffy smile on the execution scaffold just like Roger?"],
    questionsAnswered: ["Can the Straw Hats escape the East Blue Marines?"],
    foreshadowingIntroduced: ["Monkey D. Dragon's connection to Luffy and the Revolutionary Army", "Weather-controlling powers / Ancient Weapon connection"],
    importantEvents: ["Luffy smiles at his own imminent execution", "Dragon stops Smoker", "The five Straw Hats lay their feet over the barrel promising to achieve their dreams"],
    theoriesAffected: ["Dragon's Devil Fruit (Wind/Storm Logia or Mythical Zoan)", "The Will of D. smile at death"],
    summary: "The Straw Hats bid farewell to the East Blue on the execution scaffold of the Pirate King. Saved by a divine lightning bolt and the sudden intervention of Monkey D. Dragon, they set their compass toward Reverse Mountain.",
  },
  217: {
    chapterNumber: 217,
    title: "Vipere",
    japaneseTitle: "密航者",
    arcName: "Alabasta Arc",
    releaseYear: 2002,
    newCharacters: ["Nico Robin (as Straw Hat Ally)"],
    newLocations: ["Alabasta Coastline"],
    newInformation: [
      "Nico Robin was not truly loyal to Crocodile; she sought the Rio Poneglyph and the true history.",
      "Crocodile's criminal syndicate Baroque Works is completely dismantled.",
      "Ancient Weapon Pluton's location is recorded in the royal tomb of Alubarna.",
    ],
    newMysteries: ["Where is the battleship Pluton actually sleeping?", "What is the Rio Poneglyph and the 100-year blank history?"],
    questionsAnswered: ["Will Princess Vivi join the Straw Hats?", "Who was Crocodile's mysterious vice-president Miss All Sunday?"],
    foreshadowingIntroduced: ["Nico Robin's dark past and the Ohara Buster Call", "The existence of the Ancient Weapons Pluton, Poseidon, and Uranus"],
    importantEvents: ["The silent departure showing the X mark of friendship to Vivi", "Nico Robin emerges from the cabin of the Going Merry asking to join Luffy's crew"],
    theoriesAffected: ["Ancient Weapon Pluton's whereabouts", "Robin's true loyalty"],
    summary: "With rain falling upon Alabasta, the Straw Hats raise their left arms in eternal silent friendship to Princess Vivi before discovering Nico Robin stowed away on their ship.",
  },
  398: {
    chapterNumber: 398,
    title: "Declaration of War",
    japaneseTitle: "宣戦布告",
    arcName: "Enies Lobby Arc",
    releaseYear: 2006,
    newCharacters: ["Professor Clover (Flashback)", "Dr. Clover's Ohara Archaeologists"],
    newLocations: ["Enies Lobby Courthouse / Tower of Justice"],
    newInformation: [
      "The World Government was created 800 years ago by an alliance of 20 nations that wiped out a prosperous Ancient Kingdom.",
      "The name of the Ancient Kingdom was about to be spoken by Professor Clover before Spandine had him shot.",
      "Robin screams through tears: 'I want to live! Take me out to sea with you!'",
    ],
    newMysteries: ["What was the true name of the Ancient Kingdom?", "Why does the World Government fear the mere ideas of that kingdom?"],
    questionsAnswered: ["Why was Robin running and betraying people for 20 years?"],
    foreshadowingIntroduced: ["The Great War of the Void Century", "Sogeking burning the World Government flag"],
    importantEvents: ["Professor Clover confronts the Five Elders via Den Den Mushi", "Sogeking shoots down the World Government flag", "Robin's iconic plea to live"],
    theoriesAffected: ["The name of the Ancient Kingdom (e.g. Dawn, Peace, D.)", "The foundational crime of the World Government"],
    summary: "One of the most emotionally charged moments in manga history. Professor Clover reveals the origin of the World Government before the Ohara buster call, and Luffy commands Sogeking to set fire to the world government flag.",
  },
  500: {
    chapterNumber: 500,
    title: "Embers of History",
    japaneseTitle: "歴史の残り火",
    arcName: "Sabaody Archipelago Arc",
    releaseYear: 2008,
    newCharacters: ["Silvers Rayleigh (The Dark King)", "Saint Charlos", "Saint Rosward", "Saint Shalria", "Disco"],
    newLocations: ["Sabaody Human Auction House", "Grove 1"],
    newInformation: [
      "Silvers Rayleigh, first mate of the Roger Pirates, has been living quietly as a coating mechanic on Sabaody Archipelago.",
      "Celestial Dragons buy human and fish-man slaves with complete judicial immunity.",
      "Rayleigh effortlessly uses Advanced Conqueror's Haki to knock out the entire auction house.",
    ],
    newMysteries: ["What did Rayleigh and Roger discover on the final island?", "Can the Straw Hats survive the arrival of an Admiral?"],
    questionsAnswered: ["Is the Right Hand of the Pirate King still alive?"],
    foreshadowingIntroduced: ["Haki concepts officially revealed", "The cruelty of the Celestial Dragons and their holy status"],
    importantEvents: ["Silvers Rayleigh unleashes Conqueror's Haki in the auction house", "Camie put on auction for 500,000,000 Berries by Saint Charlos"],
    theoriesAffected: ["Conqueror's Haki nature", "Roger Pirates whereabouts"],
    summary: "At the threshold of the New World, the dark reality of world slavery under the Celestial Dragons collides with the living legend Silvers Rayleigh.",
  },
  1044: {
    chapterNumber: 1044,
    title: "Warrior of Liberation",
    japaneseTitle: "解放の戦士",
    arcName: "Wano Country Arc (Onigashima Raid)",
    releaseYear: 2022,
    newCharacters: ["Sun God Nika (True Form Revelation)"],
    newLocations: ["Onigashima Skull Dome Rooftop"],
    newInformation: [
      "The Gomu Gomu no Mi never existed; its true name is the Zoan 'Hito Hito no Mi, Model: Nika'.",
      "The World Government attempted to acquire the fruit for 800 years, but Zoan fruits carry a will of their own.",
      "Luffy's heartbeat sounds with the 'Drums of Liberation', transforming his surroundings into malleable cartoon rubber.",
      "Awakening brings the peak of Luffy's physical freedom: Gear 5.",
    ],
    newMysteries: ["Who was the original Sun God Nika?", "How does Nika connect to Joy Boy and the Ancient Kingdom?"],
    questionsAnswered: ["What happened when Luffy's 'voice' went out on the rooftop?", "Why did Who's-Who get imprisoned for losing the rubber fruit?"],
    foreshadowingIntroduced: ["Skypiea campfire silhouette payoff from Ch. 300", "Who's-Who Nika legend payoff from Ch. 1018"],
    importantEvents: ["The Five Elders discuss the true nature of the Nika fruit", "Zunesha announces Joy Boy has returned", "Luffy yanks Kaido through the ceiling in Gear 5"],
    theoriesAffected: ["Luffy's Devil Fruit true classification", "Joy Boy reincarnation vs inherited will"],
    summary: "The monumental revelation that transformed One Piece lore. Luffy awakens the mythical power of Sun God Nika, bringing laughter and the Drums of Liberation to the skies of Wano.",
  },
  1115: {
    chapterNumber: 1115,
    title: "Continental Fragments",
    japaneseTitle: "大陸の断片",
    arcName: "Egghead Island Arc",
    releaseYear: 2024,
    newCharacters: ["Silhouettes of the Ancient Kingdom Combatants", "Original Joy Boy in Action"],
    newLocations: ["Sunken Continents (200m Underwater)"],
    newInformation: [
      "The world of One Piece as it currently exists consists of island fragments of colossal submerged continents.",
      "During the 100-year Void Century, the firing of the Ancient Weapons raised global sea levels by 200 meters.",
      "Joy Boy was the first pirate in recorded human history, possessing the body of rubber like Sun God Nika.",
      "The Void Century war was not a battle of 'good versus evil', but a collision of two conflicting philosophies.",
    ],
    newMysteries: ["What were the two conflicting ideals between Joy Boy and the 20 Kingdoms?", "Can the sinking of the modern world be prevented?"],
    questionsAnswered: ["Why are there drowned ancient cities at the ocean floor?", "Who was the world's very first pirate?"],
    foreshadowingIntroduced: ["Water 7 rising sea tides (Aqua Laguna) origin", "Long Ring Long Land landbridges between islands explained"],
    importantEvents: ["Vegapunk's broadcast shows Joy Boy battling the 20 Kings with an elastic body", "The Five Elders frantically attempt to destroy the broadcast snail in Punk Records"],
    theoriesAffected: ["All Blue creation theory", "Red Line artificial construction", "World flooding prophecy"],
    summary: "Dr. Vegapunk reveals to the entire world that the oceans rose 200 meters during the Void Century due to Ancient Weapons, and that the modern continents lie submerged on the seabed.",
  },
};

export function getChapterBreakdown(chapterNum: number): ChapterBreakdown {
  if (landmarkBreakdowns[chapterNum]) {
    return landmarkBreakdowns[chapterNum];
  }

  // Generate dynamic breakdown from database relations
  const chapterRecord = chaptersData.find((c) => (c.chapterNumber || c.number) === chapterNum);
  const charsIntro = charactersData
    .filter((c) => c.firstMangaChapter === chapterNum)
    .map((c) => c.name);
  const locsIntro = locationsData
    .filter((l) => l.firstMangaChapter === chapterNum)
    .map((l) => l.name);
  const mysteriesIntro = mysteriesData
    .filter((m) => m.firstIntroducedChapter === chapterNum)
    .map((m) => m.title);
  const battlesInChapter = battlesData
    .filter((b) => b.chapter === chapterNum)
    .map((b) => b.name);
  const fsInChapter = foreshadowingData
    .filter((f) => f.setupChapter === chapterNum || f.clueChapter === chapterNum)
    .map((f) => f.topic || f.title || "Narrative Clue");

  return {
    chapterNumber: chapterNum,
    title: chapterRecord?.title || `Chapter ${chapterNum}`,
    arcName: chapterRecord?.arcName || chapterRecord?.arcId || "Grand Line Chronicle",
    releaseYear: chapterRecord?.releaseDate ? parseInt(chapterRecord.releaseDate.split("-")[0]) : 2000 + Math.floor(chapterNum / 40),
    newCharacters: charsIntro.length > 0 ? charsIntro : (chapterRecord?.firstAppearances || ["Prominent figures continuing the voyage"]),
    newLocations: locsIntro.length > 0 ? locsIntro : (chapterRecord?.locationsFeatured || ["Continuing on the current sea route"]),
    newInformation: chapterRecord?.majorRevelations || [
      `Story progression for Chapter ${chapterNum}`,
      `Developments on the voyage in ${chapterRecord?.arcId || "the current arc"}`,
    ],
    newMysteries: mysteriesIntro.length > 0 ? mysteriesIntro : (chapterRecord?.mysteriesIntroduced || ["Ongoing questions regarding the Grand Line"]),
    questionsAnswered: chapterRecord?.mysteriesAnswered || ["Deepened context regarding ongoing conflicts"],
    foreshadowingIntroduced: fsInChapter.length > 0 ? fsInChapter : (chapterRecord?.foreshadowingIntroduced || ["Narrative hints laid by Oda"]),
    importantEvents: battlesInChapter.length > 0 ? battlesInChapter : (chapterRecord?.majorEvents || [`Events unfolding in Chapter ${chapterNum}`]),
    theoriesAffected: ["Canon story progress", "Character strength progression"],
    summary: chapterRecord?.summary || `Chapter ${chapterNum} of Eiichiro Oda's One Piece, advancing the journey across the Grand Line.`,
  };
}

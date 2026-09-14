import { FactionGroup } from "../types";

export const factionsData: FactionGroup[] = [
  {
    id: "world_government",
    name: "World Government",
    japaneseName: "世界政府",
    category: "World Government",
    leadership: "Imu (Supreme Sovereign) & The Five Elders (Gorosei)",
    headquarters: "Pangaea Castle, Mary Geoise (Red Line)",
    ideology: "Absolute Order & Maintenance of the 800-Year Taboo / Erasure of the Void Century",
    summary: "The colossal planetary alliance of over 170 allied nations established 800 years ago atop the Red Line by 20 founding monarchies following the defeat of the Ancient Kingdom.",
    hierarchy: [
      {
        id: "imu",
        name: "Imu",
        title: "Sovereign of the Empty Throne / The True Ruler of the World",
        status: "Living Shadow Emperor",
        subordinates: [
          {
            id: "gorosei",
            name: "The Five Elders (Gorosei)",
            title: "Highest Authorities of the World Government / God Warriors",
            status: "Active Demonic Authorities",
            subordinates: [
              {
                id: "holy_knights",
                name: "Holy Knights (God's Knights)",
                title: "Internal Security & Enforcers of Mary Geoise (Supreme Commander: Saint Figarland Garling)",
                status: "Active Enforcers",
              },
              {
                id: "marines",
                name: "Marine Headquarters (Kaigun)",
                title: "Global Maritime Military Armed Wing (Fleet Admiral Sakazuki Akainu)",
                status: "Active Fleet",
                subordinates: [
                  { id: "admirals", name: "Three Admirals", title: "Kizaru (Borsalino), Fujitora (Issho), Ryokugyu (Aramaki)" },
                  { id: "vice_admirals", name: "Vice Admirals & SWORD", title: "Monkey D. Garp, Tsuru, Doll, Koby, Prince Grus" },
                ],
              },
              {
                id: "cipher_pol",
                name: "Cipher Pol (CP0 - Aegis0 to CP9)",
                title: "Intelligence & Assassination Agency (Rob Lucci, Kaku, Stussy, Guernica)",
                status: "Covert Agency",
              },
              {
                id: "seraphim",
                name: "Special Science Group (SSG) & Seraphim",
                title: "Lunarian-Cyborg Pacifistas equipped with Green Blood & Warlord DNA (S-Hawk, S-Snake, S-Shark, S-Bear)",
                status: "Supreme Military Cyborgs",
              },
            ],
          },
        ],
      },
    ],
    relatedFactions: [
      { id: "revolutionary_army", name: "Revolutionary Army", relation: "Primary Existential Enemy" },
      { id: "four_emperors", name: "Four Emperors", relation: "Geopolitical Adversaries" },
      { id: "marines", name: "Marines", relation: "Subordinate Military Arm" },
    ],
  },
  {
    id: "revolutionary_army",
    name: "Revolutionary Army",
    japaneseName: "革命軍",
    category: "Revolutionary Army",
    leadership: "Supreme Commander Monkey D. Dragon & Chief of Staff Sabo",
    headquarters: "Kamabakka Kingdom, Momoiro Island (formerly Baltigo)",
    ideology: "Direct overthrow of the corrupt World Nobles (Celestial Dragons) and liberation of oppressed nations worldwide.",
    summary: "The sole force in the world directly seeking the overthrow of the World Government. Does not target the Marines or ordinary citizens, but the tyrannical divine aristocracy ruling from Mary Geoise.",
    hierarchy: [
      {
        id: "dragon",
        name: "Monkey D. Dragon",
        title: "Supreme Commander / 'World's Worst Criminal'",
        status: "Active Revolutionary",
        subordinates: [
          {
            id: "sabo",
            name: "Sabo",
            title: "Chief of Staff / 'Flame Emperor'",
            status: "Active Second-in-Command",
            subordinates: [
              { id: "ivankov", name: "Emporio Ivankov", title: "Commander of the G Army (Grand Line)" },
              { id: "karasu", name: "Karasu", title: "Commander of the North Army (Soot Fruit)" },
              { id: "belo_betty", name: "Belo Betty", title: "Commander of the East Army (Pump-Pump Fruit)" },
              { id: "morley", name: "Morley", title: "Commander of the West Army (Push-Push Fruit)" },
              { id: "lindbergh", name: "Lindbergh", title: "Commander of the South Army (Mink Inventor)" },
              { id: "kuma_hist", name: "Bartholomew Kuma (Founding Officer)", title: "Former King of Sorbet / Founding Revolutionary" },
            ],
          },
        ],
      },
    ],
    relatedFactions: [
      { id: "world_government", name: "World Government", relation: "Mortal Target" },
      { id: "straw_hats", name: "Straw Hat Pirates", relation: "Allied Family (Luffy is Dragon's son / Sabo's brother)" },
    ],
  },
  {
    id: "yonko_crews",
    name: "The Four Emperors (Yonko)",
    japaneseName: "四皇",
    category: "Four Emperors",
    leadership: "Monkey D. Luffy, Red-Haired Shanks, Marshall D. Teach, Buggy the Star Clown (Cross Guild)",
    headquarters: "New World Seas",
    ideology: "Sovereign pirate supremacy and pursuit of the One Piece.",
    summary: "The four mighty pirate captains ruling the New World like kings. Following the downfalls of Whitebeard, Kaido, and Big Mom, the title belongs to the four paramount crews steering the dawn of the final war.",
    hierarchy: [
      {
        id: "yonko_shanks",
        name: "Red Hair Pirates",
        title: "Chief: Red-Haired Shanks (Bounty: 4,048,900,000)",
        subordinates: [
          { id: "beckman", name: "Benn Beckman", title: "First Mate / Highest IQ in East Blue" },
          { id: "roux", name: "Lucky Roux", title: "Combatant / Speed Enforcer" },
          { id: "yasopp", name: "Yasopp", title: "Sniper / Father of Usopp" },
        ],
      },
      {
        id: "yonko_luffy",
        name: "Straw Hat Grand Fleet",
        title: "Captain: Monkey D. Luffy (Bounty: 3,000,000,000)",
        subordinates: [
          { id: "zoro_sub", name: "Roronoa Zoro (King of Hell)", title: "Swordsman (Bounty: 1,111,000,000)" },
          { id: "sanji_sub", name: "Vinsmoke Sanji (Black Leg)", title: "Cook (Bounty: 1,032,000,000)" },
          { id: "jinbe_sub", name: "Jinbe (Knight of the Sea)", title: "Helmsman (Bounty: 1,100,000,000)" },
          { id: "grand_fleet_sub", name: "7 Representative Commanders", title: "Cavendish, Bartolomeo, Sai, Ideo, Leo, Hajrudin, Orlumbus (5,600 Troops)" },
        ],
      },
      {
        id: "yonko_teach",
        name: "Blackbeard Pirates",
        title: "Admiral: Marshall D. Teach (Bounty: 3,996,000,000)",
        subordinates: [
          { id: "kuzan_sub", name: "Kuzan (Aokiji)", title: "Tenth Titanic Captain" },
          { id: "shiryu_sub", name: "Shiryu of the Rain", title: "Second Titanic Captain (Clear-Clear Fruit)" },
          { id: "van_auger_sub", name: "Van Augur", title: "Third Titanic Captain (Warp-Warp Fruit)" },
        ],
      },
      {
        id: "yonko_cross_guild",
        name: "Cross Guild",
        title: "Figurehead Emperor: Buggy the Genius Jester (Bounty: 3,189,000,000)",
        subordinates: [
          { id: "mihawk_sub", name: "Dracule Mihawk (True Leader)", title: "World's Greatest Swordsman (Bounty: 3,590,000,000)" },
          { id: "crocodile_sub", name: "Sir Crocodile (True Leader)", title: "Former Warlord (Bounty: 1,965,000,000)" },
        ],
      },
    ],
    relatedFactions: [
      { id: "world_government", name: "World Government", relation: "Great Rival Powers" },
      { id: "marines", name: "Marines", relation: "Target of Marine Bounties by Cross Guild" },
    ],
  },
  {
    id: "major_kingdoms",
    name: "Allied Sovereign Kingdoms",
    japaneseName: "世界諸王国",
    category: "Kingdoms",
    leadership: "Monarchs of Alabasta, Ryugu, Dressrosa, Wano, Elbaf, and Sakura",
    headquarters: "Worldwide",
    ideology: "Peaceful sovereignty, protection of citizens, and emerging resistance against World Government oppression.",
    summary: "The key kingdoms whose fates have been intertwined with the Straw Hats and ancient history.",
    hierarchy: [
      {
        id: "k_alabasta",
        name: "Alabasta Kingdom",
        title: "Desert Kingdom / Royal House of Nefertari",
        subordinates: [
          { id: "vivi_sub", name: "Princess Nefertari D. Vivi", title: "Carrier of the Will of D." },
          { id: "cobra_sub", name: "Nefertari Cobra (Late King)", title: "Slain by Imu & Gorosei for questioning Lili's letter" },
        ],
      },
      {
        id: "k_wano",
        name: "Wano Country",
        title: "Land of Samurai / Kozuki Dynasty",
        subordinates: [
          { id: "momo_sub", name: "Kozuki Momonosuke", title: "Shogun of Wano (Adult Dragon Form)" },
          { id: "sukiyaki_sub", name: "Kozuki Sukiyaki (Tenguyama)", title: "Master Swordsmith / Keeper of Pluton" },
        ],
      },
      {
        id: "k_ryugu",
        name: "Ryugu Kingdom (Fish-Man Island)",
        title: "Undersea Civilization / House of Neptune",
        subordinates: [
          { id: "shirahoshi_sub", name: "Princess Shirahoshi", title: "Ancient Weapon Poseidon (Ruler of Sea Kings)" },
          { id: "neptune_sub", name: "King Neptune", title: "Keeper of the Noah Promise" },
        ],
      },
      {
        id: "k_elbaf",
        name: "Kingdom of Elbaf",
        title: "Land of War / Giant Civilization",
        subordinates: [
          { id: "loki_sub", name: "Prince Loki", title: "Chained Underworld Prince" },
          { id: "dorry_brogy_sub", name: "Dorry & Brogy", title: "Captains of the Giant Warrior Pirates" },
        ],
      },
    ],
    relatedFactions: [
      { id: "straw_hats", name: "Straw Hat Pirates", relation: "Liberators & Revered Friends" },
      { id: "world_government", name: "World Government", relation: "Formal Subjugators / Tense Alliances" },
    ],
  },
];

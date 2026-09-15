import fs from "fs";
import path from "path";

// Mapping of known users, descriptions, and lore for devil fruits
const FRUIT_LORE_MAP = {
  "gunyo-gunyo-no-mi": {
    user: "Prince Grus",
    affiliation: "Marines / SWORD Rear Admiral",
    awakened: false,
    strengths: ["Can generate and shape endless clay into independent Clay Golem soldiers (Gunsan).", "Clay absorbs physical concussive shock and reconstructs effortlessly."],
    weaknesses: ["Standard Devil Fruit weaknesses."],
    firstChapter: 1080
  },
  "muchi-muchi-no-mi": {
    user: "Kujaku",
    affiliation: "Marines / SWORD Rear Admiral (Tsuru's Granddaughter)",
    awakened: false,
    strengths: ["Can tame and command anything she strikes with her whip, including inanimate buildings and weapons."],
    weaknesses: ["Standard Devil Fruit weaknesses."],
    firstChapter: 1080
  },
  "shima-shima-no-mi": {
    user: "Avalo Pizarro",
    affiliation: "Blackbeard Pirates 4th Titanic Captain",
    awakened: false,
    strengths: ["Island-Island Fruit: can assimilate body into an entire island, moving mountains and speaking through giant skull rocks."],
    weaknesses: ["Damage inflicted on the island is directly felt by Pizarro's physical body."],
    firstChapter: 1080
  },
  "gabu-gabu-no-mi": {
    user: "Vasco Shot",
    affiliation: "Blackbeard Pirates 8th Titanic Captain",
    awakened: false,
    strengths: ["Glug-Glug Fruit: can generate and ignite flammable alcohol and ride on floating booze bubbles."],
    weaknesses: ["Extreme inebriation impairing tactical judgment."],
    firstChapter: 1080
  },
  "deka-deka-no-mi": {
    user: "Sanjuan Wolf",
    affiliation: "Blackbeard Pirates 7th Titanic Captain",
    awakened: false,
    strengths: ["Huge-Huge Fruit: expands his giant body up to 180 meters tall, wading through the ocean floor."],
    weaknesses: ["Constantly submerged feet cause constant low-grade sea weakness."],
    firstChapter: 595
  },
  "woco-woco-no-mi": {
    user: "Karasu",
    affiliation: "Revolutionary Army Northern Army Commander",
    awakened: false,
    strengths: ["Soot-Soot Fruit: transforms body into murder of soot crows to fly, deliver messages, and attack in swarms."],
    weaknesses: ["Water dampens and solidifies soot particles."],
    firstChapter: 904
  },
  "kob-kob-no-mi": {
    user: "Belo Betty",
    affiliation: "Revolutionary Army Eastern Army Commander",
    awakened: false,
    strengths: ["Pump-Pump Fruit: waving her banner awakens latent courage and physical combat stamina in civilian allies."],
    weaknesses: ["Does not impart combat martial skills to people who lack them."],
    firstChapter: 904
  },
  "soru-soru-no-mi": {
    user: "Charlotte Linlin (Big Mom)",
    affiliation: "Big Mom Pirates / Former Four Emperors",
    prevUser: "Carmel (Mother Carmel)",
    awakened: true,
    awakeningDesc: "Can infuse souls into giant conceptual homies (Hera, Zeus, Prometheus, Misery) and sacrifice her own lifespan to drastically augment physical size and combat resilience.",
    strengths: ["Direct manipulation of human lifespan and souls.", "Creation of living 'Homies' from inanimate matter and elements (sun, clouds, steel).", "Soul Pocus command over anyone feeling even momentary fear."],
    weaknesses: ["Cannot infuse souls into corpses or other living humans.", "Lifespan extraction fails against targets devoid of fear towards the user."],
    firstChapter: 827
  },
  "yami-yami-no-mi": {
    user: "Marshall D. Teach (Blackbeard)",
    affiliation: "Blackbeard Pirates / Four Emperors",
    prevUser: "Thatch (Whitebeard Pirates)",
    awakened: false,
    strengths: ["Infinite gravity vortex (Black Hole, Liberation).", "Nullifies any Devil Fruit power upon physical contact.", "Can absorb and crush cities into gravitational singularity."],
    weaknesses: ["Cannot make the user's body intangible like typical Logia.", "Absorbs all incoming damage, causing the user to experience double pain."],
    firstChapter: 440
  },
  "ope-ope-no-mi": {
    user: "Trafalgar D. Water Law",
    affiliation: "Heart Pirates / Worst Generation",
    prevUser: "Unknown medical prodigy",
    awakened: true,
    awakeningDesc: "K-ROOM and R-ROOM spatial mastery: weapons pierce internal organs without cutting outer flesh to unleash devastating shockwaves (Shock Wille, Puncture Wille).",
    strengths: ["Spherical spatial dominion (ROOM).", "Teleportation (Shambles), non-lethal dismemberment, and personality transfer.", "Perennial Youth Surgery (at cost of user life)."],
    weaknesses: ["Extreme rapid stamina drain proportional to ROOM volume.", "Overwhelming Haki prevents spatial displacement of foes."],
    firstChapter: 504
  },
  "gura-gura-no-mi": {
    user: "Marshall D. Teach (Current) / Edward Newgate (Former)",
    affiliation: "Blackbeard Pirates / Whitebeard Pirates",
    prevUser: "Edward Newgate (Whitebeard)",
    awakened: false,
    strengths: ["Strongest Paramecia fruit: can shatter tectonic plates, air, and ocean waves.", "Generates cataclysmic ocean tsunamis and island-shattering quakes.", "Fleet Admiral Sengoku stated it possesses power to destroy the world."],
    weaknesses: ["High collateral devastation risk to friendly forces and own vessels."],
    firstChapter: 552
  },
  "ito-ito-no-mi": {
    user: "Donquixote Doflamingo",
    affiliation: "Donquixote Family / Former Warlord of the Sea",
    awakened: true,
    awakeningDesc: "Transforms entire city architecture and terrain into razor-sharp strings under total mental command (Break White, Flap Thread).",
    strengths: ["Parasite string mind control over dozens of victims simultaneously.", "Birdcage enclosing an entire island.", "Can stitch internal organs to survive lethal trauma."],
    weaknesses: ["Strings can be broken or overwhelmed by Advanced Armament / Conqueror Haki."],
    firstChapter: 234
  },
  "mochi-mochi-no-mi": {
    user: "Charlotte Katakuri",
    affiliation: "Big Mom Pirates / Sweet Commanders",
    awakened: true,
    awakeningDesc: "Special Paramecia awakening: turns surrounding floor, walls, and structures into infinite sticky mochi dough to trap and crush opponents.",
    strengths: ["Behaves pseudo-Logia: reforms around attacks paired with Future Sight.", "Infinite adhesive strength and elasticity.", "Hardened mochi punches hit with sledgehammer force."],
    weaknesses: ["Mochi loses stickiness and structural density when soaked in liquid."],
    firstChapter: 860
  },
  "mera-mera-no-mi": {
    user: "Sabo (Current) / Portgas D. Ace (Former)",
    affiliation: "Revolutionary Army Chief of Staff / Whitebeard 2nd Division Commander",
    prevUser: "Portgas D. Ace",
    awakened: false,
    strengths: ["Total elemental fire transformation and generation.", "Devastating thermal firepower (Dai Enkai: Entei, Hiken / Fire Fist).", "Flight via jet propulsion of flames."],
    weaknesses: ["Directly inferior and smothered by the Mag-Mag Fruit (Magu Magu no Mi)."],
    firstChapter: 159
  },
  "magu-magu-no-mi": {
    user: "Sakazuki (Fleet Admiral Akainu)",
    affiliation: "Marines / Fleet Admiral",
    awakened: true,
    awakeningDesc: "Permanently mutated the climate of Punk Hazard into a raging volcanic hellscape.",
    strengths: ["Highest offensive firepower among all Devil Fruits.", "Liquid magma incinerates fire, flesh, steel, and stone.", "Can launch meteor volleys from the stratosphere (Ryusei Kazan)."],
    weaknesses: ["Extreme heat can melt the terrain beneath the user."],
    firstChapter: 554
  },
  "hie-hie-no-mi": {
    user: "Kuzan (Aokiji)",
    affiliation: "Blackbeard Pirates 10th Titanic Captain / Former Marine Admiral",
    awakened: true,
    awakeningDesc: "Permanently altered half of Punk Hazard into a sub-zero frozen tundra.",
    strengths: ["Instant flash-freezing across dozens of ocean miles (Ice Age).", "Solid ice Logia: shattered ice body pieces simply reform.", "Allows user to travel on ocean surface by freezing a bicycle track."],
    weaknesses: ["Vulnerable to extreme high heat elements like magma and intense flames."],
    firstChapter: 303
  },
  "pika-pika-no-mi": {
    user: "Borsalino (Admiral Kizaru)",
    affiliation: "Marines / Admiral",
    awakened: false,
    strengths: ["Movement and kicking at the speed of light.", "Devastating laser beams that generate massive piercing explosions.", "Can construct solid light blades (Ama no Murakumo)."],
    weaknesses: ["Light travels in strictly straight paths unless reflected off reflective mirrors."],
    firstChapter: 507
  },
  "goro-goro-no-mi": {
    user: "Enel",
    affiliation: "God of Skypiea / Moon Explorer",
    awakened: false,
    strengths: ["Revered as 'Invincible': can output up to 200,000,000 volts of lightning.", "Lightning speed movement and electrical cardio-defibrillation restart upon death.", "Can amplify Observation Haki (Mantra) across the entire sky island."],
    weaknesses: ["Completely nullified by rubber (Gomu Gomu no Mi / Nika)."],
    firstChapter: 254
  },
  "suna-suna-no-mi": {
    user: "Crocodile (Sir Crocodile)",
    affiliation: "Cross Guild / Former Warlord of the Sea",
    awakened: false,
    strengths: ["Complete sand manipulation and generation.", "Dehydration touch: drains all moisture from living beings and land into withered dust.", "Generates sandstorms and quicksand chasms."],
    weaknesses: ["Sand solidifies into solid form when soaked with water, blood, or liquid."],
    firstChapter: 155
  },
  "moku-moku-no-mi": {
    user: "Smoker (Vice Admiral)",
    affiliation: "Marines / G-5 Vice Admiral",
    awakened: false,
    strengths: ["Can turn body into smoke to evade attacks and disperse across areas.", "Smoke flight and propulsion for high mobility."],
    weaknesses: ["Expanding smoke volume increases the target hitbox against Armament Haki."],
    firstChapter: 100
  },
  "zushi-zushi-no-mi": {
    user: "Issho (Admiral Fujitora)",
    affiliation: "Marines / Admiral",
    awakened: false,
    strengths: ["Gravitational manipulation: can pull meteors down from outer space orbit.", "Can levitate islands and city rubble into the sky simultaneously.", "Horizontal gravitational repulsions (Ferocious Tiger)."],
    weaknesses: ["Requires intense mental concentration."],
    firstChapter: 701
  },
  "mori-mori-no-mi": {
    user: "Aramaki (Admiral Ryokugyu)",
    affiliation: "Marines / Admiral",
    awakened: false,
    strengths: ["Forest Logia: can sprout entire lush forests and vegetation from barren earth.", "Roots pierce targets to drain all nutrients, fat, and liquids instantly.", "Can regenerate from a single blooming sprout."],
    weaknesses: ["Vulnerable to intense dragon flames (Boro Breath)."],
    firstChapter: 1053
  },
  "hana-hana-no-mi": {
    user: "Nico Robin",
    affiliation: "Straw Hat Pirates / Archaeologist",
    awakened: false,
    strengths: ["Can sprout body parts (hands, feet, eyes, clones) on any visible surface.", "Giant limbs (Gigantesco Mano) and Demonio Fleur devil transformation.", "Subtle reconnaissance by sprouting ears and eyes anywhere."],
    weaknesses: ["Damage inflicted on sprouted body parts is felt by Robin's actual body."],
    firstChapter: 114
  },
  "yomi-yomi-no-mi": {
    user: "Brook (Soul King)",
    affiliation: "Straw Hat Pirates / Musician",
    awakened: false,
    strengths: ["Grants a second life: Brook's soul returned to his skeleton.", "Soul projection through walls and solid obstacles.", "Freezing chill of the underworld (Soul Solid sword ice).", "Dominion over lesser artificial homies."],
    weaknesses: ["Power's primary resurrection feature only activates once upon death."],
    firstChapter: 442
  },
  "kage-kage-no-mi": {
    user: "Gecko Moria",
    affiliation: "Former Warlord of the Sea / Thriller Bark",
    awakened: false,
    strengths: ["Can sever human shadows and implant them into corpses to create zombies.", "Shadow Asgard: absorbs hundreds of shadows to gain immense strength.", "Doppelman: living shadow body double."],
    weaknesses: ["Victims severed from shadows vaporize under sunlight.", "Salt purifies shadows from zombie corpses."],
    firstChapter: 449
  },
  "doku-doku-no-mi": {
    user: "Magellan",
    affiliation: "Impel Down Vice Warden",
    awakened: false,
    strengths: ["Generates lethal toxic venoms, corrosive acid, and neurotoxins.", "Venom Demon (Hell's Judgment): corrosive red poison that spreads exponentially.", "Near impenetrable poison armor coating."],
    weaknesses: ["Consuming poisoned food causes Magellan severe chronic diarrhea."],
    firstChapter: 528
  },
  "nikyu-nikyu-no-mi": {
    user: "Bartholomew Kuma",
    affiliation: "Revolutionary Army Founder / Former Warlord of the Sea",
    awakened: false,
    strengths: ["Paw pads can repel anything at light speed, including air and shockwaves.", "Can extract conceptual things: physical pain, exhaustion, and memories.", "Compresses atmosphere into devastating shockwave bombs (Ursus Shock)."],
    weaknesses: ["Repulsion only functions through the paw pads on the user's palms."],
    firstChapter: 473
  },
  "mero-mero-no-mi": {
    user: "Boa Hancock (Pirate Empress)",
    affiliation: "Kuja Pirates / Former Warlord of the Sea",
    awakened: false,
    strengths: ["Turns anyone with lust, adoration, or attraction toward the user into stone.", "Slave Arrow and Pistol Kiss petrify stone on impact regardless of feelings.", "Perfume Femur: kicks shatter solid stone."],
    weaknesses: ["Mero Mero Mellow fails if target nullifies lust through intense pain (like Momonga)."],
    firstChapter: 516
  },
  "horu-horu-no-mi": {
    user: "Emporio Ivankov",
    affiliation: "Revolutionary Army G-Army Commander / Kamabakka Kingdom",
    awakened: false,
    strengths: ["Injects custom hormones to alter biological sex, body temperature, energy, and adrenaline.", "Healing hormones can grant the immune system incredible recovery boosts."],
    weaknesses: ["Healing hormones shorten the recipient's natural lifespan as a toll."],
    firstChapter: 537
  },
  "choki-choki-no-mi": {
    user: "Inazuma",
    affiliation: "Revolutionary Army",
    awakened: false,
    strengths: ["Can transform hands into scissors to cut any solid material like paper."],
    weaknesses: ["Standard Devil Fruit sea weakness."],
    firstChapter: 537
  },
  "bara-bara-no-mi": {
    user: "Buggy the Clown",
    affiliation: "Cross Guild Leader / Four Emperors",
    awakened: false,
    strengths: ["Immune to all cutting and slicing attacks (including Mihawk's slashes).", "Can split body into flying fragments within a radius while feet remain on ground."],
    weaknesses: ["Feet cannot fly and must remain planted on the ground."],
    firstChapter: 9
  },
  "sube-sube-no-mi": {
    user: "Alvida (Iron Mace)",
    affiliation: "Cross Guild / Buggy's Delivery",
    awakened: false,
    strengths: ["Makes user's skin so frictionless that all attacks slip harmlessly away."],
    weaknesses: ["Standard sea weakness."],
    firstChapter: 98
  },
  "kilo-kilo-no-mi": {
    user: "Mikita (Miss Valentine)",
    affiliation: "Former Baroque Works Officer Agent",
    awakened: false,
    strengths: ["Can change body weight from 1 kilogram to 10,000 kilograms instantly."],
    weaknesses: ["Predictable descending attack trajectories."],
    firstChapter: 110
  },
  "bomu-bomu-no-mi": {
    user: "Gem (Mr. 5)",
    affiliation: "Former Baroque Works Officer Agent",
    awakened: false,
    strengths: ["Can make any part of the body explode, including breath and mucus.", "Immune to external explosions."],
    weaknesses: ["Close combat skill limitations."],
    firstChapter: 110
  },
  "doru-doru-no-mi": {
    user: "Galdino (Mr. 3)",
    affiliation: "Cross Guild / Former Baroque Works",
    awakened: false,
    strengths: ["Produces hardened candle wax stronger than steel.", "Can mold giant protective domes, champion mechas, and key locks."],
    weaknesses: ["Wax melts rapidly when exposed to fire or extreme heat."],
    firstChapter: 118
  },
  "mane-mane-no-mi": {
    user: "Bentham (Mr. 2 Bon Kurei)",
    affiliation: "Newkama Land Queen / Impel Down",
    prevUser: "Kurozumi Higurashi (Wano)",
    awakened: false,
    strengths: ["Touching a person's face with the right hand copies their appearance and voice.", "Touching own face with left hand returns user to normal."],
    weaknesses: ["Cannot use own signature martial arts while wearing copied face."],
    firstChapter: 156
  },
  "toge-toge-no-mi": {
    user: "Paula (Miss Doublefinger)",
    affiliation: "Former Baroque Works",
    awakened: false,
    strengths: ["Can sprout razor-sharp spikes from any part of the body, piercing stone."],
    weaknesses: ["Standard sea weakness."],
    firstChapter: 190
  },
  "bane-bane-no-mi": {
    user: "Bellamy the Hyena",
    affiliation: "Former Bellamy Pirates / Dressrosa Doffy Subordinate",
    awakened: false,
    strengths: ["Transforms limbs into high-tension coiled steel springs for bounce speed."],
    weaknesses: ["Straight-line rebound angles can be predicted and countered."],
    firstChapter: 231
  },
  "noro-noro-no-mi": {
    user: "Foxy the Silver Fox",
    affiliation: "Foxy Pirates",
    awakened: false,
    strengths: ["Emits Noroma Photons that slow down anything caught in the beam for 30 seconds."],
    weaknesses: ["Beams can be reflected back at Foxy using mirrors."],
    firstChapter: 305
  },
  "awa-awa-no-mi": {
    user: "Kalifa",
    affiliation: "CP0 / Former CP9",
    awakened: false,
    strengths: ["Emits soap bubbles that clean away physical strength and smooth out body edges."],
    weaknesses: ["Water rinses away the soap slick effect immediately."],
    firstChapter: 379
  },
  "ushi-ushi-no-mi-model-bison": {
    user: "Dalton",
    affiliation: "Sakura Kingdom King",
    awakened: false,
    strengths: ["Transforms into a powerful bison with immense charging momentum."],
    weaknesses: ["Standard Zoan limits."],
    firstChapter: 133
  },
  "ushi-ushi-no-mi-model-giraffe": {
    user: "Kaku",
    affiliation: "CP0 / Former CP9",
    awakened: true,
    awakeningDesc: "Awakened Zoan form features a floating black hagoromo smoke ribbon and lightning-fast neck strikes (Bigan).",
    strengths: ["Long neck enhances slicing Range of Rankyaku.", "Exceptional physical strength and reach."],
    weaknesses: ["Awkward square-geometric neck proportions."],
    firstChapter: 379
  },
  "neko-neko-no-mi-model-leopard": {
    user: "Rob Lucci",
    affiliation: "CP0 Chief Agent / Former CP9",
    awakened: true,
    awakeningDesc: "Awakened Zoan form gives Lucci a slender, flame-wreathed predatory form with black hagoromo cloud scarf, multiplying Rokushiki agility and lethal power.",
    strengths: ["Apex carnivorous predatory agility and bloodlust.", "Piercing Shigan claws and Rokuogan shockwaves."],
    weaknesses: ["Overpowered by Gear 5 Nika."],
    firstChapter: 349
  },
  "zou-zou-no-mi": {
    user: "Funkfreed (Spandam's Sword)",
    affiliation: "CP9 / Marines",
    awakened: false,
    strengths: ["Inanimate sword fused with Zoan elephant soul; transforms into living elephant."],
    weaknesses: ["Elephant mind can feel fear and be frightened."],
    firstChapter: 394
  },
  "zou-zou-no-mi-model-mammoth": {
    user: "Jack the Drought",
    affiliation: "Beasts Pirates / All-Stars Lead Performer",
    awakened: false,
    strengths: ["Ancient Zoan mammoth: colossal destructive mass and monstrous endurance.", "Can fight for five continuous days and nights without rest."],
    weaknesses: ["Slow speed compared to agile aerial fighters."],
    firstChapter: 801
  },
  "ryu-ryu-no-mi-model-allosaurus": {
    user: "X Drake",
    affiliation: "SWORD Captain / Former Flying Six",
    awakened: false,
    strengths: ["Ancient Zoan predator: bone-crushing jaw bite strength and thick reptilian armor."],
    weaknesses: ["Short dinosaur front forearms."],
    firstChapter: 498
  },
  "ryu-ryu-no-mi-model-pteranodon": {
    user: "King the Conflagration (Alber)",
    affiliation: "Beasts Pirates / All-Stars Lead Performer (Lunarian)",
    awakened: false,
    strengths: ["Ancient Zoan flyer: supersonic flight speed and catapult beak attacks (Tempura Udon).", "Paired with Lunarian durability and fiery body combustion."],
    weaknesses: ["Speed mode lowers Lunarian defensive invulnerability."],
    firstChapter: 925
  },
  "ryu-ryu-no-mi-model-brachiosaurus": {
    user: "Queen the Plague",
    affiliation: "Beasts Pirates / All-Stars Lead Performer (Cybernetic)",
    awakened: false,
    strengths: ["Ancient Zoan sauropod: colossal bulk, crushing snake-like neck constriction (Brachio-Hold).", "Integrated cybernetic rocket launchers and Germa stealth capabilities."],
    weaknesses: ["Often accidentally shoots himself with his own rocket arsenal."],
    firstChapter: 925
  },
  "ryu-ryu-no-mi-model-spinosaurus": {
    user: "Page One",
    affiliation: "Beasts Pirates / Flying Six",
    awakened: false,
    strengths: ["Ancient Zoan carnivore: powerful jaw snap, strong tail sweeps, and resilience."],
    weaknesses: ["Standard sea weakness."],
    firstChapter: 929
  },
  "tori-tori-no-mi-model-phoenix": {
    user: "Marco the Phoenix",
    affiliation: "Whitebeard Pirates 1st Division Commander / Doctor",
    awakened: false,
    strengths: ["Mythical Zoan: Blue Flames of Resurrection heal any mortal wound instantly.", "Can fly freely and extend healing azure flames to allies.", "Flames possess no burning heat but absorb concussive impact."],
    weaknesses: ["Stamina depletes if healing excessive catastrophic trauma."],
    firstChapter: 434
  },
  "uo-uo-no-mi-model-seiryu": {
    user: "Kaido of the Beasts",
    affiliation: "Beasts Pirates Governor-General / Former Emperor",
    awakened: false,
    strengths: ["Mythical Zoan Azure Dragon: generates Boro Breath vaporizing mountains.", "Produces Flame Clouds to fly and levitate entire islands (Onigashima).", "Virtually impenetrable dragon scale armor; Kaen Daiko magma avatar."],
    weaknesses: ["Internal destruction Armament Haki and Advanced Conqueror coating."],
    firstChapter: 921
  }
};

async function main() {
  console.log("Starting data fetch from onepieceapi.com...");

  // 1. Fetch Devil Fruits
  let fruits = [];
  try {
    let page = 1;
    while (true) {
      console.log(`Fetching fruits page ${page}...`);
      const res = await fetch(`https://onepieceapi.com/api/devil-fruits?page=${page}&limit=50`);
      const data = await res.json();
      if (!Array.isArray(data) || !data.length) break;
      for (const item of data) {
        if (!fruits.some((f) => f.id === item.id)) {
          fruits.push(item);
        }
      }
      if (data.length < 50) break;
      page++;
    }
  } catch (err) {
    console.warn("External API fetch failed, using offline lore dataset fallback:", err.message);
  }
  console.log(`Fetched ${fruits.length} unique devil fruits.`);

  // 2. Fetch Characters
  let characters = [];
  try {
    let page = 1;
    while (true) {
      console.log(`Fetching characters page ${page}...`);
      const res = await fetch(`https://onepieceapi.com/api/characters?page=${page}&limit=50`);
      const data = await res.json();
      if (!Array.isArray(data) || !data.length) break;
      for (const item of data) {
        if (!characters.some((c) => c.id === item.id)) {
          characters.push(item);
        }
      }
      if (data.length < 50) break;
      page++;
    }
  } catch (err) {
    console.warn("External API character fetch failed, using offline fallback:", err.message);
  }
  console.log(`Fetched ${characters.length} unique characters.`);

  // Filter characters with bounties
  const bountyCharacters = characters.filter(c => c.bounties && c.bounties.length > 0);
  console.log(`Found ${bountyCharacters.length} characters with bounties.`);

  // Process Devil Fruits
  const processedFruits = fruits.map(f => {
    const slug = (f.name?.romaji || f.name?.en || f.id)
      .toLowerCase()
      .replace(/[\s"“”，モデル「」]/g, "-")
      .replace(/-+/g, "-");

    // Match lore
    let matchedLoreKey = Object.keys(FRUIT_LORE_MAP).find(k => slug.includes(k) || k.includes(slug));
    const lore = matchedLoreKey ? FRUIT_LORE_MAP[matchedLoreKey] : null;

    let fruitType = f.type || "Paramecia";
    if (f.model?.en?.toLowerCase().includes("phoenix") || f.model?.en?.toLowerCase().includes("nika") || f.model?.en?.toLowerCase().includes("dragon") || f.model?.en?.toLowerCase().includes("daibutsu") || f.model?.en?.toLowerCase().includes("yamata")) {
      fruitType = "Mythical Zoan";
    } else if (f.model?.en?.toLowerCase().includes("mammoth") || f.model?.en?.toLowerCase().includes("pteranodon") || f.model?.en?.toLowerCase().includes("brachiosaurus") || f.model?.en?.toLowerCase().includes("allosaurus") || f.model?.en?.toLowerCase().includes("spinosaurus") || f.model?.en?.toLowerCase().includes("triceratops")) {
      fruitType = "Ancient Zoan";
    }

    return {
      id: f.id,
      name: f.name?.romaji || f.name?.en || "Unknown Fruit",
      englishName: f.name?.en || "Unknown Fruit",
      japaneseName: f.name?.jp || "",
      romajiName: f.name?.romaji || "",
      meaning: f.model?.en ? `${f.model.en} Model` : f.name?.en || "",
      type: fruitType,
      model: f.model?.en || undefined,
      subType: f.sub_type || undefined,
      imageUrl: f.image_url,
      currentUser: lore?.user || "Unknown User",
      currentUserAffiliation: lore?.affiliation || undefined,
      previousUser: lore?.prevUser || undefined,
      isAwakened: lore?.awakened ?? false,
      awakeningStatus: lore?.awakened ? "Awakened (Kakusei)" : "Unconfirmed / Standard",
      awakeningDescription: lore?.awakeningDesc || undefined,
      description: `The ${f.name?.en || f.name?.romaji || "Devil Fruit"} is a ${fruitType} class Akuma no Mi granting its wielder extraordinary superhuman traits upon consumption.`,
      strengths: lore?.strengths || ["Grants extraordinary abilities tailored to the fruit's manifestation."],
      weaknesses: lore?.weaknesses || ["Standard sea water weakness (paralysis in standing water) and Seastone nullification."],
      firstMangaChapter: lore?.firstChapter || 1,
      scientificNotes: "Dr. Vegapunk discovered Devil Fruits originate from human desires and dreams for different facets of human evolution. Mother Nature, the Sea, curses their users as unnatural aberrations."
    };
  });

  // Ensure iconic Hito Hito no Mi Model: Nika is included at the top!
  const hasNika = processedFruits.some(f => f.name.includes("Nika"));
  if (!hasNika) {
    processedFruits.unshift({
      id: "hito-hito-nika",
      name: "Hito Hito no Mi, Model: Nika",
      englishName: "Human-Human Fruit, Model: Nika (Gum-Gum Fruit)",
      japaneseName: "ヒトヒトの実 モデル“ニカ”",
      romajiName: "Hito Hito no Mi, Moderu: Nika",
      meaning: "Sun God Nika / Rubber Warrior of Liberation",
      type: "Mythical Zoan",
      model: "Nika",
      imageUrl: "https://hlryizauzapedkefdviw.supabase.co/storage/v1/object/public/devil-fruits/gomu-gomu-no-mi.webp",
      currentUser: "Monkey D. Luffy",
      currentUserAffiliation: "Straw Hat Grand Fleet / Four Emperors",
      previousUser: "Joy Boy (Void Century)",
      isAwakened: true,
      awakeningStatus: "Awakened (Gear 5 / Drums of Liberation)",
      awakeningDescription: "Allows the user's rubber body total freedom of imagination, transforming surroundings and living beings into malleable cartoon rubber, radiating laughter and delight.",
      description: "Renamed by the World Government to 'Gomu Gomu no Mi' (Gum-Gum Fruit) to erase the name of the Warrior of Liberation from history. The Gorosei note that Zoan fruits have a will of their own and that this fruit has continually slipped from their grasp for 800 years.",
      strengths: [
        "Immunity to blunt trauma and electricity.",
        "Limitless physical stretching and elasticity.",
        "Awakened freedom: can grab lightning, run on air, enlarge body parts to island size (Bajrang Gun)."
      ],
      weaknesses: [
        "Standard sea water weakness and Seastone vulnerability.",
        "Sharp slicing blades.",
        "Extreme rapid stamina depletion and rapid aging immediately upon disengaging Gear 5."
      ],
      firstMangaChapter: 1,
      scientificNotes: "Vegapunk notes that ancient texts refer to Sun God Nika as a figure who made people smile and freed slaves. There is no ancient botanical record of a rubber Paramecia fruit; it has always been the Mythical Zoan Nika."
    });
  }

  // Write devilFruits.ts if data was fetched
  if (fruits.length > 0) {
    const devilFruitsFileContent = `// Generated from onepieceapi.com & Canonical Lore
import { DevilFruit } from "../types";

export const devilFruitsData: DevilFruit[] = ${JSON.stringify(processedFruits, null, 2)};
`;
    fs.writeFileSync(path.join(process.cwd(), "src/data/devilFruits.ts"), devilFruitsFileContent, "utf-8");
    console.log("Successfully wrote src/data/devilFruits.ts!");
  } else {
    console.log("Skipping write to src/data/devilFruits.ts (offline mode).");
  }

  // Process Pirate Bounties
  // Calculate highest bounty and tier for each character
  const processedBounties = bountyCharacters.map(char => {
    const sortedBounties = (char.bounties || []).sort((a, b) => b.amount - a.amount);
    const maxBounty = sortedBounties[0]?.amount || 0;

    let tier = "Pirate";
    if (maxBounty >= 5000000000) tier = "Legendary";
    else if (maxBounty >= 4000000000) tier = "Emperor";
    else if (maxBounty >= 1000000000) tier = "Supreme Threat";
    else if (maxBounty >= 300000000) tier = "High Threat";
    else if (maxBounty >= 100000000) tier = "Grand Line Commander";
    else if (maxBounty >= 30000000) tier = "Super Rookie";

    // Known Marine Targets (Cross Guild)
    const marineTargets = ["Sakazuki", "Monkey D. Garp", "Borsalino", "Issho", "Aramaki", "Kuzan", "Koby", "Prince Grus", "Kujaku", "Hibari", "Smoker", "Tashigi", "Sengoku", "Tsuru"];
    const isMarineTarget = marineTargets.some(m => char.name?.en?.includes(m));

    const nameEn = char.name?.en || "Unknown Pirate";
    const nameJp = char.name?.jp || "";
    const nameRomaji = char.name?.romaji || "";

    // Derive crew / affiliation
    let crew = "Independent / Unaligned";
    if (nameEn.includes("Luffy") || nameEn.includes("Zoro") || nameEn.includes("Nami") || nameEn.includes("Usopp") || nameEn.includes("Sanji") || nameEn.includes("Chopper") || nameEn.includes("Robin") || nameEn.includes("Franky") || nameEn.includes("Brook") || nameEn.includes("Jinbe")) {
      crew = "Straw Hat Pirates";
    } else if (nameEn.includes("Roger") || nameEn.includes("Rayleigh") || nameEn.includes("Gaban")) {
      crew = "Roger Pirates";
    } else if (nameEn.includes("Newgate") || nameEn.includes("Marco") || nameEn.includes("Ace") || nameEn.includes("Jozu") || nameEn.includes("Vista") || nameEn.includes("Teach") || nameEn.includes("Ozo") || nameEn.includes("Izo")) {
      crew = "Whitebeard Pirates";
    } else if (nameEn.includes("Kaido") || nameEn.includes("King") || nameEn.includes("Queen") || nameEn.includes("Jack") || nameEn.includes("Page One") || nameEn.includes("Ulti") || nameEn.includes("Who's-Who") || nameEn.includes("Black Maria") || nameEn.includes("Sasaki")) {
      crew = "Beasts Pirates";
    } else if (nameEn.includes("Linlin") || nameEn.includes("Katakuri") || nameEn.includes("Smoothie") || nameEn.includes("Cracker") || nameEn.includes("Perospero") || nameEn.includes("Oven") || nameEn.includes("Daifuku") || nameEn.includes("Pudding")) {
      crew = "Big Mom Pirates";
    } else if (nameEn.includes("Shanks") || nameEn.includes("Beckman") || nameEn.includes("Roo") || nameEn.includes("Yasopp")) {
      crew = "Red Hair Pirates";
    } else if (nameEn.includes("Buggy") || nameEn.includes("Mihawk") || nameEn.includes("Crocodile") || nameEn.includes("Alvida") || nameEn.includes("Galdino")) {
      crew = "Cross Guild";
    } else if (nameEn.includes("Law") || nameEn.includes("Bepo") || nameEn.includes("Shachi") || nameEn.includes("Penguin")) {
      crew = "Heart Pirates";
    } else if (nameEn.includes("Kid") || nameEn.includes("Killer") || nameEn.includes("Heat") || nameEn.includes("Wire")) {
      crew = "Kid Pirates";
    } else if (nameEn.includes("Teach") || nameEn.includes("Shiryu") || nameEn.includes("Burgess") || nameEn.includes("Augur") || nameEn.includes("Doc Q") || nameEn.includes("Lafitte") || nameEn.includes("Pizarro") || nameEn.includes("Devon") || nameEn.includes("Wolf") || nameEn.includes("Shot")) {
      crew = "Blackbeard Pirates";
    } else if (isMarineTarget) {
      crew = "Marines (Cross Guild Target)";
    }

    return {
      id: char.id,
      name: nameEn,
      japaneseName: nameJp,
      romajiName: nameRomaji,
      bountyAmount: maxBounty,
      formattedBounty: new Intl.NumberFormat().format(maxBounty) + " ฿",
      status: char.status || "Alive",
      imageUrl: char.image_url,
      bounties: (char.bounties || []).map(b => ({
        id: b.id,
        amount: b.amount,
        isActive: b.is_active ?? true
      })),
      tier,
      affiliation: crew,
      crewName: crew,
      isPirate: !isMarineTarget,
      isMarineTarget
    };
  });

  // Sort by highest bounty descending
  processedBounties.sort((a, b) => b.bountyAmount - a.bountyAmount);

  if (characters.length > 0) {
    const bountiesFileContent = `// Generated from onepieceapi.com Bounties & Characters API
import { PirateBountyItem } from "../types";

export const allPiratesBountiesData: PirateBountyItem[] = ${JSON.stringify(processedBounties, null, 2)};
`;
    fs.writeFileSync(path.join(process.cwd(), "src/data/allPiratesBounties.ts"), bountiesFileContent, "utf-8");
    console.log(`Successfully wrote ${processedBounties.length} pirate bounties to src/data/allPiratesBounties.ts!`);
  } else {
    console.log("Skipping write to src/data/allPiratesBounties.ts (offline mode).");
  }
}

main().catch(console.error);

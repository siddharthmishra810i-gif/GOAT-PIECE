import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  SlidersHorizontal,
  Flame,
  Shield,
  Award,
  Swords,
  ChevronRight,
  ExternalLink,
  Lock,
  Sparkles,
  MapPin,
  X,
} from "lucide-react";
import { charactersData } from "../data/characters";
import { allPiratesBountiesData } from "../data/allPiratesBounties";
import { Character } from "../types";
import { useSpoiler } from "../context/SpoilerContext";

interface CharacterDatabaseProps {
  onSelectLocation?: (locationId: string) => void;
  initialCharacterId?: string | null;
}

export const CharacterDatabase: React.FC<CharacterDatabaseProps> = ({
  onSelectLocation,
  initialCharacterId,
}) => {
  const { isSpoiled, userMangaChapter, showAllSpoilers } = useSpoiler();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAffiliation, setSelectedAffiliation] = useState("ALL");
  const [selectedHakiFilter, setSelectedHakiFilter] = useState("ALL");
  const [selectedFruitFilter, setSelectedFruitFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"bounty" | "name" | "firstChapter">("bounty");
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const pirateImgMap = useMemo(() => {
    const map = new Map<string, string>();
    allPiratesBountiesData.forEach((p) => {
      if (p.imageUrl) {
        map.set(p.name.toLowerCase().trim(), p.imageUrl);
        // Also map key parts like "luffy", "zoro", "roger", etc.
        const lastName = p.name.split(" ").slice(-1)[0]?.toLowerCase();
        if (lastName && !map.has(lastName)) {
          map.set(lastName, p.imageUrl);
        }
      }
    });
    return map;
  }, []);

  const getCharacterImage = (char: Character) => {
    if (char.imageUrl) return char.imageUrl;
    const direct = pirateImgMap.get(char.name.toLowerCase().trim());
    if (direct) return direct;
    const lastName = char.name.split(" ").slice(-1)[0]?.toLowerCase();
    if (lastName) return pirateImgMap.get(lastName);
    return undefined;
  };

  const [activeCharacter, setActiveCharacter] = useState<Character | null>(() => {
    if (initialCharacterId) {
      return charactersData.find((c) => c.id === initialCharacterId) || charactersData[0];
    }
    return charactersData[0];
  });

  const filteredCharacters = useMemo(() => {
    return charactersData
      .filter((char) => {
        // Search
        const matchesSearch =
          char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          char.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
          char.japaneseName.includes(searchQuery);

        if (!matchesSearch) return false;

        // Affiliation
        if (selectedAffiliation !== "ALL") {
          if (selectedAffiliation === "Straw Hats" && char.crewId !== "straw_hats") return false;
          if (selectedAffiliation === "Four Emperors" && !char.affiliation.includes("Four Emperors")) return false;
          if (selectedAffiliation === "Revolutionary Army" && !char.affiliation.includes("Revolutionary")) return false;
          if (selectedAffiliation === "Marines" && !char.affiliation.includes("Marines")) return false;
          if (selectedAffiliation === "World Government" && !char.affiliation.includes("World Government")) return false;
        }

        // Haki
        if (selectedHakiFilter === "Conqueror" && !char.haki?.some((h) => h.includes("Haoshoku") || h.includes("Conqueror"))) {
          return false;
        }

        // Fruit
        if (selectedFruitFilter === "Fruit User" && !char.devilFruitName) return false;
        if (selectedFruitFilter === "Non-Fruit" && char.devilFruitName) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "bounty") {
          return (b.bountyNumber || 0) - (a.bountyNumber || 0);
        }
        if (sortBy === "firstChapter") {
          return a.firstMangaChapter - b.firstMangaChapter;
        }
        return a.name.localeCompare(b.name);
      });
  }, [searchQuery, selectedAffiliation, selectedHakiFilter, selectedFruitFilter, sortBy]);

  return (
    <div className="relative space-y-6">
      {/* ========================================================================= */}
      {/* AGED WANTED POSTER PAPER TEXTURE (LOW-OPACITY HIGH-FREQUENCY NOISE GRAIN)  */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        id="wanted-poster-noise-texture"
        className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden -z-0 opacity-[0.055] mix-blend-screen select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='posterGrainNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23posterGrainNoise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "160px 160px",
        }}
      />
      {/* Faint parchment fiber wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-3xl -z-0 bg-gradient-to-br from-amber-600/[0.012] via-transparent to-amber-900/[0.018]"
      />

      <div className="relative z-10 space-y-6">
        {/* Header & Filter Controls */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#09152b] border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-xl font-bold text-amber-100">
              The Grand Line Character Archives
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {filteredCharacters.length} Recorded
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or alias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-mono mr-1">Faction:</span>
            {["ALL", "Straw Hats", "Four Emperors", "Marines", "Revolutionary Army", "World Government"].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedAffiliation(f)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedAffiliation === f
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedHakiFilter((prev) => (prev === "Conqueror" ? "ALL" : "Conqueror"))}
              className={`px-2.5 py-1 rounded-md border transition-all ${
                selectedHakiFilter === "Conqueror"
                  ? "bg-purple-950/70 border-purple-500 text-purple-200 font-bold"
                  : "bg-slate-800/80 border-slate-700 text-slate-300"
              }`}
            >
              👑 Conqueror's Haki Only
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
            >
              <option value="bounty">Sort by Bounty</option>
              <option value="firstChapter">Sort by First Chapter</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Character Roster + Detailed Dossier Modal/Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Character List Grid */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredCharacters.map((char) => {
            const isSelected = activeCharacter?.id === char.id;
            const isCharSpoiled = isSpoiled(char.firstMangaChapter, char.firstAnimeEpisode);
            const charImg = !isCharSpoiled ? getCharacterImage(char) : undefined;

            return (
              <div
                key={char.id}
                onClick={() => setActiveCharacter(char)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-950/30"
                    : "bg-[#09152b] border-slate-800/80 hover:border-slate-700 hover:bg-slate-850"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {charImg && !imgErrors[char.id] ? (
                    <img
                      src={charImg}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      onError={() => setImgErrors((prev) => ({ ...prev, [char.id]: true }))}
                      className="w-11 h-11 rounded-xl object-cover object-top border border-amber-500/40 shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-white shadow-md text-sm flex-shrink-0"
                      style={{ backgroundColor: char.avatarBgColor || "#0284c7" }}
                    >
                      {char.name[0]}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-display text-sm font-bold text-slate-100">
                        {isCharSpoiled ? "Undisclosed Identity" : char.name}
                      </h4>
                      {char.haki?.some((h) => h.includes("Haoshoku")) && (
                        <span title="Conqueror's Haki User" className="text-xs">
                          👑
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {isCharSpoiled ? "Unlocks later" : char.role || char.affiliation}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {char.bounty ? (
                    <div className="text-xs font-mono font-bold text-amber-400">
                      {char.bounty}
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 font-mono">Unbountied</div>
                  )}
                  <div className="text-[10px] text-slate-500 font-mono">
                    Debut: Ch. {char.firstMangaChapter}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Character Deep Dossier */}
        <div className="lg:col-span-7">
          {activeCharacter ? (
            <div className="rounded-2xl border border-amber-500/25 bg-[#09152a] p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Top Banner & Bounty Poster Style Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-start space-x-4">
                  {(() => {
                    const activeCharImg = getCharacterImage(activeCharacter);
                    return activeCharImg && !imgErrors[activeCharacter.id] ? (
                      <img
                        src={activeCharImg}
                        alt={activeCharacter.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setImgErrors((prev) => ({ ...prev, [activeCharacter.id]: true }))
                        }
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 border-amber-500/50 shadow-xl flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-display text-3xl font-bold text-white shadow-xl border-2 border-amber-500/30 flex-shrink-0"
                        style={{ backgroundColor: activeCharacter.avatarBgColor || "#0284c7" }}
                      >
                        {activeCharacter.name[0]}
                      </div>
                    );
                  })()}

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800">
                        {activeCharacter.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {activeCharacter.race}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
                      {activeCharacter.name}
                    </h2>
                    <div className="text-xs text-amber-400/90 font-mono">
                      {activeCharacter.japaneseName} · {activeCharacter.aliases.join(" • ")}
                    </div>
                  </div>
                </div>

                {/* Bounty Display Card */}
                {activeCharacter.bounty && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center shadow-inner sm:w-56">
                    <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                      DEAD OR ALIVE
                    </div>
                    <div className="font-display text-lg font-bold text-amber-200 mt-0.5">
                      {activeCharacter.bounty}
                    </div>
                  </div>
                )}
              </div>

              {/* Bio Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {activeCharacter.description}
              </p>

              {/* Combat & Fruit Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Devil Fruit */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Devil Fruit</span>
                  </div>
                  {activeCharacter.devilFruitName ? (
                    <div>
                      <div className="font-display text-sm font-bold text-slate-200">
                        {activeCharacter.devilFruitName}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Awakened capabilities and elemental dominion.
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic">
                      None. Pure Haki & Physical Mastery.
                    </div>
                  )}
                </div>

                {/* Haki Masteries */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-bold uppercase">
                    <Shield className="w-4 h-4" />
                    <span>Haki Mastery</span>
                  </div>
                  {activeCharacter.haki && activeCharacter.haki.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {activeCharacter.haki.map((h, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic">No confirmed Haki records.</div>
                  )}
                </div>
              </div>

              {/* Major Battles & Duels */}
              {activeCharacter.majorBattles && activeCharacter.majorBattles.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center space-x-1.5">
                    <Swords className="w-3.5 h-3.5" />
                    <span>Legendary Clashes & Duels</span>
                  </h4>
                  <div className="space-y-2">
                    {activeCharacter.majorBattles.map((battle, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-200">vs. {battle.opponent}</span>
                          <span className="text-slate-400 ml-2">({battle.location})</span>
                        </div>
                        <div className="text-right font-mono text-[11px] text-amber-400">
                          <span>Ch. {battle.chapter}</span> · <span className="text-slate-300">{battle.outcome}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical Significance */}
              {activeCharacter.historicalSignificance && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Historical Destiny & Void Century Connection
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeCharacter.historicalSignificance}
                  </p>
                </div>
              )}

              {/* Citations */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
                <div>
                  Sources: {activeCharacter.sources?.map((s) => s.citation).join(" · ") || "Official Manga"}
                </div>
                <div>First Chapter: {activeCharacter.firstMangaChapter}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 text-sm">
              Select a character to view complete genealogy, battles, and bounties.
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

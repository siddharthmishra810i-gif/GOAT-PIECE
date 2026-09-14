import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Search,
  Zap,
  ChevronRight,
  ExternalLink,
  LayoutGrid,
  Columns,
  Layers,
  Info,
  ShieldCheck,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { devilFruitsData } from "../data/devilFruits";
import { DevilFruit } from "../types";
import { useSpoiler } from "../context/SpoilerContext";

interface DevilFruitEncyclopediaViewProps {
  onSelectCharacter?: (characterId: string) => void;
}

export const DevilFruitEncyclopediaView: React.FC<DevilFruitEncyclopediaViewProps> = ({
  onSelectCharacter,
}) => {
  const { isSpoiled, userMangaChapter } = useSpoiler();
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFruitId, setActiveFruitId] = useState<string>(devilFruitsData[0]?.id || "");
  const [viewMode, setViewMode] = useState<"split" | "gallery">("split");
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const fruitTypes = [
    "ALL",
    "Paramecia",
    "Zoan",
    "Ancient Zoan",
    "Mythical Zoan",
    "Logia",
  ];

  const visibleFruits = useMemo(() => {
    return devilFruitsData.filter((f) => {
      if (isSpoiled(f.firstMangaChapter || 1)) return false;
      if (selectedType !== "ALL") {
        if (selectedType === "Ancient Zoan" && !f.type.toLowerCase().includes("ancient")) return false;
        if (selectedType === "Mythical Zoan" && !f.type.toLowerCase().includes("mythical")) return false;
        if (selectedType === "Zoan" && (f.type !== "Zoan" && !f.type.toLowerCase().includes("zoan"))) return false;
        if (selectedType === "Paramecia" && !f.type.toLowerCase().includes("paramecia")) return false;
        if (selectedType === "Logia" && !f.type.toLowerCase().includes("logia")) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName =
          (f.name && f.name.toLowerCase().includes(q)) ||
          (f.englishName && f.englishName.toLowerCase().includes(q)) ||
          (f.romajiName && f.romajiName.toLowerCase().includes(q)) ||
          (f.japaneseName && f.japaneseName.includes(q));
        const matchUser = f.currentUser && f.currentUser.toLowerCase().includes(q);
        const matchMeaning = f.meaning && f.meaning.toLowerCase().includes(q);
        const matchModel = f.model && f.model.toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchMeaning && !matchModel) return false;
      }
      return true;
    });
  }, [isSpoiled, selectedType, searchQuery]);

  const activeFruit =
    visibleFruits.find((f) => f.id === activeFruitId) || visibleFruits[0];

  const getTypeBadgeColor = (type: string) => {
    if (type.includes("Mythical"))
      return "bg-amber-500/20 text-amber-300 border-amber-500/50";
    if (type.includes("Ancient"))
      return "bg-orange-500/20 text-orange-300 border-orange-500/50";
    if (type.includes("Zoan"))
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
    if (type.includes("Logia"))
      return "bg-rose-500/20 text-rose-300 border-rose-500/50";
    return "bg-purple-500/20 text-purple-300 border-purple-500/50";
  };

  const getTypeGlowBg = (type: string) => {
    if (type.includes("Mythical")) return "from-amber-500/20 via-amber-900/10 to-transparent";
    if (type.includes("Ancient")) return "from-orange-500/20 via-orange-900/10 to-transparent";
    if (type.includes("Zoan")) return "from-emerald-500/20 via-emerald-900/10 to-transparent";
    if (type.includes("Logia")) return "from-rose-500/20 via-rose-900/10 to-transparent";
    return "from-purple-500/20 via-purple-900/10 to-transparent";
  };

  const handleImageError = (id: string) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header with stats and source attribution */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Encyclopedia of the Sea's Treasures · onepieceapi.com Sync</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Devil Fruit Encyclopedia (Akuma no Mi)
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Explore 110+ canonical Devil Fruits complete with authentic illustrations, classifications, wielders, awakened forms, and botanical notes.
          </p>
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search fruit, user, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1">
            <button
              onClick={() => setViewMode("split")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors flex items-center space-x-1 ${
                viewMode === "split"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Split Catalog & Deep Dossier"
            >
              <Columns className="w-4 h-4" />
              <span className="hidden sm:inline">Dossier</span>
            </button>
            <button
              onClick={() => setViewMode("gallery")}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors flex items-center space-x-1 ${
                viewMode === "gallery"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Visual Picture Grid Gallery"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classification Filters & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          <span className="text-slate-400 text-[11px] uppercase mr-1 flex-shrink-0">
            Classification:
          </span>
          {fruitTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedType === type
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105"
                  : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="text-slate-400 text-xs flex items-center space-x-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Showing {visibleFruits.length} Devil Fruits with Pictures</span>
        </div>
      </div>

      {/* VIEW MODE 1: Split Catalog + Deep Dossier */}
      {viewMode === "split" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Fruit Catalog with Thumbnails */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[800px] overflow-y-auto pr-1">
            {visibleFruits.map((fruit, idx) => {
              const isSelected = activeFruit?.id === fruit.id;
              const hasImgError = imageErrorMap[fruit.id];

              return (
                <div
                  key={`${fruit.id}-${idx}`}
                  onClick={() => setActiveFruitId(fruit.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-center space-x-3.5 ${
                    isSelected
                      ? "bg-[#122444] border-amber-500/70 shadow-lg shadow-amber-500/10 scale-[1.01]"
                      : "bg-[#09152b] border-slate-800/80 hover:border-slate-700 hover:bg-[#0c1b33]"
                  }`}
                >
                  {/* Fruit Picture Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-950/80 border border-slate-700/60 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden relative group">
                    {fruit.imageUrl && !hasImgError ? (
                      <img
                        src={fruit.imageUrl}
                        alt={fruit.name}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(fruit.id)}
                        className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center text-xl">
                        🌀
                      </div>
                    )}
                  </div>

                  {/* Fruit Text Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${getTypeBadgeColor(
                          fruit.type
                        )}`}
                      >
                        {fruit.type}
                      </span>
                      {fruit.isAwakened && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-mono border border-rose-500/40">
                          Awakened
                        </span>
                      )}
                    </div>

                    <h4 className="font-display text-sm font-bold text-slate-100 truncate mt-1">
                      {fruit.name}
                    </h4>

                    <div className="text-[11px] text-amber-400 font-mono truncate">
                      {fruit.englishName}
                    </div>

                    <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate">
                        User: <strong className="text-slate-200">{fruit.currentUser}</strong>
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      isSelected ? "text-amber-400 translate-x-1" : "text-slate-600"
                    }`}
                  />
                </div>
              );
            })}

            {visibleFruits.length === 0 && (
              <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
                No Devil Fruits match your filter under Chapter {userMangaChapter}.
              </div>
            )}
          </div>

          {/* Right Column: Active Fruit Deep Dossier */}
          <div className="lg:col-span-7">
            {activeFruit ? (
              <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden">
                {/* Background ambient glow according to fruit class */}
                <div
                  className={`absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br ${getTypeGlowBg(
                    activeFruit.type
                  )} blur-3xl pointer-events-none`}
                />

                {/* Header with High-Res Fruit Picture & Titles */}
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-800/80 pb-6">
                  {/* Big Fruit Picture with Display Pedestal */}
                  <div className="relative flex-shrink-0">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-b from-[#112345] to-[#081224] border-2 border-amber-500/40 p-3 flex items-center justify-center shadow-2xl shadow-amber-950/40 group relative overflow-hidden">
                      {/* Swirl watermark */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 to-transparent pointer-events-none" />

                      {activeFruit.imageUrl && !imageErrorMap[activeFruit.id] ? (
                        <img
                          src={activeFruit.imageUrl}
                          alt={activeFruit.name}
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(activeFruit.id)}
                          className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-5xl">🌀</span>
                          <span className="block text-[10px] text-amber-400 font-mono mt-2">
                            Swirl Pattern Vessel
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-center mt-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                        Official Illustration
                      </span>
                    </div>
                  </div>

                  {/* Fruit Identity & Nomenclature */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold ${getTypeBadgeColor(
                          activeFruit.type
                        )}`}
                      >
                        {activeFruit.type} Class
                      </span>
                      {activeFruit.model && (
                        <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono">
                          Model: {activeFruit.model}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">
                        Debut: Ch. {activeFruit.firstMangaChapter}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
                      {activeFruit.name}
                    </h3>

                    <div className="text-base text-amber-400 font-mono">
                      {activeFruit.englishName}
                    </div>

                    {activeFruit.japaneseName && (
                      <div className="text-sm text-slate-400 font-serif">
                        {activeFruit.japaneseName} {activeFruit.romajiName && `· ${activeFruit.romajiName}`}
                      </div>
                    )}

                    {activeFruit.meaning && (
                      <div className="text-xs text-slate-300 italic">
                        "{activeFruit.meaning}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Current & Previous Users */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                      Current Known Wielder
                    </span>
                    <div className="text-slate-100 font-bold text-base">
                      {activeFruit.currentUser}
                    </div>
                    {activeFruit.currentUserAffiliation && (
                      <div className="text-slate-400 text-xs">
                        {activeFruit.currentUserAffiliation}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                      Previous Known Wielder
                    </span>
                    <div className="text-slate-200 font-medium text-sm">
                      {activeFruit.previousUser || "None recorded in modern records"}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Transmigrates into nearest fruit upon death
                    </div>
                  </div>
                </div>

                {/* Description & Mechanics */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                    Ability Mechanics & Manifestation
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                    {activeFruit.description}
                  </p>
                </div>

                {/* Awakening State (Kakusei) */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    activeFruit.isAwakened
                      ? "bg-rose-950/30 border-rose-500/50 text-rose-200"
                      : "bg-slate-900/50 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider">
                      <Zap className="w-4 h-4 text-rose-400" />
                      <span>Awakening State (Kakusei):</span>
                      <span className={activeFruit.isAwakened ? "text-rose-300 font-bold" : "text-slate-400"}>
                        {activeFruit.isAwakened ? "CONFIRMED AWAKENED" : "Unawakened / Unknown"}
                      </span>
                    </div>
                    {activeFruit.isAwakened && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono">
                        Stage 2 Mastery
                      </span>
                    )}
                  </div>
                  {activeFruit.awakeningDescription && (
                    <p className="text-xs leading-relaxed font-sans text-slate-200 pt-1">
                      {activeFruit.awakeningDescription}
                    </p>
                  )}
                </div>

                {/* Canonical Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {activeFruit.strengths && activeFruit.strengths.length > 0 && (
                    <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-mono font-bold text-[11px] uppercase">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Canonical Strengths</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {activeFruit.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-emerald-400">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeFruit.weaknesses && activeFruit.weaknesses.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-1.5 text-amber-400 font-mono font-bold text-[11px] uppercase">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Natural Limitations & Weaknesses</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {activeFruit.weaknesses.map((w, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-amber-400">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Dr. Vegapunk Scientific Notes */}
                {activeFruit.scientificNotes && (
                  <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 text-xs space-y-1.5">
                    <div className="flex items-center space-x-2 text-sky-400 font-mono font-bold text-[11px] uppercase">
                      <Info className="w-4 h-4" />
                      <span>Egghead Laboratory Archive: Dr. Vegapunk Hypothesis</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{activeFruit.scientificNotes}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
                Select a Devil Fruit from the catalog to inspect its classification, pictures, and abilities.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Visual Picture Grid Gallery */}
      {viewMode === "gallery" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visibleFruits.map((fruit, idx) => {
            const isSelected = activeFruit?.id === fruit.id;
            const hasImgError = imageErrorMap[fruit.id];

            return (
              <div
                key={`${fruit.id}-${idx}`}
                onClick={() => {
                  setActiveFruitId(fruit.id);
                  setViewMode("split");
                }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col items-center text-center group ${
                  isSelected
                    ? "bg-[#122444] border-amber-500/80 shadow-xl shadow-amber-500/10 scale-105"
                    : "bg-[#09152b] border-slate-800 hover:border-amber-500/40 hover:bg-[#0c1b33] hover:scale-102"
                }`}
              >
                {/* Fruit Picture */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-950/70 border border-slate-800 p-2 flex items-center justify-center overflow-hidden mb-2 relative">
                  {fruit.imageUrl && !hasImgError ? (
                    <img
                      src={fruit.imageUrl}
                      alt={fruit.name}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(fruit.id)}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-3xl">🌀</div>
                  )}

                  {fruit.isAwakened && (
                    <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500/50 text-[8px] font-mono font-bold">
                      Awakened
                    </div>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 rounded border text-[9px] font-bold font-mono mb-1 ${getTypeBadgeColor(
                    fruit.type
                  )}`}
                >
                  {fruit.type}
                </span>

                <h4 className="font-display text-xs font-bold text-slate-100 line-clamp-1 w-full group-hover:text-amber-300 transition-colors">
                  {fruit.name}
                </h4>

                <div className="text-[10px] text-amber-400 font-mono line-clamp-1 w-full">
                  {fruit.englishName}
                </div>

                <div className="text-[10px] text-slate-400 mt-1.5 w-full truncate">
                  {fruit.currentUser}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

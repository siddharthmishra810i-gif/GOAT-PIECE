import React from "react";
import { Compass, Shield, Eye, EyeOff, BookOpen, MapPin, Users, Swords, HelpCircle, CheckCircle2, Lock } from "lucide-react";
import { useSpoiler, VOYAGE_PRESETS } from "../context/SpoilerContext";
import { charactersData } from "../data/characters";
import { locationsData } from "../data/locations";
import { mysteriesData } from "../data/mysteries";
import { battlesData } from "../data/battles";

interface PersonalProgressViewProps {
  onNavigate: (tab: string) => void;
}

export const PersonalProgressView: React.FC<PersonalProgressViewProps> = ({ onNavigate }) => {
  const {
    userMangaChapter,
    userAnimeEpisode,
    setUserMangaChapter,
    applyPreset,
    isSpoiled,
    showAllSpoilers,
    setShowAllSpoilers,
  } = useSpoiler();

  // Calculate knowledge statistics
  const knownCharacters = charactersData.filter((c) => !isSpoiled(c.firstMangaChapter || 1));
  const hiddenCharactersCount = charactersData.length - knownCharacters.length;

  const knownLocations = locationsData.filter((l) => !isSpoiled(l.firstMangaChapter || 1));
  const hiddenLocationsCount = locationsData.length - knownLocations.length;

  const knownMysteries = mysteriesData.filter((m) => !isSpoiled(m.firstIntroducedChapter || 1));
  const hiddenMysteriesCount = mysteriesData.length - knownMysteries.length;

  const knownBattles = battlesData.filter((b) => !isSpoiled(b.chapter));
  const hiddenBattlesCount = battlesData.length - knownBattles.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>Grand Line Cartographer's Logbook</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            What Do I Know? (Personal Lore Progress)
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Your personalized knowledge horizon based on your current reading and viewing journey. All encyclopedia entries outside your horizon remain classified to preserve the thrill of discovery.
          </p>
        </div>

        {/* Global Reveal Toggle */}
        <button
          onClick={() => setShowAllSpoilers(!showAllSpoilers)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-md ${
            showAllSpoilers
              ? "bg-rose-950/60 border-rose-500/50 text-rose-300"
              : "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
          }`}
        >
          {showAllSpoilers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showAllSpoilers ? "Classify Spoilers" : "Unveil All Spoilers (1192+)"}</span>
        </button>
      </div>

      {/* Progress Presets */}
      <div className="p-5 rounded-2xl bg-[#09152b] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase text-amber-400 font-bold">Fast Story Milestone Anchors:</span>
          <span>Current Chapter: <strong className="text-white font-bold">{userMangaChapter}</strong></span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {VOYAGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                userMangaChapter === preset.mangaChapter
                  ? "bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-105"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="text-[11px] font-bold truncate">{preset.label}</div>
              <div className="text-[9px] font-mono opacity-75 mt-0.5">Ch. {preset.mangaChapter}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Characters */}
        <div className="p-5 rounded-xl bg-[#09152b] border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Characters Encountered</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="font-display text-3xl font-bold text-slate-100">
            {knownCharacters.length}
            <span className="text-xs text-slate-500 font-mono font-normal ml-2">/ {charactersData.length}</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
            <Lock className="w-3 h-3 text-amber-500" />
            <span>{hiddenCharactersCount} classified figures ahead</span>
          </div>
        </div>

        {/* Islands Discovered */}
        <div className="p-5 rounded-xl bg-[#09152b] border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Islands Navigated</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display text-3xl font-bold text-slate-100">
            {knownLocations.length}
            <span className="text-xs text-slate-500 font-mono font-normal ml-2">/ {locationsData.length}</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
            <Lock className="w-3 h-3 text-amber-500" />
            <span>{hiddenLocationsCount} uncharted territories</span>
          </div>
        </div>

        {/* Mysteries */}
        <div className="p-5 rounded-xl bg-[#09152b] border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Mysteries Encountered</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-display text-3xl font-bold text-slate-100">
            {knownMysteries.length}
            <span className="text-xs text-slate-500 font-mono font-normal ml-2">/ {mysteriesData.length}</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
            <Lock className="w-3 h-3 text-amber-500" />
            <span>{hiddenMysteriesCount} future riddles</span>
          </div>
        </div>

        {/* Battles */}
        <div className="p-5 rounded-xl bg-[#09152b] border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Epic Duels Witnessed</span>
            <Swords className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-display text-3xl font-bold text-slate-100">
            {knownBattles.length}
            <span className="text-xs text-slate-500 font-mono font-normal ml-2">/ {battlesData.length}</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
            <Lock className="w-3 h-3 text-amber-500" />
            <span>{hiddenBattlesCount} upcoming clashes</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad to Explore with Current Progress */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#101e38] to-[#0a1526] border border-amber-500/30 space-y-4">
        <h3 className="font-display text-xl font-bold text-slate-100">
          Continue Exploring with Your Progress (Chapter {userMangaChapter})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <button
            onClick={() => onNavigate("map")}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-amber-500/25 text-left space-y-1 transition-all group"
          >
            <div className="font-bold text-amber-300 group-hover:text-amber-200 flex items-center justify-between">
              <span>Explore Interactive Map</span>
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-slate-400 text-[11px] font-sans">
              Only islands visited by Chapter {userMangaChapter} will have unredacted records.
            </p>
          </button>

          <button
            onClick={() => onNavigate("battles")}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-amber-500/25 text-left space-y-1 transition-all group"
          >
            <div className="font-bold text-rose-300 group-hover:text-rose-200 flex items-center justify-between">
              <span>Inspect Battle Chronicles</span>
              <Swords className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-slate-400 text-[11px] font-sans">
              Browse the outcomes and techniques of clashes up to Chapter {userMangaChapter}.
            </p>
          </button>

          <button
            onClick={() => onNavigate("chapterReveals")}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-amber-500/25 text-left space-y-1 transition-all group"
          >
            <div className="font-bold text-emerald-300 group-hover:text-emerald-200 flex items-center justify-between">
              <span>Chapter Revelations Engine</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-slate-400 text-[11px] font-sans">
              Review exactly what was uncovered in your latest chapters.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

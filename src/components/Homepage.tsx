import React from "react";
import {
  Compass,
  Map,
  BookOpen,
  Sparkles,
  Share2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Flame,
  Globe2,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { useSpoiler, VOYAGE_PRESETS } from "../context/SpoilerContext";
import { mysteriesData } from "../data/mysteries";
import { theoriesData } from "../data/theories";
import { foreshadowingData } from "../data/foreshadowing";

interface HomepageProps {
  onNavigate: (tab: string) => void;
  onSelectMystery?: (id: string) => void;
  onSelectTheory?: (id: string) => void;
}

export const Homepage: React.FC<HomepageProps> = ({
  onNavigate,
  onSelectMystery,
  onSelectTheory,
}) => {
  const {
    userMangaChapter,
    userAnimeEpisode,
    voyageMode,
    setUserMangaChapter,
    setUserAnimeEpisode,
    applyPreset,
    showAllSpoilers,
    setShowAllSpoilers,
  } = useSpoiler();

  const totalChapters = 1130;
  const progressPercent = Math.min(100, Math.round((userMangaChapter / totalChapters) * 100));

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#0a1b38] via-[#09152b] to-[#060e1d] p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Fan Compliance Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Fan-Made Interactive Research Archive · Non-Commercial</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 leading-tight">
            Navigate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">Grand Line</span> with Unmatched Precision
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
            The definitive interactive encyclopedia, geographical world map, historical timeline, character genealogy, and spoiler-protected knowledge graph spanning 1100+ chapters of Eiichiro Oda's epic universe.
          </p>

          {/* Quick Action Grid */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("map")}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-900/30 transition-all hover:scale-105 active:scale-95"
            >
              <Map className="w-4 h-4" />
              <span>Explore World Map</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate("characters")}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-medium text-sm transition-all hover:border-amber-500/40"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Character Database</span>
            </button>

            <button
              onClick={() => onNavigate("graph")}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-medium text-sm transition-all hover:border-amber-500/40"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span>Knowledge Graph</span>
            </button>

            <button
              onClick={() => onNavigate("mysteries")}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-medium text-sm transition-all hover:border-amber-500/40"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Unravel Mysteries</span>
            </button>
          </div>
        </div>
      </section>

      {/* "Where Are You in the Voyage?" Spoiler Tracker */}
      <section className="rounded-2xl border border-amber-500/25 bg-[#09152a] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-100">
                Where are you in the voyage?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select your chapter or episode. The entire application will automatically shield future plot points, gear awakenings, and lore revelations beyond your checkpoint.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAllSpoilers(!showAllSpoilers)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                showAllSpoilers
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 hover:bg-rose-900"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{showAllSpoilers ? "Spoilers: Fully Visible" : "Shield Active: Hiding Spoilers"}</span>
            </button>
          </div>
        </div>

        {/* Dual Range Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manga Chapter Slider */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
                Manga Chapter Checkpoint
              </span>
              <span className="font-display text-lg font-bold text-amber-200">
                Chapter {userMangaChapter} <span className="text-xs text-slate-500 font-normal">/ {totalChapters}</span>
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={1130}
              value={userMangaChapter}
              onChange={(e) => setUserMangaChapter(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Ch. 1 Romance Dawn</span>
              <span>Ch. 580 Marineford</span>
              <span>Ch. 1044 Nika</span>
              <span>Ch. 1130 Elbaf</span>
            </div>
          </div>

          {/* Anime Episode Slider */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 font-mono">
                Anime Episode Checkpoint
              </span>
              <span className="font-display text-lg font-bold text-sky-200">
                Episode {userAnimeEpisode} <span className="text-xs text-slate-500 font-normal">/ 1125</span>
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={1125}
              value={userAnimeEpisode}
              onChange={(e) => setUserAnimeEpisode(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Ep. 1 East Blue</span>
              <span>Ep. 490 Marineford</span>
              <span>Ep. 1071 Gear 5</span>
              <span>Ep. 1125 Egghead</span>
            </div>
          </div>
        </div>

        {/* Voyage Gauge */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <span>Exploration Progress: {progressPercent}% of the Grand Line Charted</span>
            <span>{userMangaChapter >= 1100 ? "Cruising the Frontiers of Elbaf" : userMangaChapter >= 1000 ? "Storming Onigashima" : userMangaChapter >= 500 ? "Surviving the New World Gate" : "Sailing Paradise"}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Presets Bar */}
        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Quick Saga Jump Points:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {VOYAGE_PRESETS.map((p) => {
              const isSelected = userMangaChapter === p.mangaChapter;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className={`p-2 rounded-lg text-left border transition-all ${
                    isSelected
                      ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-950"
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <div className="text-xs font-bold truncate">{p.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Ch. {p.mangaChapter}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Mysteries Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
              The Great Mysteries of the Void Century
            </h2>
          </div>
          <button
            onClick={() => onNavigate("mysteries")}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View All Mysteries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mysteriesData.slice(0, 3).map((mystery) => (
            <div
              key={mystery.id}
              onClick={() => {
                onNavigate("mysteries");
                if (onSelectMystery) onSelectMystery(mystery.id);
              }}
              className="p-5 rounded-xl bg-[#0a162b] border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-purple-950/70 border border-purple-800/60 text-purple-300">
                  {mystery.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Introduced Ch. {mystery.firstIntroducedChapter}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                {mystery.title}
              </h3>
              <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {mystery.question}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{mystery.knownFacts.length} verified facts</span>
                <span className="text-amber-400 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Investigate →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Foreshadowing Masterstrokes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
              Oda's Foreshadowing Masterstrokes
            </h2>
          </div>
          <button
            onClick={() => onNavigate("foreshadowing")}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View All Payoffs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foreshadowingData.slice(0, 2).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate("foreshadowing")}
              className="p-5 rounded-xl bg-[#0a162b] border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between text-xs text-amber-400/90 font-mono mb-2">
                <span>{item.yearsBetween}</span>
                <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/50 text-amber-300">
                  {item.chapterGap} Chapters Apart
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-amber-200">
                {item.topic}
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <div className="font-mono text-[10px] text-slate-400">Setup: Ch. {item.setupChapter}</div>
                  <p className="text-slate-300 line-clamp-2 mt-1">{item.setupContext}</p>
                </div>
                <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                  <div className="font-mono text-[10px] text-amber-400">Payoff: Ch. {item.payoffChapter}</div>
                  <p className="text-slate-300 line-clamp-2 mt-1">{item.payoffContext}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Theories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
              Community Theories & Archeological Debates
            </h2>
          </div>
          <button
            onClick={() => onNavigate("theories")}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>Browse All Theories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {theoriesData.slice(0, 3).map((theory) => (
            <div
              key={theory.id}
              onClick={() => {
                onNavigate("theories");
                if (onSelectTheory) onSelectTheory(theory.id);
              }}
              className="p-5 rounded-xl bg-[#0a162b] border border-slate-800 hover:border-yellow-500/40 transition-all cursor-pointer shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    theory.probability === "Strongly Supported"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : theory.probability === "Plausible"
                      ? "bg-amber-950 text-amber-300 border border-amber-800"
                      : "bg-slate-800 text-slate-300"
                  }`}>
                    {theory.probability}
                  </span>
                  <span className="text-xs font-mono text-amber-400">★ {theory.votes} votes</span>
                </div>
                <h3 className="font-display text-base font-bold text-slate-200 hover:text-amber-300 transition-colors">
                  {theory.title}
                </h3>
                <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {theory.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>By {theory.author}</span>
                <span className="text-amber-400 font-medium">Read Evidence →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

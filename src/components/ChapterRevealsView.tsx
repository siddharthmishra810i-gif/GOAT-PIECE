import React, { useState } from "react";
import { BookOpen, Search, Sparkles, HelpCircle, Users, MapPin, Lightbulb, AlertTriangle, ArrowRight } from "lucide-react";
import { getChapterBreakdown, landmarkBreakdowns } from "../data/chapterBreakdowns";
import { useSpoiler } from "../context/SpoilerContext";

interface ChapterRevealsViewProps {
  onSelectCharacter?: (name: string) => void;
  onSelectLocation?: (locationId: string) => void;
}

export const ChapterRevealsView: React.FC<ChapterRevealsViewProps> = ({
  onSelectCharacter,
  onSelectLocation,
}) => {
  const { userMangaChapter, isSpoiled } = useSpoiler();
  const [chapterInput, setChapterInput] = useState<number>(1044);
  const [activeChapter, setActiveChapter] = useState<number>(1044);
  const [overrideSpoilerWarning, setOverrideSpoilerWarning] = useState<boolean>(false);

  const breakdown = getChapterBreakdown(activeChapter);
  const isChapterSpoiled = isSpoiled(activeChapter) && !overrideSpoilerWarning;

  const landmarkList = [1, 100, 217, 398, 500, 1044, 1115];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (chapterInput > 0) {
      setActiveChapter(chapterInput);
      setOverrideSpoilerWarning(false);
    }
  };

  const handleSelectLandmark = (num: number) => {
    setChapterInput(num);
    setActiveChapter(num);
    setOverrideSpoilerWarning(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Chapter-by-Chapter Epiphany Engine</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            What Was Revealed in this Chapter?
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Inspect any manga release across One Piece history to uncover new character introductions, world lore revelations, answered mysteries, and foreshadowing seeds.
          </p>
        </div>

        {/* Chapter Input Form */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">Ch.</span>
            <input
              type="number"
              min="1"
              max="1200"
              value={chapterInput}
              onChange={(e) => setChapterInput(parseInt(e.target.value) || 1)}
              className="w-28 pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 font-bold"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-amber-500/20"
          >
            Inspect
          </button>
        </form>
      </div>

      {/* Landmark Quick Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Landmarks:</span>
        {landmarkList.map((num) => (
          <button
            key={num}
            onClick={() => handleSelectLandmark(num)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-mono text-xs transition-all ${
              activeChapter === num
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105"
                : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            Ch. {num}
          </button>
        ))}
      </div>

      {/* Spoiler Guard Banner */}
      {isChapterSpoiled ? (
        <div className="p-8 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-rose-900/50 border border-rose-500 flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-rose-200">
              Future Chapter Warning (Chapter {activeChapter})
            </h3>
            <p className="text-xs text-rose-300/80 mt-1 max-w-md mx-auto">
              Your reading progress is currently set to Chapter {userMangaChapter}. Inspecting Chapter {activeChapter} contains major plot twists and unrevealed world lore.
            </p>
          </div>
          <button
            onClick={() => setOverrideSpoilerWarning(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono transition-all shadow-lg shadow-rose-600/30"
          >
            Unveil Chapter {activeChapter} Revelations Anyway
          </button>
        </div>
      ) : (
        /* Breakdown Dossier */
        <div className="space-y-6">
          {/* Chapter Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#122444] to-[#0a162b] border border-amber-500/30 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-mono font-bold text-xs">
                  Chapter {breakdown.chapterNumber}
                </span>
                <span className="text-xs text-amber-300/80 font-mono">
                  {breakdown.arcName} ({breakdown.releaseYear})
                </span>
              </div>
              {breakdown.japaneseTitle && (
                <span className="text-xs text-slate-400 font-mono">
                  {breakdown.japaneseTitle}
                </span>
              )}
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              {breakdown.title}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
              {breakdown.summary}
            </p>
          </div>

          {/* Core Revelations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Major Revelations & Information */}
            <div className="p-5 rounded-xl bg-[#09152b] border border-amber-500/20 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>New World Knowledge ({breakdown.newInformation.length})</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {breakdown.newInformation.map((item, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Questions Answered */}
            <div className="p-5 rounded-xl bg-[#09152b] border border-emerald-500/20 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono text-xs uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>Questions Answered ({breakdown.questionsAnswered.length})</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {breakdown.questionsAnswered.map((item, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. New Mysteries Raised */}
            <div className="p-5 rounded-xl bg-[#09152b] border border-purple-500/20 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-purple-400 font-bold font-mono text-xs uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>New Mysteries Raised ({breakdown.newMysteries.length})</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {breakdown.newMysteries.map((item, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/30 text-purple-200 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. New Characters Introduced */}
            <div className="p-5 rounded-xl bg-[#09152b] border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-sky-400 font-bold font-mono text-xs uppercase">
                <Users className="w-4 h-4" />
                <span>First Character Appearances</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {breakdown.newCharacters.map((c, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. New Locations Discovered */}
            <div className="p-5 rounded-xl bg-[#09152b] border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono text-xs uppercase">
                <MapPin className="w-4 h-4" />
                <span>Locations Featured / Unveiled</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {breakdown.newLocations.map((loc, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300 text-xs font-medium">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Foreshadowing Seeds Laid */}
            <div className="p-5 rounded-xl bg-[#09152b] border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-amber-400 font-bold font-mono text-xs uppercase">
                <Lightbulb className="w-4 h-4" />
                <span>Foreshadowing Seeds Placed</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-200/90 font-mono">
                {breakdown.foreshadowingIntroduced.map((fs, idx) => (
                  <li key={idx} className="p-2 rounded bg-amber-500/10 border border-amber-500/25">
                    🌱 {fs}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

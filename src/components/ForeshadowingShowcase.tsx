import React from "react";
import {
  Lightbulb,
  Clock,
  Sparkles,
  ArrowRight,
  Quote,
  Flame,
  BookOpen,
} from "lucide-react";
import { foreshadowingData } from "../data/foreshadowing";

export const ForeshadowingShowcase: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/20 shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h2 className="font-display text-xl font-bold text-amber-100">
            Eiichiro Oda's Legendary Foreshadowing & Narrative Payoffs
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          One Piece is celebrated worldwide for narrative setups spanning decades. Explore Oda's most meticulously crafted story seeds, from Sun God Nika's campfire silhouette to the sinking of the world.
        </p>
      </div>

      {/* Foreshadowing Cards Grid */}
      <div className="space-y-6">
        {foreshadowingData.map((item) => (
          <div
            key={item.id}
            className="p-6 sm:p-8 rounded-2xl bg-[#09152a] border border-amber-500/25 shadow-2xl space-y-6"
          >
            {/* Header / Topic & Metric */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  Masterclass Narrative Thread
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-100 mt-0.5">
                  {item.topic}
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <div className="px-3 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                  {item.chapterGap} Chapters Apart
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs">
                  {item.yearsBetween}
                </div>
              </div>
            </div>

            {/* Side-by-Side: Setup vs Payoff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Setup Column */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                    The Setup
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    Chapter {item.setupChapter} · Episode {item.setupEpisode}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                  {item.setupContext}
                </p>
              </div>

              {/* Payoff Column */}
              <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    The Payoff
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300">
                    Chapter {item.payoffChapter} · Episode {item.payoffEpisode}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed pt-1">
                  {item.payoffContext}
                </p>
              </div>
            </div>

            {/* Famous Dialogue Quote */}
            {item.quote && (
              <div className="p-4 rounded-xl bg-slate-900/50 border-l-4 border-amber-400 text-xs sm:text-sm italic text-slate-200 flex items-center space-x-3">
                <Quote className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>"{item.quote}"</span>
              </div>
            )}

            {/* Significance & Key Characters */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
              <div className="max-w-2xl leading-relaxed">
                <span className="font-bold text-slate-300 font-mono">Literary Impact: </span>
                <span>{item.significance}</span>
              </div>
              <div className="font-mono text-[11px] text-amber-400 whitespace-nowrap">
                Figures: {item.characters.join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

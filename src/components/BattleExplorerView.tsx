import React, { useState, useMemo } from "react";
import { Swords, Trophy, Sparkles, Shield, MapPin, BookOpen, Search, Zap, Flame } from "lucide-react";
import { battlesData } from "../data/battles";
import { Battle } from "../types";
import { useSpoiler } from "../context/SpoilerContext";

interface BattleExplorerViewProps {
  onSelectCharacter?: (name: string) => void;
  onSelectLocation?: (locationId: string) => void;
}

export const BattleExplorerView: React.FC<BattleExplorerViewProps> = ({
  onSelectCharacter,
  onSelectLocation,
}) => {
  const { isSpoiled, userMangaChapter } = useSpoiler();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArc, setSelectedArc] = useState<string>("ALL");
  const [activeBattleId, setActiveBattleId] = useState<string>(battlesData[0].id);

  const availableArcs = useMemo(() => {
    const arcs = new Set(battlesData.map((b) => b.arc));
    return ["ALL", ...Array.from(arcs)];
  }, []);

  // Filter based on spoilers and search
  const visibleBattles = useMemo(() => {
    return battlesData.filter((b) => {
      if (isSpoiled(b.chapter)) return false;
      if (selectedArc !== "ALL" && b.arc !== selectedArc) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = b.name.toLowerCase().includes(q);
        const matchCombatants =
          b.combatantsSideA.some((c) => c.toLowerCase().includes(q)) ||
          b.combatantsSideB.some((c) => c.toLowerCase().includes(q));
        const matchTechniques = b.majorTechniques.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchCombatants && !matchTechniques) return false;
      }
      return true;
    });
  }, [isSpoiled, selectedArc, searchQuery]);

  const activeBattle = visibleBattles.find((b) => b.id === activeBattleId) || visibleBattles[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Swords className="w-4 h-4" />
            <span>Grand Line Combat & Duels Chronicle</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Battle Database & Tactical Records
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Examine the pivotal clashes that shaped the balance of the seas, including combatants, Devil Fruit interactions, advanced Haki, and geopolitical consequences.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search battles, fighters, techniques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Arc Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Arc:</span>
        {availableArcs.map((arc) => (
          <button
            key={arc}
            onClick={() => setSelectedArc(arc)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedArc === arc
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {arc}
          </button>
        ))}
      </div>

      {/* Main Grid: Battle List + Detailed Battle Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Battle Selection Cards */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {visibleBattles.map((b) => {
            const isSelected = activeBattle?.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => setActiveBattleId(b.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-[#122340] border-amber-500/60 shadow-lg shadow-amber-500/10 scale-[1.01]"
                    : "bg-[#09152b] border-slate-800 hover:border-slate-700 hover:bg-[#0c1b33]"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-amber-400 font-bold uppercase">{b.arc} Arc</span>
                  <span>Ch. {b.chapter} {b.episode ? `· Ep. ${b.episode}` : ""}</span>
                </div>

                <h4 className="font-display text-sm sm:text-base font-bold text-slate-100 mt-1">
                  {b.name}
                </h4>

                <div className="flex items-center space-x-2 mt-2 text-xs">
                  <span className="text-emerald-400 font-medium flex items-center space-x-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{b.winner}</span>
                  </span>
                </div>

                <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {b.summary}
                </p>
              </div>
            );
          })}

          {visibleBattles.length === 0 && (
            <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
              No battles match your search or current spoiler chapter ({userMangaChapter}).
            </div>
          )}
        </div>

        {/* Right: Active Battle Deep-Dive Dossier */}
        <div className="lg:col-span-7">
          {activeBattle ? (
            <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/30 shadow-2xl space-y-6">
              {/* Battle Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase">
                    {activeBattle.arc} Saga · Chapter {activeBattle.chapter}
                  </span>
                  {onSelectLocation && (
                    <button
                      onClick={() => onSelectLocation(activeBattle.locationId)}
                      className="text-xs text-slate-300 hover:text-amber-300 flex items-center space-x-1 font-mono transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activeBattle.locationName}</span>
                    </button>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-slate-100 mt-2">
                  {activeBattle.name}
                </h3>
              </div>

              {/* Combatants VS Card */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="sm:col-span-5 text-center sm:text-left space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Side A</span>
                  {activeBattle.combatantsSideA.map((c, idx) => (
                    <div key={idx} className="text-amber-200 font-bold text-sm">{c}</div>
                  ))}
                </div>

                <div className="sm:col-span-1 text-center font-display text-amber-400 text-lg font-bold">
                  VS
                </div>

                <div className="sm:col-span-5 text-center sm:text-right space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Side B</span>
                  {activeBattle.combatantsSideB.map((c, idx) => (
                    <div key={idx} className="text-rose-200 font-bold text-sm">{c}</div>
                  ))}
                </div>
              </div>

              {/* Victor & Outcome */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                  <Trophy className="w-4 h-4" />
                  <span>Decisive Victor: {activeBattle.winner}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeBattle.outcome}
                </p>
              </div>

              {/* Tactical Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Major Techniques */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-amber-400 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Signature Techniques:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeBattle.majorTechniques.map((t, idx) => (
                      <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-slate-200 text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Haki & Devil Fruits */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-amber-400 flex items-center space-x-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Abilities & Haki Clashes:</span>
                  </span>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Devil Fruits:</span>
                      <span className="text-slate-200">{activeBattle.devilFruitsUsed.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Haki Disciplines:</span>
                      <span className="text-purple-300 font-mono">{activeBattle.hakiUsed.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Narrative Summary */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Tactical Summary
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeBattle.summary}
                </p>
              </div>

              {/* Geopolitical Consequences */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <span className="text-[11px] font-mono uppercase font-bold text-amber-400 block">
                  Geopolitical Consequences & Historical Impact
                </span>
                <p className="text-xs text-amber-200 leading-relaxed">
                  {activeBattle.consequences}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
              Select a battle from the combat list to inspect its tactical breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

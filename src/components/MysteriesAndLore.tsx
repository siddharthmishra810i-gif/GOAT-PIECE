import React, { useState, useEffect } from "react";
import {
  BookOpen,
  HelpCircle,
  Sparkles,
  Shield,
  Layers,
  Award,
  KeyRound,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import { mysteriesData } from "../data/mysteries";
import { racesData, poneglyphsData, sbsTriviaData } from "../data/lore";
import { useSpoiler } from "../context/SpoilerContext";

interface MysteriesAndLoreProps {
  initialMysteryId?: string | null;
}

// Ancient Poneglyph geometric glyph definitions with SVG path instructions
const PONEGLYPH_GLYPHS = [
  {
    id: "g1",
    top: 8,
    left: 12,
    size: 42,
    rotation: 0,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <rect x="6" y="6" width="28" height="28" />
        <rect x="12" y="12" width="16" height="16" strokeDasharray="3 2" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
        <line x1="6" y1="20" x2="12" y2="20" />
        <line x1="28" y1="20" x2="34" y2="20" />
        <line x1="20" y1="6" x2="20" y2="12" />
        <line x1="20" y1="28" x2="20" y2="34" />
      </svg>
    ),
  },
  {
    id: "g2",
    top: 14,
    left: 82,
    size: 38,
    rotation: 45,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <polygon points="20,4 36,20 20,36 4,20" />
        <polygon points="20,10 30,20 20,30 10,20" />
        <line x1="4" y1="20" x2="36" y2="20" />
      </svg>
    ),
  },
  {
    id: "g3",
    top: 28,
    left: 4,
    size: 44,
    rotation: -10,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <rect x="8" y="8" width="24" height="24" />
        <line x1="8" y1="8" x2="32" y2="32" />
        <line x1="32" y1="8" x2="8" y2="32" />
        <rect x="14" y="14" width="12" height="12" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    id: "g4",
    top: 36,
    left: 92,
    size: 46,
    rotation: 15,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <circle cx="20" cy="20" r="15" />
        <circle cx="20" cy="20" r="8" strokeDasharray="4 2" />
        <path d="M 20 5 L 20 35 M 5 20 L 35 20" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "g5",
    top: 52,
    left: 18,
    size: 40,
    rotation: 0,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        {/* Stepped ziggurat glyph */}
        <polyline points="6,34 6,24 12,24 12,14 20,14 20,6 28,14 34,14 34,24 40,24" />
        <line x1="6" y1="34" x2="34" y2="34" />
        <rect x="16" y="22" width="8" height="12" fill="currentColor" fillOpacity="0.25" />
      </svg>
    ),
  },
  {
    id: "g6",
    top: 60,
    left: 84,
    size: 42,
    rotation: -25,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <rect x="4" y="10" width="32" height="20" />
        <line x1="14" y1="10" x2="14" y2="30" />
        <line x1="26" y1="10" x2="26" y2="30" />
        <circle cx="9" cy="20" r="2.5" fill="currentColor" />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" />
        <circle cx="31" cy="20" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "g7",
    top: 74,
    left: 8,
    size: 48,
    rotation: 12,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        {/* Ancient Kozuki-inspired sun rune */}
        <circle cx="20" cy="20" r="14" />
        <circle cx="20" cy="12" r="3" fill="currentColor" />
        <circle cx="20" cy="28" r="3" fill="currentColor" />
        <circle cx="12" cy="20" r="3" fill="currentColor" />
        <circle cx="28" cy="20" r="3" fill="currentColor" />
        <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    id: "g8",
    top: 82,
    left: 78,
    size: 40,
    rotation: 0,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        {/* Ancient Joy Boy Key rune */}
        <circle cx="20" cy="12" r="7" />
        <line x1="20" y1="19" x2="20" y2="34" strokeWidth="2" />
        <line x1="20" y1="26" x2="27" y2="26" strokeWidth="2" />
        <line x1="20" y1="32" x2="25" y2="32" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "g9",
    top: 92,
    left: 35,
    size: 42,
    rotation: -5,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <polygon points="20,6 34,32 6,32" />
        <polygon points="20,16 28,30 12,30" />
        <circle cx="20" cy="24" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "g10",
    top: 22,
    left: 48,
    size: 36,
    rotation: 18,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <rect x="8" y="12" width="24" height="16" rx="2" />
        <line x1="8" y1="20" x2="32" y2="20" />
        <line x1="16" y1="12" x2="16" y2="28" />
        <line x1="24" y1="12" x2="24" y2="28" />
      </svg>
    ),
  },
  {
    id: "g11",
    top: 68,
    left: 45,
    size: 40,
    rotation: -12,
    render: () => (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M 10 10 L 30 10 L 30 30 L 10 30 Z" />
        <path d="M 15 15 L 25 15 L 25 25 L 15 25 Z" fill="currentColor" fillOpacity="0.2" />
        <circle cx="20" cy="6" r="2" fill="currentColor" />
        <circle cx="20" cy="34" r="2" fill="currentColor" />
      </svg>
    ),
  },
];

export const MysteriesAndLore: React.FC<MysteriesAndLoreProps> = ({ initialMysteryId }) => {
  const { isSpoiled, showAllSpoilers } = useSpoiler();

  const [activeSubTab, setActiveSubTab] = useState<"mysteries" | "races" | "poneglyphs" | "sbs">("mysteries");
  const [selectedMystery, setSelectedMystery] = useState<string>(() => initialMysteryId || mysteriesData[0].id);

  // Set of actively illuminated Poneglyph glyph indices that fade in and out intermittently
  const [activeGlyphIndices, setActiveGlyphIndices] = useState<number[]>([0, 2, 4, 7]);

  useEffect(() => {
    // Intermittently cycle which geometric Poneglyph glyphs illuminate and fade
    const interval = setInterval(() => {
      const glyphCount = PONEGLYPH_GLYPHS.length;
      // Pick 3 to 5 random glyph indices
      const numActive = Math.floor(Math.random() * 3) + 3;
      const nextActive: number[] = [];
      while (nextActive.length < numActive) {
        const randIdx = Math.floor(Math.random() * glyphCount);
        if (!nextActive.includes(randIdx)) {
          nextActive.push(randIdx);
        }
      }
      setActiveGlyphIndices(nextActive);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const activeMysteryData = mysteriesData.find((m) => m.id === selectedMystery) || mysteriesData[0];

  return (
    <div className="relative space-y-6">
      {/* ========================================================================= */}
      {/* PONEGLYPH MARKINGS OVERLAY LAYER (INTERMITTENT FADING GEOMETRIC GLYPHS)     */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        id="poneglyph-markings-overlay"
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl -z-0 select-none"
      >
        {PONEGLYPH_GLYPHS.map((glyph, idx) => {
          const isIlluminated = activeGlyphIndices.includes(idx);

          return (
            <div
              key={glyph.id}
              className={`absolute transition-all duration-1000 ease-in-out will-change-transform will-change-opacity ${
                isIlluminated
                  ? "opacity-35 scale-100 filter drop-shadow-[0_0_10px_rgba(56,189,248,0.45)] text-cyan-300"
                  : "opacity-0 scale-90 text-amber-500/20"
              }`}
              style={{
                top: `${glyph.top}%`,
                left: `${glyph.left}%`,
                width: `${glyph.size}px`,
                height: `${glyph.size}px`,
                transform: `rotate(${glyph.rotation}deg)`,
              }}
            >
              {glyph.render()}
            </div>
          );
        })}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 space-y-6">
        {/* Sub-Navigation Bar */}
      <div className="p-4 rounded-2xl bg-[#09152b] border border-amber-500/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h2 className="font-display text-xl font-bold text-amber-100">
            Ancient Lore, Mysteries & Void Century Records
          </h2>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center space-x-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: "mysteries", label: "The Great Mysteries" },
            { id: "poneglyphs", label: "Poneglyphs & Weapons" },
            { id: "races", label: "Ancient Races" },
            { id: "sbs", label: "SBS Oda Q&A" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === tab.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* View: The Great Mysteries */}
      {activeSubTab === "mysteries" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mystery List */}
          <div className="lg:col-span-5 space-y-3">
            {mysteriesData.map((m) => {
              const isSelected = selectedMystery === m.id;
              const isMysterySpoiled = isSpoiled(m.firstIntroducedChapter);

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMystery(m.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-950/40"
                      : "bg-[#09152b] border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 border border-slate-700 text-slate-300">
                      {m.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        m.status === "Answered"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : m.status === "Partially Solved"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-rose-950 text-rose-300 border border-rose-800"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-100">
                    {isMysterySpoiled ? "Undisclosed Void Mystery" : m.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {isMysterySpoiled ? "Unlocks later in your voyage" : m.question}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mystery Deep Investigation Dossier */}
          <div className="lg:col-span-7">
            {activeMysteryData && (
              <div className="rounded-2xl border border-purple-500/30 bg-[#09152a] p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="pb-4 border-b border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                    <span>Category: {activeMysteryData.category}</span>
                    <span>Introduced: Ch. {activeMysteryData.firstIntroducedChapter}</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-purple-200">
                    {activeMysteryData.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 italic">
                    "{activeMysteryData.question}"
                  </p>
                </div>

                {/* Confirmed / Known Facts */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Verified Canonical Facts (Manga Confirmed)</span>
                  </h4>
                  <ul className="space-y-2">
                    {activeMysteryData.knownFacts.map((fact, idx) => (
                      <li key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Clues & Chapters */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center space-x-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Key Evidence & Chapter Transcripts</span>
                  </h4>
                  <div className="space-y-2">
                    {activeMysteryData.clues.map((c, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-slate-900/40 border border-slate-800 text-xs">
                        <span className="text-amber-300 font-mono font-bold">Ch. {c.chapter}: </span>
                        <span className="text-slate-300">{c.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leading Theories */}
                {activeMysteryData.leadingTheories && activeMysteryData.leadingTheories.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Prominent Scholarly Theories</span>
                    </h4>
                    <div className="space-y-2">
                      {activeMysteryData.leadingTheories.map((th, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-sky-950/20 border border-sky-800/40 text-xs text-slate-300">
                          {th}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View: Poneglyphs & Ancient Weapons */}
      {activeSubTab === "poneglyphs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poneglyphsData.map((pg) => (
              <div key={pg.id} className="p-5 rounded-xl bg-[#09152b] border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    pg.type === "Road"
                      ? "bg-rose-950 text-rose-300 border border-rose-800"
                      : "bg-purple-950 text-purple-300 border border-purple-800"
                  }`}>
                    {pg.type} Poneglyph
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Discovered Ch. {pg.discoveredChapter}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-100">{pg.name}</h3>
                <div className="text-xs text-amber-400 font-mono">Location: {pg.currentLocation}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{pg.contentsOrPurpose}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Ancient Races */}
      {activeSubTab === "races" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {racesData.map((race) => (
            <div key={race.id} className="p-5 rounded-xl bg-[#09152b] border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-400 font-mono">{race.japaneseName}</span>
                <span className="text-[10px] text-slate-500 font-mono">Debut: Ch. {race.firstAppearanceChapter}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-100">{race.name}</h3>
              <div className="text-xs text-slate-400 font-mono">Native Habitat: {race.habitat}</div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">Traits:</span>
                <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                  {race.traits.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
                {race.historyAndPersecution}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* View: SBS Q&A Trivia */}
      {activeSubTab === "sbs" && (
        <div className="space-y-4">
          {sbsTriviaData.map((sbs, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/20 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
                <span>SBS Volume {sbs.volume} Q&A</span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">{sbs.topic}</span>
              </div>
              <h4 className="font-display text-base font-bold text-slate-100">
                Reader: "{sbs.question}"
              </h4>
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-amber-100 leading-relaxed">
                <span className="font-bold text-amber-400">Eiichiro Oda: </span>
                {sbs.odaAnswer}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Significance: {sbs.significance}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

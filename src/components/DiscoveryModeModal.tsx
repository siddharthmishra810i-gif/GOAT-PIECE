import React, { useState } from "react";
import { Compass, Sparkles, X, Swords, BookOpen, Lightbulb, ArrowRight, RotateCcw } from "lucide-react";
import { useSpoiler } from "../context/SpoilerContext";
import { foreshadowingData } from "../data/foreshadowing";
import { battlesData } from "../data/battles";
import { mysteriesData } from "../data/mysteries";
import { charactersData } from "../data/characters";

interface DiscoveryModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string, id?: string) => void;
}

interface DiscoveryItem {
  type: "Foreshadowing" | "Battle" | "Mystery" | "Character";
  title: string;
  subtitle: string;
  description: string;
  chapter: number;
  highlight: string;
  targetTab: string;
}

export const DiscoveryModeModal: React.FC<DiscoveryModeModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { isSpoiled, userMangaChapter } = useSpoiler();
  const [isSpinning, setIsSpinning] = useState(false);

  // Pool of interesting discoveries within user's progress
  const getEligibleDiscoveries = (): DiscoveryItem[] => {
    const items: DiscoveryItem[] = [];

    // Foreshadowing
    foreshadowingData.forEach((f) => {
      if (!isSpoiled(f.payoffChapter || f.clueChapter)) {
        items.push({
          type: "Foreshadowing",
          title: f.topic || f.title || "Narrative Clue",
          subtitle: `Setup: Ch. ${f.clueChapter} ➔ Payoff: Ch. ${f.payoffChapter}`,
          description: f.description || f.analysis || "One of Oda's intricate long-term narrative connections.",
          chapter: f.payoffChapter || f.clueChapter,
          highlight: `Spanned ${Math.abs((f.payoffChapter || 0) - f.clueChapter)} chapters across real-time serialization!`,
          targetTab: "foreshadowing",
        });
      }
    });

    // Battles
    battlesData.forEach((b) => {
      if (!isSpoiled(b.chapter)) {
        items.push({
          type: "Battle",
          title: b.name,
          subtitle: `${b.arc} Arc · Ch. ${b.chapter}`,
          description: b.outcome,
          chapter: b.chapter,
          highlight: `Victor: ${b.winner} | Key Move: ${b.majorTechniques[0] || "Haki clash"}`,
          targetTab: "battles",
        });
      }
    });

    // Mysteries
    mysteriesData.forEach((m) => {
      if (!isSpoiled(m.firstIntroducedChapter || 1)) {
        items.push({
          type: "Mystery",
          title: m.title,
          subtitle: `Introduced: Ch. ${m.firstIntroducedChapter} · Status: ${m.status}`,
          description: m.description || m.question,
          chapter: m.firstIntroducedChapter,
          highlight: `Key Clue: ${m.clues[0]?.description || "Guarded by the World Government"}`,
          targetTab: "mysteries",
        });
      }
    });

    return items;
  };

  const eligible = getEligibleDiscoveries();
  const [activeItem, setActiveItem] = useState<DiscoveryItem>(() => {
    return eligible[Math.floor(Math.random() * Math.max(1, eligible.length))] || {
      type: "Foreshadowing",
      title: "The Will of D. & The Drums of Liberation",
      subtitle: "Ch. 1 ➔ Ch. 1044",
      description: "Luffy's smiling face upon death echoes Gol D. Roger, Jaguar D. Saul, and Portgas D. Ace.",
      chapter: 1044,
      highlight: "The eternal smile of the Dawn.",
      targetTab: "foreshadowing",
    };
  });

  const rollNewDiscovery = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const pool = getEligibleDiscoveries();
      if (pool.length > 0) {
        const random = pool[Math.floor(Math.random() * pool.length)];
        setActiveItem(random);
      }
      setIsSpinning(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#09152b] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 ${isSpinning ? "animate-spin" : ""}`}>
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
              Discovery Mode · Grand Line Log Pose
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
              Show Me Something Interesting
            </h3>
          </div>
        </div>

        {/* Card of the Discovery */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#10223d] to-[#071324] border border-amber-500/30 shadow-inner space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {activeItem.type}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {activeItem.subtitle}
            </span>
          </div>

          <h4 className="font-display text-xl font-bold text-slate-100">
            {activeItem.title}
          </h4>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeItem.description}
          </p>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-amber-300">
            ✨ {activeItem.highlight}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={rollNewDiscovery}
            disabled={isSpinning}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-200 transition-all hover:text-amber-300"
          >
            <RotateCcw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
            <span>Spin Log Pose Again</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => {
                onClose();
                onNavigate(activeItem.targetTab);
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-lg shadow-amber-500/20"
            >
              <span>Explore In Archives</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Users,
  MapPin,
  BookOpen,
  Sparkles,
  Shield,
  Clock,
  X,
  ArrowRight,
} from "lucide-react";
import { charactersData } from "../data/characters";
import { locationsData } from "../data/locations";
import { mysteriesData } from "../data/mysteries";
import { theoriesData } from "../data/theories";
import { useSpoiler } from "../context/SpoilerContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (tab: string, id: string) => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "character" | "location" | "mystery" | "theory";
  tab: string;
  chapter?: number;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState("");
  const { isSpoiled } = useSpoiler();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(); // toggle if already opened or handled by parent
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResultItem[] = [];

    // Characters
    charactersData.forEach((char) => {
      if (
        char.name.toLowerCase().includes(q) ||
        char.aliases.some((a) => a.toLowerCase().includes(q)) ||
        char.japaneseName.includes(q)
      ) {
        results.push({
          id: char.id,
          title: char.name,
          subtitle: `${char.affiliation} · ${char.bounty || "Unbountied"}`,
          category: "character",
          tab: "characters",
          chapter: char.firstMangaChapter,
        });
      }
    });

    // Locations
    locationsData.forEach((loc) => {
      if (
        loc.name.toLowerCase().includes(q) ||
        loc.seaRegion.toLowerCase().includes(q) ||
        loc.japaneseName.includes(q)
      ) {
        results.push({
          id: loc.id,
          title: loc.name,
          subtitle: `${loc.seaRegion} · ${loc.climate}`,
          category: "location",
          tab: "map",
          chapter: loc.firstMangaChapter,
        });
      }
    });

    // Mysteries
    mysteriesData.forEach((myst) => {
      if (
        myst.title.toLowerCase().includes(q) ||
        myst.question.toLowerCase().includes(q) ||
        myst.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: myst.id,
          title: myst.title,
          subtitle: `${myst.category} · ${myst.status}`,
          category: "mystery",
          tab: "mysteries",
          chapter: myst.firstIntroducedChapter,
        });
      }
    });

    // Theories
    theoriesData.forEach((th) => {
      if (th.title.toLowerCase().includes(q) || th.summary.toLowerCase().includes(q)) {
        results.push({
          id: th.id,
          title: th.title,
          subtitle: `By ${th.author} · ${th.probability}`,
          category: "theory",
          tab: "theories",
        });
      }
    });

    return results.slice(0, 15);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0a162b] border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#0c1c38]">
          <Search className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search characters, islands, mysteries, theories, fruits..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {searchResults.length > 0 ? (
            searchResults.map((item) => {
              const isItemSpoiled = item.chapter ? isSpoiled(item.chapter) : false;

              return (
                <div
                  key={`${item.category}_${item.id}`}
                  onClick={() => {
                    onSelectResult(item.tab, item.id);
                    onClose();
                  }}
                  className="p-3 rounded-xl hover:bg-slate-850 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                      {item.category === "character" && <Users className="w-4 h-4" />}
                      {item.category === "location" && <MapPin className="w-4 h-4" />}
                      {item.category === "mystery" && <BookOpen className="w-4 h-4" />}
                      {item.category === "theory" && <Sparkles className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-display text-sm font-bold text-slate-200 group-hover:text-amber-300">
                          {isItemSpoiled ? "Undisclosed Entry" : item.title}
                        </span>
                        {isItemSpoiled && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            Spoiler Shielded
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {isItemSpoiled ? "Revealed in future chapters" : item.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })
          ) : query.trim() ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No archives matched "{query}". Try searching for Luffy, Wano, Joy Boy, or Pluton.
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              Type keywords to query characters, islands, ancient weapons, and mysteries.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-800 bg-[#071324] text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Press ESC to close</span>
          <span>Grand Line Archives v2.4</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import {
  Compass,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Shield,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  Layers,
} from "lucide-react";
import { useSpoiler, VOYAGE_PRESETS } from "../context/SpoilerContext";

export interface OnePieceNavItem {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
}

export const ONE_PIECE_NAV_ITEMS: OnePieceNavItem[] = [
  {
    id: "world",
    emoji: "🧭",
    title: "WORLD",
    subtitle: "Interactive map",
  },
  {
    id: "crews",
    emoji: "🏴‍☠️",
    title: "CREWS",
    subtitle: "Pirates, Marines, Revolutionary Army",
  },
  {
    id: "characters",
    emoji: "👤",
    title: "CHARACTERS",
    subtitle: "Character encyclopedia",
  },
  {
    id: "bounties",
    emoji: "💰",
    title: "BOUNTIES",
    subtitle: "Pirates & Wanted posters",
  },
  {
    id: "history",
    emoji: "📜",
    title: "HISTORY",
    subtitle: "Timeline + Void Century + Ancient Kingdom",
  },
  {
    id: "mysteries",
    emoji: "❓",
    title: "MYSTERIES",
    subtitle: "Unanswered questions",
  },
  {
    id: "theories",
    emoji: "🧩",
    title: "THEORIES",
    subtitle: "Fan theories + evidence",
  },
  {
    id: "battles",
    emoji: "⚔️",
    title: "BATTLES",
    subtitle: "Battle database",
  },
  {
    id: "story",
    emoji: "📖",
    title: "STORY",
    subtitle: "Chapters + episodes + arcs",
  },
  {
    id: "devilFruits",
    emoji: "🍎",
    title: "DEVIL FRUITS",
    subtitle: "Devil Fruit encyclopedia",
  },
  {
    id: "discover",
    emoji: "🔎",
    title: "DISCOVER",
    subtitle: "Random exploration",
  },
];

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenDiscovery: () => void;
  onSelectCharacter?: (id: string) => void;
  onSelectLocation?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenDiscovery,
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

  const [showVoyageModal, setShowVoyageModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    if (id === "discover") {
      onOpenDiscovery();
    } else {
      setActiveTab(id);
    }
    setMobileMenuOpen(false);
  };

  // Check if a nav item is active (supporting aliases like map -> world, timeline -> history, etc.)
  const isItemActive = (id: string) => {
    if (id === "world" && (activeTab === "world" || activeTab === "map")) return true;
    if (id === "crews" && (activeTab === "crews" || activeTab === "factions" || activeTab === "bounties")) return true;
    if (id === "characters" && activeTab === "characters") return true;
    if (id === "history" && (activeTab === "history" || activeTab === "timeline" || activeTab === "foreshadowing")) return true;
    if (id === "mysteries" && activeTab === "mysteries") return true;
    if (id === "theories" && activeTab === "theories") return true;
    if (id === "battles" && activeTab === "battles") return true;
    if (id === "story" && (activeTab === "story" || activeTab === "chapterReveals")) return true;
    if (id === "devilFruits" && activeTab === "devilFruits") return true;
    if (id === "discover" && activeTab === "discover") return true;
    return activeTab === id;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#061020]/95 backdrop-blur-md border-b border-amber-500/20 shadow-xl">
      {/* Top Bar: Brand, Quick Search, Voyage Shield */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Brand - Returns to World Map */}
          <button
            onClick={() => handleNavClick("world")}
            className="flex items-center space-x-2.5 sm:space-x-3 text-left group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-900/40 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#08152c] flex items-center justify-center text-amber-400 group-hover:rotate-45 transition-transform duration-500">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div>
              <div className="font-display text-base sm:text-xl font-bold tracking-wider text-amber-200 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span>GRAND LINE ARCHIVES</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono hidden md:inline">
                  ONE PIECE
                </span>
              </div>
              <div className="hidden sm:block text-[10px] text-amber-400/70 font-mono tracking-widest uppercase">
                The Definitive Canon & Lore Explorer
              </div>
            </div>
          </button>

          {/* Right Tools: Quick Discover + Search + Spoiler Shield + Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">
            {/* Quick Discover Button */}
            <button
              onClick={onOpenDiscovery}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-all shadow-md shadow-amber-500/10 group"
              title="Log Pose Random Discovery"
            >
              <span className="text-sm">🔎</span>
              <span className="hidden sm:inline">Discover Lore</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 text-slate-300 text-xs hover:text-amber-200 transition-all shadow-inner"
              title="Global Search (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-slate-950 border border-slate-700 rounded text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Spoiler Shield Capsule */}
            <div className="relative">
              <button
                onClick={() => setShowVoyageModal(!showVoyageModal)}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  showAllSpoilers
                    ? "bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/60"
                    : voyageMode === "caught_up"
                    ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50"
                    : "bg-amber-950/50 border-amber-500/40 text-amber-300 hover:bg-amber-900/50"
                }`}
                title="Configure Spoiler Protection"
              >
                {showAllSpoilers ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="hidden sm:inline font-mono">
                  {showAllSpoilers
                    ? "Spoilers Off"
                    : voyageMode === "caught_up"
                    ? "Caught Up"
                    : `Ch. ${userMangaChapter}`}
                </span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Quick Spoiler Dropdown */}
              {showVoyageModal && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#09152b] border border-amber-500/30 shadow-2xl p-4 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                      <h4 className="font-display text-sm font-semibold text-amber-200">
                        Voyage Time Travel Shield
                      </h4>
                    </div>
                    <button
                      onClick={() => setShowVoyageModal(false)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Set your reading or viewing progress. All island records, battles, and mysteries beyond your clearance remain sealed.
                  </p>

                  <div className="mt-3 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Current Chapter:</span>
                      <span className="font-bold text-amber-400">
                        Ch. {userMangaChapter}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={1200}
                      value={userMangaChapter}
                      onChange={(e) => setUserMangaChapter(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-300">Anime Episode:</span>
                      <span className="font-bold text-sky-400">
                        Ep. {userAnimeEpisode}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={1130}
                      value={userAnimeEpisode}
                      onChange={(e) => setUserAnimeEpisode(parseInt(e.target.value, 10))}
                      className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Presets */}
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                      Fast Voyage Anchors
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {VOYAGE_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            applyPreset(p);
                            setShowVoyageModal(false);
                          }}
                          className={`px-2 py-1.5 rounded text-[11px] text-left transition-colors border ${
                            userMangaChapter === p.mangaChapter
                              ? "bg-amber-500/20 border-amber-500/50 text-amber-200"
                              : "bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          <div className="font-medium truncate">{p.label}</div>
                          <div className="text-[9px] text-slate-400 font-mono">Ch. {p.mangaChapter}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Override Toggle */}
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-300">Unveil all spoilers:</span>
                    <button
                      onClick={() => setShowAllSpoilers(!showAllSpoilers)}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                        showAllSpoilers
                          ? "bg-rose-600 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {showAllSpoilers ? "Spoilers Unveiled" : "Shield Active"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* One Piece-Specific Navigation Bar (Desktop / Tablet Scrollable Rail) */}
      <nav className="border-t border-amber-500/15 bg-[#050c18]/90">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1.5 scrollbar-none">
            {ONE_PIECE_NAV_ITEMS.map((item) => {
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group flex-shrink-0 flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200 text-left border ${
                    active
                      ? "bg-gradient-to-r from-amber-500/25 to-amber-600/15 border-amber-500/60 text-amber-200 shadow-md shadow-amber-950/30"
                      : "border-transparent text-slate-300 hover:text-amber-200 hover:bg-slate-850/70 hover:border-slate-700/50"
                  }`}
                  title={`${item.title} — ${item.subtitle}`}
                >
                  <span className="text-base sm:text-lg select-none group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </span>
                  <div className="leading-none">
                    <div
                      className={`text-xs font-bold tracking-wide font-display ${
                        active ? "text-amber-300" : "text-slate-200 group-hover:text-amber-200"
                      }`}
                    >
                      {item.title}
                    </div>
                    <div
                      className={`text-[9px] font-mono tracking-tight line-clamp-1 max-w-[130px] hidden xl:block mt-0.5 ${
                        active ? "text-amber-400/90" : "text-slate-400 group-hover:text-slate-300"
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-[#050d1a]/98 backdrop-blur-xl border-t border-amber-500/25 z-50 p-4 overflow-y-auto animate-in slide-in-from-top-4 duration-200 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400/80 px-2 pt-1 pb-2">
            Grand Line Navigation Log
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ONE_PIECE_NAV_ITEMS.map((item) => {
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-start space-x-3 p-3 rounded-2xl border text-left transition-all ${
                    active
                      ? "bg-amber-500/20 border-amber-500/60 text-amber-200 shadow-lg shadow-amber-950/40"
                      : "bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className="text-2xl select-none pt-0.5">{item.emoji}</span>
                  <div>
                    <div className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
                      <span>{item.title}</span>
                      {active && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-1 leading-snug">
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

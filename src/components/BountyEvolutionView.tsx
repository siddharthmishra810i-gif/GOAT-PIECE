import React, { useState, useMemo } from "react";
import {
  Award,
  TrendingUp,
  Skull,
  Shield,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  Search,
  Filter,
  Users,
  Eye,
  X,
  ExternalLink,
  Flame,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { bountiesEvolutionData } from "../data/bounties";
import { allPiratesBountiesData } from "../data/allPiratesBounties";
import { CharacterBountyHistory, PirateBountyItem } from "../types";
import { useSpoiler } from "../context/SpoilerContext";

interface BountyEvolutionViewProps {
  onSelectCharacter?: (characterId: string) => void;
}

export const BountyEvolutionView: React.FC<BountyEvolutionViewProps> = ({
  onSelectCharacter,
}) => {
  const { isSpoiled, userMangaChapter } = useSpoiler();

  // Active Main Tab: "all-bounties" (Wanted Posters Hall) or "evolution" (Chronology)
  const [activeTab, setActiveTab] = useState<"all-bounties" | "evolution">("all-bounties");

  // All Bounties Controls
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [selectedCrew, setSelectedCrew] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"desc" | "asc" | "alpha">("desc");
  const [inspectedPirate, setInspectedPirate] = useState<PirateBountyItem | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Evolution Chronology Controls
  const [selectedCharId, setSelectedCharId] = useState<string>("luffy");

  const selectedChar =
    bountiesEvolutionData.find((b) => b.characterId === selectedCharId) ||
    bountiesEvolutionData[0];

  const visibleMilestones = selectedChar.history.filter(
    (m) => !isSpoiled(m.chapter)
  );

  const formatBerries = (num: number) => {
    return new Intl.NumberFormat().format(num) + " ฿";
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Tier filter options
  const tiers = [
    "ALL",
    "Legendary (5B+)",
    "Emperors (4B-5B)",
    "Supreme (1B-4B)",
    "High Threat (300M-1B)",
    "Commanders (100M-300M)",
    "Rookies (<100M)",
    "Cross Guild Targets",
  ];

  // Unique Crews for filter
  const crewList = useMemo(() => {
    const set = new Set<string>();
    allPiratesBountiesData.forEach((p) => {
      if (p.crewName && p.crewName !== "Independent / Unaligned") {
        set.add(p.crewName);
      }
    });
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  // Filtered & Sorted Pirates
  const filteredPirates = useMemo(() => {
    return allPiratesBountiesData.filter((p) => {
      // Tier filter
      if (selectedTier !== "ALL") {
        if (selectedTier === "Legendary (5B+)" && p.tier !== "Legendary") return false;
        if (selectedTier === "Emperors (4B-5B)" && p.tier !== "Emperor") return false;
        if (selectedTier === "Supreme (1B-4B)" && p.tier !== "Supreme Threat") return false;
        if (selectedTier === "High Threat (300M-1B)" && p.tier !== "High Threat") return false;
        if (selectedTier === "Commanders (100M-300M)" && p.tier !== "Grand Line Commander") return false;
        if (selectedTier === "Rookies (<100M)" && (p.tier !== "Super Rookie" && p.tier !== "Pirate")) return false;
        if (selectedTier === "Cross Guild Targets" && !p.isMarineTarget) return false;
      }

      // Crew filter
      if (selectedCrew !== "ALL" && p.crewName !== selectedCrew) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchJp = p.japaneseName && p.japaneseName.includes(q);
        const matchRomaji = p.romajiName && p.romajiName.toLowerCase().includes(q);
        const matchCrew = p.crewName && p.crewName.toLowerCase().includes(q);
        if (!matchName && !matchJp && !matchRomaji && !matchCrew) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "desc") return b.bountyAmount - a.bountyAmount;
      if (sortBy === "asc") return a.bountyAmount - b.bountyAmount;
      return a.name.localeCompare(b.name);
    });
  }, [selectedTier, selectedCrew, searchQuery, sortBy]);

  const getTierColor = (tier: string, isMarineTarget?: boolean) => {
    if (isMarineTarget) return "bg-sky-500/20 text-sky-300 border-sky-500/50";
    if (tier === "Legendary") return "bg-amber-500/20 text-amber-300 border-amber-500/60";
    if (tier === "Emperor") return "bg-rose-500/20 text-rose-300 border-rose-500/60";
    if (tier === "Supreme Threat") return "bg-purple-500/20 text-purple-300 border-purple-500/60";
    if (tier === "High Threat") return "bg-orange-500/20 text-orange-300 border-orange-500/60";
    if (tier === "Grand Line Commander") return "bg-blue-500/20 text-blue-300 border-blue-500/60";
    return "bg-slate-700/40 text-slate-300 border-slate-600/60";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Award className="w-4 h-4" />
            <span>World Government & Cross Guild Intelligence Records</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Pirates & Bounties Wanted Ledger
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Official bounty records and wanted posters with authentic illustrations for 150+ pirates, warlords, emperors, and Marine targets across the Grand Line.
          </p>
        </div>

        {/* View Mode Switcher Tab */}
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 self-start md:self-center">
          <button
            onClick={() => setActiveTab("all-bounties")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-2 ${
              activeTab === "all-bounties"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Skull className="w-4 h-4" />
            <span>Wanted Posters ({allPiratesBountiesData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("evolution")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-2 ${
              activeTab === "evolution"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Bounty Chronology</span>
          </button>
        </div>
      </div>

      {/* MODE 1: ALL PIRATES & BOUNTIES WANTED POSTERS */}
      {activeTab === "all-bounties" && (
        <div className="space-y-6">
          {/* Controls Bar: Search, Tiers, Crew, Sort */}
          <div className="p-4 rounded-xl bg-[#09152b] border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pirate name, crew, Japanese name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Crew Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono flex-shrink-0">
                  Crew:
                </span>
                <select
                  value={selectedCrew}
                  onChange={(e) => setSelectedCrew(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                >
                  {crewList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono flex-shrink-0">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                >
                  <option value="desc">Bounty (High to Low)</option>
                  <option value="asc">Bounty (Low to High)</option>
                  <option value="alpha">Alphabetical (A - Z)</option>
                </select>
              </div>
            </div>

            {/* Tier Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
              <span className="text-slate-400 text-[11px] uppercase mr-1 flex-shrink-0">
                Threat Tier:
              </span>
              {tiers.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                    selectedTier === tier
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                      : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Results Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>
              Showing <strong className="text-amber-400">{filteredPirates.length}</strong> wanted pirates with official portraits
            </span>
            <span>Click any poster to inspect Marine intelligence file</span>
          </div>

          {/* Wanted Posters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPirates.map((pirate, idx) => {
              const hasImgErr = imageErrors[pirate.id];

              return (
                <div
                  key={`${pirate.id}-${idx}`}
                  onClick={() => setInspectedPirate(pirate)}
                  className="cursor-pointer group flex flex-col items-center transition-transform duration-300 hover:-translate-y-2"
                >
                  {/* Authentic Wanted Poster Framing */}
                  <div className="w-full bg-[#f4ebd9] text-slate-950 rounded-xl p-3.5 border-4 border-[#7a5832] shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all font-serif relative overflow-hidden flex flex-col justify-between">
                    {/* Background Vintage Texture and Aging Effect */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#b8986a_1px,transparent_1px)] [background-size:8px_8px]" />

                    {/* Marine Seal Header */}
                    <div className="text-center relative z-10">
                      <div className="text-[9px] uppercase font-bold tracking-widest text-[#5c3e21]">
                        {pirate.isMarineTarget ? "CROSS GUILD REWARD" : "MARINE HEADQUARTERS"}
                      </div>
                      <div className="font-display text-2xl sm:text-3xl font-black tracking-widest text-[#2c190a] leading-none my-1">
                        WANTED
                      </div>
                    </div>

                    {/* Character Picture Box */}
                    <div className="w-full aspect-[4/3] rounded-md bg-[#e4d4b8] border-2 border-[#8c6d46] my-1 relative overflow-hidden flex items-center justify-center shadow-inner">
                      {pirate.imageUrl && !hasImgErr ? (
                        <img
                          src={pirate.imageUrl}
                          alt={pirate.name}
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(pirate.id)}
                          className="w-full h-full object-cover object-top filter contrast-[1.05] group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center text-[#5c3e21] p-2">
                          <Skull className="w-12 h-12 mx-auto mb-1 opacity-70" />
                          <span className="text-[10px] font-bold">PORTRAIT FILED</span>
                        </div>
                      )}

                      {/* Status Tag on image */}
                      {pirate.status === "Deceased" && (
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-red-800 text-amber-100 text-[9px] font-bold uppercase font-mono shadow">
                          DECEASED
                        </div>
                      )}
                    </div>

                    {/* DEAD OR ALIVE banner */}
                    <div className="text-center text-[10px] font-black tracking-wider uppercase text-[#422913] py-0.5 relative z-10 border-b border-[#a88a62]/60">
                      {pirate.isMarineTarget ? "CROSS GUILD BOUNTY" : "DEAD OR ALIVE"}
                    </div>

                    {/* Character Name in bold capitalized serif */}
                    <div className="text-center my-1.5 px-1 relative z-10">
                      <h4 className="font-serif font-black text-sm text-[#1e1005] uppercase tracking-wide truncate">
                        {pirate.name}
                      </h4>
                      {pirate.japaneseName && (
                        <div className="text-[10px] text-[#6b4928] font-sans truncate">
                          {pirate.japaneseName}
                        </div>
                      )}
                    </div>

                    {/* Bounty Berry Amount */}
                    <div className="text-center bg-[#e4d5bb] py-1.5 px-2 rounded border border-[#bfa37c] relative z-10">
                      <span className="font-mono text-[13px] font-black tracking-tight text-[#2c190a]">
                        {pirate.formattedBounty}
                      </span>
                    </div>

                    {/* Marine Intelligence Fine Print */}
                    <div className="mt-2 text-[8px] text-[#785938] text-center font-mono uppercase tracking-tighter truncate">
                      {pirate.crewName || "Grand Line Fugitive"}
                    </div>
                  </div>

                  {/* Tier Chip below poster */}
                  <div className="mt-2 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${getTierColor(
                        pirate.tier,
                        pirate.isMarineTarget
                      )}`}
                    >
                      {pirate.tier}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPirates.length === 0 && (
            <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
              <Skull className="w-12 h-12 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-mono">No pirates match the selected filter or search query.</p>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: BOUNTY JUMP CHRONOLOGY (Historical Escalation) */}
      {activeTab === "evolution" && (
        <div className="space-y-6">
          {/* Character Selector Pill Group */}
          <div className="p-4 rounded-xl bg-[#09152b] border border-slate-800 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs text-slate-400 font-mono uppercase mr-2 flex-shrink-0">
              Select Fugitive:
            </span>
            {bountiesEvolutionData.map((c) => (
              <button
                key={c.characterId}
                onClick={() => setSelectedCharId(c.characterId)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  selectedCharId === c.characterId
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-105"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <span>{c.characterName}</span>
              </button>
            ))}
          </div>

          {/* Main Chronology Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Character Profile & Current Apex Bounty Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#13223d] to-[#0a1426] border border-amber-500/30 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase">
                      Marine Intelligence Dossier
                    </span>
                    <span className="text-slate-400 font-mono text-xs">
                      {selectedChar.japaneseName}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-slate-100">
                      {selectedChar.characterName}
                    </h3>
                    <p className="text-sm text-amber-400 font-mono mt-0.5">
                      Apex Bounty: {selectedChar.currentBounty}
                    </p>
                  </div>

                  {/* Wanted Poster Mockup */}
                  <div className="p-4 rounded-xl bg-[#f4ebd9] text-slate-950 border-4 border-[#7a5832] shadow-xl text-center font-serif space-y-2">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[#5c3e21]">
                      MARINE HEADQUARTERS
                    </div>
                    <div className="font-display text-3xl font-black tracking-wider text-[#3d240e]">
                      WANTED
                    </div>
                    <div className="text-xs font-bold tracking-wide uppercase text-[#5c3e21]">
                      DEAD OR ALIVE
                    </div>

                    <div className="w-full h-40 rounded bg-[#e4d4b8] border-2 border-[#b59e7a] flex flex-col items-center justify-center p-2 text-center text-[#5c3e21] shadow-inner overflow-hidden">
                      {selectedChar.imageUrl ? (
                        <img
                          src={selectedChar.imageUrl}
                          alt={selectedChar.characterName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <Skull className="w-16 h-16 text-[#8a6845] opacity-50" />
                      )}
                    </div>

                    <div className="font-bold text-lg tracking-wide uppercase text-[#2c190a]">
                      {selectedChar.characterName}
                    </div>

                    <div className="bg-[#e4d5bb] py-1 px-3 rounded border border-[#bfa37c] font-mono font-black text-xl text-[#2c190a]">
                      {selectedChar.currentBounty}
                    </div>
                  </div>

                  {onSelectCharacter && (
                    <button
                      onClick={() => onSelectCharacter(selectedChar.characterId)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Open Full Character Encyclopedia</span>
                      <ArrowUpRight className="w-4 h-4 text-amber-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Historical Escalation Timeline */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/25 shadow-xl">
                <h3 className="font-display text-lg font-bold text-slate-100 flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span>Bounty Escalation Progression</span>
                </h3>

                {/* Timeline Steps */}
                <div className="relative pl-6 border-l-2 border-amber-500/30 space-y-8">
                  {visibleMilestones.map((milestone, idx) => {
                    const prevMilestone = idx > 0 ? visibleMilestones[idx - 1] : null;
                    const increase = prevMilestone
                      ? milestone.amount - prevMilestone.amount
                      : milestone.amount;

                    return (
                      <div key={idx} className="relative group">
                        {/* Timeline Node Icon */}
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-[#09152b] group-hover:scale-125 transition-transform" />

                        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                                {milestone.eventTitle}
                              </span>
                              <h4 className="font-display text-xl font-bold text-slate-100">
                                {formatBerries(milestone.amount)}
                              </h4>
                            </div>

                            <div className="flex items-center space-x-2">
                              {prevMilestone && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/40">
                                  +{formatBerries(increase)}
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                                Ch. {milestone.chapter}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {milestone.reason}
                          </p>

                          {milestone.aliasTitle && (
                            <div className="text-[11px] text-slate-400 font-mono italic">
                              Issued Epithet: "{milestone.aliasTitle}"
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTOR MODAL: Full Wanted Poster Dossier */}
      {inspectedPirate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setInspectedPirate(null)}
        >
          <div
            className="bg-[#09152b] border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setInspectedPirate(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
              <Skull className="w-4 h-4" />
              <span>Marine Headquarters Archive · Fugitive Intelligence File</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Wanted Poster Rendering */}
              <div className="bg-[#f4ebd9] text-slate-950 rounded-xl p-4 border-4 border-[#7a5832] shadow-2xl font-serif text-center space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#5c3e21]">
                  {inspectedPirate.isMarineTarget ? "CROSS GUILD REWARD" : "MARINE HEADQUARTERS"}
                </div>
                <div className="font-display text-4xl font-black tracking-widest text-[#2c190a]">
                  WANTED
                </div>
                <div className="text-xs font-black tracking-wider uppercase text-[#5c3e21] border-b border-[#8c6d46]/40 pb-1">
                  {inspectedPirate.isMarineTarget ? "TARGET REWARD" : "DEAD OR ALIVE"}
                </div>

                <div className="w-full aspect-[4/3] rounded bg-[#e4d4b8] border-2 border-[#8c6d46] overflow-hidden flex items-center justify-center">
                  {inspectedPirate.imageUrl && !imageErrors[inspectedPirate.id] ? (
                    <img
                      src={inspectedPirate.imageUrl}
                      alt={inspectedPirate.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <Skull className="w-20 h-20 text-[#7a5832] opacity-40" />
                  )}
                </div>

                <div className="font-serif font-black text-xl text-[#1e1005] uppercase tracking-wide pt-1">
                  {inspectedPirate.name}
                </div>

                <div className="bg-[#e4d5bb] py-2 px-3 rounded border border-[#bfa37c] font-mono font-black text-xl text-[#2c190a]">
                  {inspectedPirate.formattedBounty}
                </div>
              </div>

              {/* Fugitive Intel Dossier */}
              <div className="space-y-4">
                <div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${getTierColor(
                      inspectedPirate.tier,
                      inspectedPirate.isMarineTarget
                    )}`}
                  >
                    {inspectedPirate.tier}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-slate-100 mt-2">
                    {inspectedPirate.name}
                  </h3>
                  {inspectedPirate.japaneseName && (
                    <div className="text-sm text-slate-400 font-serif">
                      {inspectedPirate.japaneseName}
                      {inspectedPirate.romajiName && ` · ${inspectedPirate.romajiName}`}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs font-mono bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Status:</span>
                    <span
                      className={`font-bold ${
                        inspectedPirate.status === "Alive"
                          ? "text-emerald-400"
                          : inspectedPirate.status === "Deceased"
                          ? "text-rose-400"
                          : "text-amber-400"
                      }`}
                    >
                      {inspectedPirate.status}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800 py-2">
                    <span className="text-slate-400">Affiliation:</span>
                    <span className="text-slate-200 font-bold">{inspectedPirate.crewName}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-800 py-2">
                    <span className="text-slate-400">Current Bounty:</span>
                    <span className="text-amber-400 font-bold">{inspectedPirate.formattedBounty}</span>
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Classification:</span>
                    <span className="text-slate-300">
                      {inspectedPirate.isMarineTarget ? "Marine Cross Guild Mark" : "Notorious Pirate"}
                    </span>
                  </div>
                </div>

                {/* Bounty Records Breakdown */}
                {inspectedPirate.bounties && inspectedPirate.bounties.length > 1 && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                      Historical Bounty Records:
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {inspectedPirate.bounties.map((b, idx) => (
                        <div
                          key={b.id || idx}
                          className="flex items-center justify-between text-xs font-mono p-2 rounded bg-slate-900 border border-slate-800"
                        >
                          <span className="text-slate-400">Record #{idx + 1}</span>
                          <span className="text-amber-300 font-bold">{formatBerries(b.amount)}</span>
                          {b.isActive && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                              Active
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jump to evolution timeline if available */}
                {bountiesEvolutionData.some(
                  (b) =>
                    b.characterName.toLowerCase().includes(inspectedPirate.name.toLowerCase()) ||
                    inspectedPirate.name.toLowerCase().includes(b.characterName.toLowerCase())
                ) && (
                  <button
                    onClick={() => {
                      const matched = bountiesEvolutionData.find(
                        (b) =>
                          b.characterName.toLowerCase().includes(inspectedPirate.name.toLowerCase()) ||
                          inspectedPirate.name.toLowerCase().includes(b.characterName.toLowerCase())
                      );
                      if (matched) {
                        setSelectedCharId(matched.characterId);
                        setActiveTab("evolution");
                        setInspectedPirate(null);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>View Step-by-Step Bounty Evolution</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

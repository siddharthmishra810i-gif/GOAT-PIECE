import React, { useState } from "react";
import {
  Clock,
  Calendar,
  Layers,
  MapPin,
  Users,
  Search,
  Shield,
  ChevronRight,
  User,
  Scroll,
} from "lucide-react";
import { timelineEventsData } from "../data/timeline";
import { characterTimelinesData } from "../data/characterTimelines";
import { TimelineEvent, CharacterTimeline } from "../types";
import { useSpoiler } from "../context/SpoilerContext";

export const TimelineView: React.FC = () => {
  const { isSpoiled, userMangaChapter } = useSpoiler();
  const [activeMode, setActiveMode] = useState<"universal" | "character">("universal");
  const [selectedEra, setSelectedEra] = useState<string>("ALL");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("luffy");
  const [searchQuery, setSearchQuery] = useState("");

  const eras = ["ALL", "Void Century", "Pre-Modern Era", "Roger's Era", "Pre-Timeskip Era", "Post-Timeskip Era"];

  const filteredEvents = timelineEventsData.filter((evt) => {
    if (selectedEra !== "ALL" && evt.era !== selectedEra) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.charactersInvolved.some((c) => c.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  const activeCharTimeline =
    characterTimelinesData.find((ct) => ct.characterId === selectedCharacterId) ||
    characterTimelinesData[0];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
              <Clock className="w-4 h-4" />
              <span>Chronicles of the Grand Line</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-100 mt-1">
              Grand Line Historical & Life Timelines
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Traverse the ages from the mysterious 100-Year Void Century to the ongoing final saga, or follow the pivotal life events of legendary figures.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono">
            <button
              onClick={() => setActiveMode("universal")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeMode === "universal"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Universal World Eras
            </button>
            <button
              onClick={() => setActiveMode("character")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeMode === "character"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Character Life Timelines
            </button>
          </div>
        </div>

        {/* Universal Mode Filters */}
        {activeMode === "universal" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {eras.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedEra === era
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search history or events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Character Mode Character Pills */}
        {activeMode === "character" && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
            <span className="text-slate-400 font-mono text-xs uppercase mr-2">Legend:</span>
            {characterTimelinesData.map((ct) => (
              <button
                key={ct.characterId}
                onClick={() => setSelectedCharacterId(ct.characterId)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCharacterId === ct.characterId
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105"
                    : "bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-700"
                }`}
              >
                {ct.characterName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mode 1: Universal Timeline */}
      {activeMode === "universal" && (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/30 space-y-8 max-w-4xl mx-auto">
          {filteredEvents.map((evt) => {
            const isEventSpoiled = isSpoiled(evt.spoilerChapter);

            return (
              <div key={evt.id} className="relative group">
                {/* Timeline Pin Marker */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#0a162b] border-2 border-amber-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-md">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>

                {/* Event Card */}
                <div className="p-6 rounded-2xl bg-[#09152b] border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                        {evt.year}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Era: {evt.era}
                      </span>
                    </div>

                    {evt.spoilerChapter && (
                      <span className="text-[10px] font-mono text-slate-500">
                        Debut: Ch. {evt.spoilerChapter}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-amber-100">
                    {evt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isEventSpoiled ? (
                      <span className="text-slate-500 italic flex items-center space-x-1">
                        <Shield className="w-3.5 h-3.5 text-amber-500" />
                        <span>Event details classified under Chapter {userMangaChapter}.</span>
                      </span>
                    ) : (
                      evt.description
                    )}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{evt.charactersInvolved.join(", ")}</span>
                    </div>

                    {evt.location && (
                      <div className="flex items-center space-x-1 text-slate-400 font-mono text-[11px]">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>{evt.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mode 2: Character Life Timeline */}
      {activeMode === "character" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Character Header Dossier */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#122444] to-[#0a1526] border border-amber-500/30 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-400 font-mono uppercase tracking-wider block">
                {activeCharTimeline.epithet}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 mt-0.5">
                {activeCharTimeline.characterName}'s Life Journey
              </h3>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              {activeCharTimeline.events.filter((e) => !isSpoiled(e.chapter)).length} recorded milestones
            </div>
          </div>

          {/* Life Events Stream */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/30 space-y-6">
            {activeCharTimeline.events
              .filter((e) => !isSpoiled(e.chapter))
              .map((evt) => (
                <div key={evt.id} className="relative group">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#0a162b] border-2 border-amber-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-md">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>

                  <div className="p-5 rounded-xl bg-[#09152b] border border-slate-800 hover:border-amber-500/40 transition-all shadow-lg space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {evt.period}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Manga Ch. {evt.chapter} {evt.episode ? `· Ep. ${evt.episode}` : ""}
                      </span>
                    </div>

                    <h4 className="font-display text-base font-bold text-slate-100">
                      {evt.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-amber-300 font-mono">
                      <strong>Historical Significance: </strong>
                      {evt.significance}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                      <span>Location: {evt.locationName}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

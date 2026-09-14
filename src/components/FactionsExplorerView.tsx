import React, { useState } from "react";
import { Shield, Users, Crown, Flag, Anchor, ChevronRight, ChevronDown, Award } from "lucide-react";
import { factionsData } from "../data/factions";
import { FactionGroup, FactionMember } from "../types";

export const FactionsExplorerView: React.FC = () => {
  const [selectedFactionId, setSelectedFactionId] = useState<string>("world_government");

  const selectedFaction = factionsData.find((f) => f.id === selectedFactionId) || factionsData[0];

  const renderMember = (member: FactionMember, depth = 0) => {
    return (
      <div key={member.id} className={`space-y-2 ${depth > 0 ? "ml-4 sm:ml-6 pl-3 border-l border-amber-500/20" : ""}`}>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <div className="text-slate-100 font-bold text-sm flex items-center space-x-2">
              <span>{member.name}</span>
              {member.status && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {member.status}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">{member.title}</div>
          </div>
          {member.bounty && (
            <div className="text-xs font-mono font-bold text-amber-400 whitespace-nowrap">
              {member.bounty}
            </div>
          )}
        </div>

        {member.subordinates && member.subordinates.length > 0 && (
          <div className="space-y-2 mt-2">
            {member.subordinates.map((sub) => renderMember(sub, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>Grand Line Geopolitical Order</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            Factions, Governments & Alliances
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Explore the organizational hierarchies and power dynamics of the World Government, the Four Emperors, the Revolutionary Army, and sovereign kingdoms.
          </p>
        </div>

        {/* Faction Pills */}
        <div className="flex flex-wrap gap-2">
          {factionsData.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFactionId(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFactionId === f.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Faction Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overview Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase">
                {selectedFaction.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedFaction.japaneseName}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-slate-100">
              {selectedFaction.name}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] font-mono uppercase">Leadership:</span>
                <span className="text-amber-300 font-bold text-sm">{selectedFaction.leadership}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] font-mono uppercase">Headquarters:</span>
                <span className="text-slate-200 font-medium">{selectedFaction.headquarters}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] font-mono uppercase">Governing Doctrine:</span>
                <span className="text-slate-300 italic">{selectedFaction.ideology}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              {selectedFaction.summary}
            </p>

            {/* Related Factions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Geopolitical Relationships:
              </span>
              <div className="space-y-1.5 text-xs">
                {selectedFaction.relatedFactions.map((rel, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-200 font-medium">{rel.name}</span>
                    <span className="text-[11px] font-mono text-amber-400">{rel.relation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Command Hierarchy Tree */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-[#09152b] border border-amber-500/20 shadow-xl space-y-4">
            <h4 className="font-display text-lg font-bold text-slate-200 flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>Chain of Command & Member Hierarchy</span>
            </h4>

            <div className="space-y-3">
              {selectedFaction.hierarchy.map((rootMember) => renderMember(rootMember, 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

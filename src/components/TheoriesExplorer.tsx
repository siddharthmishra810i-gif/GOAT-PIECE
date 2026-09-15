import React, { useState } from "react";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  PlusCircle,
  Filter,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  XCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  ShieldAlert,
  Compass,
  BookOpen,
} from "lucide-react";
import { theoriesData as initialTheories } from "../data/theories";
import { Theory } from "../types";

interface TheoriesExplorerProps {
  initialTheoryId?: string | null;
  onSelectCharacter?: (characterId: string) => void;
  onSelectLocation?: (locationId: string) => void;
  onSelectMystery?: (mysteryId: string) => void;
}

export const TheoriesExplorer: React.FC<TheoriesExplorerProps> = ({
  initialTheoryId,
  onSelectCharacter,
  onSelectLocation,
  onSelectMystery,
}) => {
  const [theories, setTheories] = useState<Theory[]>(initialTheories);
  const [selectedProbability, setSelectedProbability] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTheories, setExpandedTheories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (initialTheoryId) {
      initial[initialTheoryId] = true;
    } else {
      // expand first theory by default to showcase the evidence graph
      initial[initialTheories[0].id] = true;
    }
    return initial;
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New theory form state
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newEvidence, setNewEvidence] = useState("");
  const [newProbability, setNewProbability] = useState<Theory["probability"]>("Plausible");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleExpand = (theoryId: string) => {
    setExpandedTheories((prev) => ({
      ...prev,
      [theoryId]: !prev[theoryId],
    }));
  };

  const handleUpvote = async (theoryId: string) => {
    setTheories((prev) =>
      prev.map((t) => (t.id === theoryId ? { ...t, votes: t.votes + 1 } : t))
    );
    try {
      await fetch(`/api/theories/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theoryId, voteType: "up" }),
      });
    } catch (e) {
      // offline fallback
    }
  };

  const handleDownvote = async (theoryId: string) => {
    setTheories((prev) =>
      prev.map((t) =>
        t.id === theoryId
          ? { ...t, downvotes: (t.downvotes || 0) + 1 }
          : t
      )
    );
    try {
      await fetch(`/api/theories/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theoryId, voteType: "down" }),
      });
    } catch (e) {
      // offline fallback
    }
  };

  const handleCreateTheory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    setIsSubmitting(true);
    const newTheoryObj: Theory = {
      id: `theory_user_${Date.now()}`,
      title: newTitle,
      author: newAuthor.trim() || "Anonymous Scholar",
      communitySource: "Grand Line Archives Community",
      dateCreated: new Date().toISOString().split("T")[0],
      summary: newSummary,
      evidence: newEvidence.split("\n").filter((l) => l.trim().length > 0),
      evidenceItems: newEvidence.split("\n").filter((l) => l.trim().length > 0).map((ev) => ({
        evidence: ev,
        chapter: 1000,
        strength: 3,
        type: "Foreshadowing",
      })),
      argumentsFor: [newSummary],
      argumentsAgainst: ["Pending community peer-review."],
      supportingChapters: [],
      contradictingEvidence: [],
      relatedCharacters: [],
      relatedLocations: [],
      relatedMysteries: [],
      probability: newProbability,
      votes: 1,
      downvotes: 0,
      status: "Active Discussion",
    };

    try {
      await fetch(`/api/theories/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTheoryObj),
      });
    } catch (err) {
      // fallback
    }

    setTheories([newTheoryObj, ...theories]);
    setExpandedTheories((prev) => ({ ...prev, [newTheoryObj.id]: true }));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(false);
      setNewTitle("");
      setNewAuthor("");
      setNewSummary("");
      setNewEvidence("");
    }, 1200);
  };

  const filteredTheories = theories.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProb =
      selectedProbability === "ALL" || t.probability === selectedProbability;

    return matchesSearch && matchesProb;
  });

  const getProbabilityBadge = (prob: Theory["probability"]) => {
    switch (prob) {
      case "Strongly Supported":
        return { color: "bg-emerald-950 text-emerald-300 border-emerald-800", icon: CheckCircle2 };
      case "Plausible":
        return { color: "bg-amber-950 text-amber-300 border-amber-800", icon: Sparkles };
      case "Speculative":
        return { color: "bg-purple-950 text-purple-300 border-purple-800", icon: AlertTriangle };
      case "Contradicted":
      case "Disproven":
        return { color: "bg-rose-950 text-rose-300 border-rose-800", icon: XCircle };
      default:
        return { color: "bg-slate-800 text-slate-300 border-slate-700", icon: HelpCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#09152b] border border-amber-500/25 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                Grand Line Archeological Archives
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-100 mt-1">
              Theories & Evidence Graphs
            </h2>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit a Theory</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-mono mr-1">Probability:</span>
            {["ALL", "Strongly Supported", "Plausible", "Speculative", "Disproven"].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProbability(p)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedProbability === p
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search theory titles or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>
      </div>

      {/* Theories List with Comprehensive Evidence Graphs */}
      <div className="space-y-6">
        {filteredTheories.map((theory) => {
          const badge = getProbabilityBadge(theory.probability);
          const Icon = badge.icon;
          const isExpanded = !!expandedTheories[theory.id];
          const totalVotes = (theory.votes || 0) + (theory.downvotes || 0);
          const upPercentage = totalVotes > 0 ? Math.round(((theory.votes || 0) / totalVotes) * 100) : 50;

          return (
            <div
              key={theory.id}
              className="rounded-2xl bg-[#09152b] border border-slate-800 hover:border-amber-500/30 transition-all shadow-xl overflow-hidden"
            >
              {/* Theory Header Card */}
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold border ${badge.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{theory.probability}</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">Status: {theory.status}</span>
                  </div>

                  <span className="text-xs font-mono text-slate-500">Cataloged {theory.dateCreated}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-100 leading-snug">
                      {theory.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1">
                      By <span className="text-amber-300 font-medium">{theory.author}</span> · {theory.communitySource}
                    </div>
                  </div>

                  {/* Expand/Collapse Evidence Graph Button */}
                  <button
                    onClick={() => toggleExpand(theory.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors shrink-0"
                  >
                    <span>{isExpanded ? "Collapse Graph" : "Inspect Evidence Graph"}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {theory.summary}
                </p>

                {/* Quick Chapters */}
                {theory.supportingChapters && theory.supportingChapters.length > 0 && (
                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                    <span>Key Supporting Chapters:</span>
                    <span className="text-amber-300 font-bold">
                      {theory.supportingChapters.map((c) => `Ch. ${c}`).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Expandable Deep Evidence & Argument Graph */}
              {isExpanded && (
                <div className="border-t border-slate-800/80 bg-[#061020] p-6 space-y-6">
                  {/* 1. Evidence Matrix Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Evidence Graph & Canonical Pillars</span>
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        Evaluated by Scholars of Ohara
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] font-mono uppercase text-slate-400">
                            <th className="p-3 w-1/2">Evidence Claim</th>
                            <th className="p-3 text-center">Chapter</th>
                            <th className="p-3 text-center">Type</th>
                            <th className="p-3 text-center">Strength</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {theory.evidenceItems && theory.evidenceItems.length > 0 ? (
                            theory.evidenceItems.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                                <td className="p-3">
                                  <div className="font-medium text-slate-200">{item.evidence}</div>
                                  {item.notes && (
                                    <div className="text-[11px] text-slate-400 mt-0.5 italic">{item.notes}</div>
                                  )}
                                </td>
                                <td className="p-3 text-center font-mono text-amber-300 font-bold whitespace-nowrap">
                                  Ch. {item.chapter}
                                </td>
                                <td className="p-3 text-center whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                                    {item.type}
                                  </span>
                                </td>
                                <td className="p-3 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center space-x-0.5 text-amber-400">
                                    {Array.from({ length: 5 }).map((_, starIdx) => (
                                      <Star
                                        key={starIdx}
                                        className={`w-3.5 h-3.5 ${
                                          starIdx < item.strength
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-slate-700"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-slate-500">
                                No formal evidence matrix items logged.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. Arguments FOR & Arguments AGAINST */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Arguments FOR */}
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50 space-y-2">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-bold font-mono uppercase text-[11px]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Arguments FOR</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {theory.argumentsFor && theory.argumentsFor.length > 0 ? (
                          theory.argumentsFor.map((arg, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                              <span>{arg}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-500 italic">No positive arguments cataloged yet.</li>
                        )}
                      </ul>
                    </div>

                    {/* Arguments AGAINST */}
                    <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 space-y-2">
                      <div className="flex items-center space-x-1.5 text-rose-400 font-bold font-mono uppercase text-[11px]">
                        <XCircle className="w-4 h-4" />
                        <span>Arguments AGAINST / Counter-Evidence</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {theory.argumentsAgainst && theory.argumentsAgainst.length > 0 ? (
                          theory.argumentsAgainst.map((arg, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-rose-400 font-bold mt-0.5">✕</span>
                              <span>{arg}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-500 italic">No counter-arguments cataloged yet.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* 3. Community Votes Bar */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 w-full sm:w-1/2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Community Consensus:</span>
                        <span className="text-amber-300 font-bold">{upPercentage}% Approval</span>
                      </div>
                      {/* Consensus bar */}
                      <div className="w-full h-2 rounded-full bg-rose-900/60 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${upPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>{theory.votes} Upvotes</span>
                        <span>{theory.downvotes || 0} Downvotes</span>
                      </div>
                    </div>

                    {/* Interactive Vote Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpvote(theory.id)}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all active:scale-95"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Upvote</span>
                      </button>

                      <button
                        onClick={() => handleDownvote(theory.id)}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all active:scale-95"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Downvote</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Theory Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#0a162b] border border-amber-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display text-lg font-bold text-amber-200">
                Submit a Grand Line Theory
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center text-emerald-400 font-bold space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto animate-bounce" />
                <div>Theory successfully inscribed into the Grand Line Archives!</div>
              </div>
            ) : (
              <form onSubmit={handleCreateTheory} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Theory Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., The Ancient Kingdom's Floating Continent"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Your Name / Handle:</label>
                    <input
                      type="text"
                      placeholder="e.g., Scholar of Ohara"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Probability Rating:</label>
                    <select
                      value={newProbability}
                      onChange={(e) => setNewProbability(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                    >
                      <option value="Strongly Supported">Strongly Supported</option>
                      <option value="Plausible">Plausible</option>
                      <option value="Speculative">Speculative</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Core Hypothesis / Summary:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your theory succinctly..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Canonical Evidence (One point per line):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Chapter 1066: Saul's books preserved&#10;Chapter 1115: Continents sunk 200m"
                    value={newEvidence}
                    onChange={(e) => setNewEvidence(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    {isSubmitting ? "Inscribing..." : "Submit to Archives"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

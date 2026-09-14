import React, { useState, useMemo } from "react";
import {
  Share2,
  Filter,
  Info,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Search,
  Focus,
  Network,
  Compass,
  BookOpen,
  Users,
} from "lucide-react";
import { graphNodesData, graphEdgesData, GraphNode } from "../data/graphData";
import { useSpoiler } from "../context/SpoilerContext";

interface KnowledgeGraphProps {
  onSelectCharacter?: (id: string) => void;
  onSelectMystery?: (id: string) => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  onSelectCharacter,
  onSelectMystery,
}) => {
  const { isSpoiled, userMangaChapter } = useSpoiler();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [activeNode, setActiveNode] = useState<GraphNode | null>(
    () => graphNodesData.find((n) => n.id === "joy_boy") || graphNodesData[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(1);

  // Quick focus presets
  const presets = [
    { label: "Joy Boy & Void Century", nodeId: "joy_boy" },
    { label: "Luffy & Nika", nodeId: "luffy" },
    { label: "Ancient Weapons", nodeId: "ancient_weapon_pluton" },
    { label: "The One Piece", nodeId: "one_piece" },
  ];

  // Calculate connected node IDs for focus mode
  const neighborhoodNodeIds = useMemo(() => {
    if (!activeNode || !focusMode) return null;
    const ids = new Set<string>([activeNode.id]);
    graphEdgesData.forEach((edge) => {
      if (edge.source === activeNode.id) ids.add(edge.target);
      if (edge.target === activeNode.id) ids.add(edge.source);
    });
    return ids;
  }, [activeNode, focusMode]);

  // Position nodes in an organic orbital cluster layout
  const positionedNodes = useMemo(() => {
    const width = 860;
    const height = 560;
    const centerX = width / 2;
    const centerY = height / 2;

    return graphNodesData.map((node, index) => {
      let radius = 220;
      if (node.category === "mystery" || node.category === "weapon") radius = 110;
      if (node.category === "concept" || node.category === "theory") radius = 170;
      if (node.category === "location") radius = 270;

      const angle = (index / graphNodesData.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        ...node,
        x,
        y,
      };
    });
  }, []);

  const filteredNodes = useMemo(() => {
    return positionedNodes.filter((node) => {
      if (focusMode && neighborhoodNodeIds && !neighborhoodNodeIds.has(node.id)) {
        return false;
      }
      if (selectedCategory !== "ALL" && node.category !== selectedCategory) return false;
      if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [positionedNodes, selectedCategory, searchQuery, focusMode, neighborhoodNodeIds]);

  // Edges connecting visible nodes
  const visibleEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    return graphEdgesData.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [filteredNodes]);

  // Direct connected edges for active node
  const activeNodeConnections = useMemo(() => {
    if (!activeNode) return [];
    return graphEdgesData.filter((e) => e.source === activeNode.id || e.target === activeNode.id);
  }, [activeNode]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#09152b] border border-amber-500/25 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
                Relational Knowledge Matrix
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-100 mt-1">
              The One Piece Lore & Relationship Network
            </h2>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 mr-1 text-[11px]">Epicenters:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  const target = graphNodesData.find((n) => n.id === p.nodeId);
                  if (target) {
                    setActiveNode(target);
                    setFocusMode(true);
                  }
                }}
                className={`px-2.5 py-1 rounded-md border transition-colors ${
                  activeNode?.id === p.nodeId && focusMode
                    ? "bg-amber-500 text-slate-950 font-bold border-amber-400"
                    : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-mono mr-1">Filter:</span>
            {["ALL", "character", "mystery", "location", "weapon", "theory", "concept"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors capitalize ${
                  selectedCategory === cat
                    ? "bg-sky-500 text-slate-950 font-bold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat === "ALL" ? "All Entities" : cat}
              </button>
            ))}

            {/* Toggle Focus Subgraph Mode */}
            <button
              onClick={() => setFocusMode((prev) => !prev)}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-mono flex items-center space-x-1 transition-all ${
                focusMode
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Focus className="w-3 h-3" />
              <span>{focusMode ? "Focus Mode: ON" : "Focus Neighborhood"}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts or characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Main Graph Canvas & Node Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Graph */}
        <div className="lg:col-span-8 relative h-[580px] rounded-2xl border border-sky-500/25 bg-[#050e1d] overflow-hidden shadow-2xl">
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-lg">
            <button
              onClick={() => setZoom((z) => Math.min(1.9, z + 0.15))}
              className="p-1.5 text-slate-300 hover:text-sky-300 rounded hover:bg-slate-800"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 text-slate-300 hover:text-sky-300 rounded hover:bg-slate-800"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 text-slate-300 hover:text-sky-300 rounded hover:bg-slate-800"
              title="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <svg
            viewBox="0 0 860 560"
            className="w-full h-full transition-transform duration-300 origin-center select-none"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Background constellation pattern */}
            <defs>
              <radialGradient id="graphCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="860" height="560" fill="url(#graphCenterGlow)" />

            {/* Orbit concentric guidelines */}
            <circle cx="430" cy="280" r="110" fill="none" stroke="#172554" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="430" cy="280" r="170" fill="none" stroke="#172554" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="430" cy="280" r="220" fill="none" stroke="#172554" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="430" cy="280" r="270" fill="none" stroke="#172554" strokeWidth="1" strokeDasharray="3,3" />

            {/* Edges */}
            {visibleEdges.map((edge) => {
              const srcNode = positionedNodes.find((n) => n.id === edge.source);
              const tgtNode = positionedNodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isEdgeActive =
                activeNode && (edge.source === activeNode.id || edge.target === activeNode.id);

              return (
                <g key={edge.id}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isEdgeActive ? "#f59e0b" : "#334155"}
                    strokeWidth={isEdgeActive ? 2.5 : 1}
                    strokeDasharray={edge.relationType === "enemy" ? "4,4" : undefined}
                    opacity={isEdgeActive ? 1 : 0.4}
                  />
                  {/* Label on line midpoint */}
                  {isEdgeActive && (
                    <text
                      x={(srcNode.x! + tgtNode.x!) / 2}
                      y={(srcNode.y! + tgtNode.y!) / 2 - 4}
                      fill="#fef08a"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="bg-slate-900 font-bold"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = activeNode?.id === node.id;
              const isNodeSpoiled = isSpoiled(node.firstChapter);

              return (
                <g
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Glow ring */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? "14" : "10"}
                    fill={node.color || "#0ea5e9"}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />

                  {/* Node Label */}
                  <text
                    x={node.x}
                    y={node.y! + (isSelected ? 26 : 22)}
                    textAnchor="middle"
                    fill={isSelected ? "#fef08a" : "#cbd5e1"}
                    fontSize={isSelected ? "11" : "9"}
                    fontWeight={isSelected ? "bold" : "normal"}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {isNodeSpoiled ? "Protected Entity" : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Profile Inspector Drawer */}
        <div className="lg:col-span-4 rounded-2xl border border-sky-500/25 bg-[#09152a] p-6 shadow-2xl space-y-5">
          {activeNode ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-sky-950 text-sky-300 border border-sky-800 font-bold">
                    {activeNode.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Debut: Ch. {activeNode.firstChapter}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-100 mt-1">
                  {activeNode.label}
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeNode.description}
              </p>

              {/* Direct Relationships */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    Interconnected Concepts ({activeNodeConnections.length})
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Click to traverse</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {activeNodeConnections.map((conn) => {
                    const otherNodeId = conn.source === activeNode.id ? conn.target : conn.source;
                    const otherNode = graphNodesData.find((n) => n.id === otherNodeId);

                    return (
                      <div
                        key={conn.id}
                        onClick={() => otherNode && setActiveNode(otherNode)}
                        className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 cursor-pointer text-xs flex items-center justify-between transition-all"
                      >
                        <div>
                          <span className="text-amber-300 font-bold">{conn.label}</span>
                          <span className="text-slate-400 mx-1">→</span>
                          <span className="text-slate-200 font-medium">
                            {otherNode?.label || otherNodeId}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Ch. {conn.revealedChapter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Context Links */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
                {activeNode.category === "character" && onSelectCharacter && (
                  <button
                    onClick={() => onSelectCharacter(activeNode.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Full Dossier</span>
                  </button>
                )}
                {activeNode.category === "mystery" && onSelectMystery && (
                  <button
                    onClick={() => onSelectMystery(activeNode.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>Explore Mystery</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Click any node in the constellation to trace its web of connections.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

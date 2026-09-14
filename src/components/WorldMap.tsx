import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Compass,
  Layers,
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Shield,
  BookOpen,
  Info,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Calendar,
  Cloud,
  Anchor,
  HelpCircle,
  Eye,
  EyeOff,
  Users,
  Swords,
  Scroll,
  Navigation,
  Flag,
  Ship,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Crosshair,
  Maximize2,
  Building,
  Landmark as LandmarkIcon,
  Mountain,
} from "lucide-react";
import { locationsData } from "../data/locations";
import { voyageGroupsData } from "../data/voyages";
import { getIslandGeography, IslandGeography } from "../data/islandLandmarks";
import { Location, VoyageGroup, VoyageStep, IslandLandmark } from "../types";
import { useSpoiler } from "../context/SpoilerContext";

interface WorldMapProps {
  onSelectCharacter?: (characterId: string) => void;
  onSelectMystery?: (mysteryId: string) => void;
  onSelectTheory?: (theoryId: string) => void;
  selectedLocationId?: string | null;
}

// Story Milestones for Time-Aware Chronometer
const STORY_MILESTONES = [
  {
    label: "East Blue Saga",
    saga: "East Blue",
    chapter: 100,
    unlockedHighlights: ["Foosha Village", "Baratie", "Arlong Park", "Loguetown", "Reverse Mountain Entrance"],
  },
  {
    label: "Alabasta Saga",
    saga: "Alabasta",
    chapter: 217,
    unlockedHighlights: ["Whiskey Peak", "Little Garden", "Drum Island", "Alabasta Kingdom", "Pluton Poneglyph"],
  },
  {
    label: "Sky Island Saga",
    saga: "Skypiea",
    chapter: 302,
    unlockedHighlights: ["Jaya Mock Town", "Skypiea Sky Realm", "Shandora Golden Bell", "Upper Yard"],
  },
  {
    label: "Water 7 / Enies Lobby",
    saga: "Water 7",
    chapter: 441,
    unlockedHighlights: ["Long Ring Long Land", "Water 7 Shipwright Capital", "Enies Lobby Judicial Island", "Gates of Justice"],
  },
  {
    label: "Summit War (Marineford)",
    saga: "Thriller Bark / Summit War",
    chapter: 597,
    unlockedHighlights: ["Thriller Bark", "Sabaody Archipelago", "Amazon Lily", "Impel Down Prison", "Marineford Navy HQ"],
  },
  {
    label: "Fish-Man Island Arc",
    saga: "Fish-Man Island",
    chapter: 653,
    unlockedHighlights: ["Fish-Man Island (-10,000m)", "Ryugu Palace", "Noah Ark", "Sea Forest Joy Boy Letter"],
  },
  {
    label: "Dressrosa Saga",
    saga: "Dressrosa",
    chapter: 801,
    unlockedHighlights: ["Punk Hazard", "Dressrosa Kingdom", "Corrida Colosseum", "Green Bit Tontatta"],
  },
  {
    label: "Whole Cake Island Saga",
    saga: "Four Emperors",
    chapter: 908,
    unlockedHighlights: ["Zou Mokomo Dukedom", "Totto Land (Whole Cake)", "Levely (Mary Geoise)", "Road Poneglyphs"],
  },
  {
    label: "Wano Country Saga",
    saga: "Four Emperors",
    chapter: 1057,
    unlockedHighlights: ["Wano Country", "Onigashima", "Joy Boy Reawakening", "Gear 5", "Pluton Location Revealed"],
  },
  {
    label: "Egghead Island Arc",
    saga: "Final Saga",
    chapter: 1125,
    unlockedHighlights: ["Egghead Future Island", "Mother Flame", "Vegapunk World Broadcast", "Ancient Kingdom Technology"],
  },
  {
    label: "Elbaf & Beyond",
    saga: "Final Saga",
    chapter: 1192,
    unlockedHighlights: ["Elbaf", "Underworld Kingdom", "Prince Loki", "Ancient Giant Lore", "Laugh Tale Approach"],
  },
];

export const WorldMap: React.FC<WorldMapProps> = ({
  onSelectCharacter,
  onSelectMystery,
  onSelectTheory,
  selectedLocationId,
}) => {
  const { isSpoiled, userMangaChapter, setUserMangaChapter } = useSpoiler();
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Time slider state
  const initialMilestoneIndex = useMemo(() => {
    const idx = STORY_MILESTONES.findIndex((m) => m.chapter >= userMangaChapter);
    return idx === -1 ? STORY_MILESTONES.length - 1 : idx;
  }, [userMangaChapter]);

  const [milestoneIndex, setMilestoneIndex] = useState<number>(initialMilestoneIndex);
  const currentMilestone = STORY_MILESTONES[milestoneIndex];
  const activeChapterThreshold = currentMilestone.chapter;

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(() => {
    if (selectedLocationId) {
      return locationsData.find((loc) => loc.id === selectedLocationId) || null;
    }
    return locationsData.find((loc) => loc.id === "wano") || locationsData[0];
  });

  const [selectedLandmark, setSelectedLandmark] = useState<IslandLandmark | null>(null);

  const [drawerTab, setDrawerTab] = useState<
    "overview" | "landmarks" | "history" | "inhabitants" | "events" | "lore" | "related"
  >("overview");

  // Advanced Vector SVG Pan and Zoom State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Voyage Mode State
  const [isVoyageModeOpen, setIsVoyageModeOpen] = useState<boolean>(true);
  const [selectedVoyageGroupId, setSelectedVoyageGroupId] = useState<string>("straw_hats");
  const [activeVoyageStepIndex, setActiveVoyageStepIndex] = useState<number>(0);

  const activeVoyageGroup = useMemo(() => {
    return voyageGroupsData.find((g) => g.id === selectedVoyageGroupId) || voyageGroupsData[0];
  }, [selectedVoyageGroupId]);

  // Layers toggle
  const [activeLayers, setActiveLayers] = useState({
    crewVoyageRoute: true,
    poneglyphs: true,
    calmBelt: true,
    skyIslands: true,
    landmarks: true,
  });
  const [seaFilter, setSeaFilter] = useState<string>("ALL");

  // Location discovery logic
  const isLocationDiscovered = (loc: Location) => {
    return (loc.firstMangaChapter || 1) <= activeChapterThreshold;
  };

  const visibleLocations = useMemo(() => {
    return locationsData.filter((loc) => {
      if (seaFilter !== "ALL" && !loc.seaRegion.toLowerCase().includes(seaFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [seaFilter]);

  // Filter voyage steps based on chapter threshold
  const visibleVoyageSteps = useMemo(() => {
    return activeVoyageGroup.steps.filter((s) => s.startChapter <= activeChapterThreshold);
  }, [activeVoyageGroup, activeChapterThreshold]);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Smooth Zoom & Center on an Island
  const focusOnIsland = (loc: Location, targetZoom = 3.2) => {
    setSelectedLocation(loc);
    setSelectedLandmark(null);
    setIsAnimating(true);
    const posX = loc.coordinates.x * 10;
    const posY = loc.coordinates.y * 6;
    // Center (posX, posY) at (500, 300) in the 1000x600 SVG viewBox
    const targetX = 500 - posX * targetZoom;
    const targetY = 300 - posY * targetZoom;
    setZoomLevel(targetZoom);
    setPanOffset({ x: targetX, y: targetY });
  };

  // Zoom & Center on a specific Landmark within an Island
  const focusOnLandmark = (landmark: IslandLandmark) => {
    setSelectedLandmark(landmark);
    if (!selectedLocation) return;
    setIsAnimating(true);
    const posX = selectedLocation.coordinates.x * 10 + landmark.relativeCoords.x;
    const posY = selectedLocation.coordinates.y * 6 + landmark.relativeCoords.y;
    const targetZoom = 3.8;
    const targetX = 500 - posX * targetZoom;
    const targetY = 300 - posY * targetZoom;
    setZoomLevel(targetZoom);
    setPanOffset({ x: targetX, y: targetY });
  };

  // Reset to full world view
  const resetToOverview = () => {
    setIsAnimating(true);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedLandmark(null);
  };

  // Handle manual pan adjustments
  const handlePan = (dx: number, dy: number) => {
    setIsAnimating(true);
    setPanOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  // Quick Region Focus Presets
  const focusRegion = (regionName: string) => {
    setSelectedLandmark(null);
    setIsAnimating(true);
    switch (regionName) {
      case "East Blue":
        setZoomLevel(2.2);
        setPanOffset({ x: 500 - 180 * 2.2, y: 300 - 430 * 2.2 });
        break;
      case "Paradise":
        setZoomLevel(1.9);
        setPanOffset({ x: 500 - 460 * 1.9, y: 300 - 320 * 1.9 });
        break;
      case "Red Line":
        setZoomLevel(2.5);
        setPanOffset({ x: 500 - 620 * 2.5, y: 300 - 300 * 2.5 });
        break;
      case "New World":
        setZoomLevel(2.0);
        setPanOffset({ x: 500 - 800 * 2.0, y: 300 - 300 * 2.0 });
        break;
      case "Sky Ocean":
        setZoomLevel(2.5);
        setPanOffset({ x: 500 - 540 * 2.5, y: 300 - 190 * 2.5 });
        break;
      case "Calm Belts":
        setZoomLevel(2.2);
        setPanOffset({ x: 500 - 380 * 2.2, y: 300 - 180 * 2.2 });
        break;
      default:
        resetToOverview();
        break;
    }
  };

  // Sync external location selection (e.g. from search or character links)
  useEffect(() => {
    if (selectedLocationId) {
      const loc = locationsData.find((l) => l.id === selectedLocationId);
      if (loc) {
        focusOnIsland(loc, 3.2);
      }
    }
  }, [selectedLocationId]);

  // Mouse Wheel Zoom centered at cursor
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!svgContainerRef.current) return;
    const rect = svgContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // SVG 1000x600 coordinates
    const svgX = (mouseX / rect.width) * 1000;
    const svgY = (mouseY / rect.height) * 600;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = Math.max(0.7, Math.min(4.5, zoomLevel * zoomFactor));

    // World coordinate under cursor remains identical
    const worldX = (svgX - panOffset.x) / zoomLevel;
    const worldY = (svgY - panOffset.y) / zoomLevel;

    const newPanX = svgX - worldX * newZoom;
    const newPanY = svgY - worldY * newZoom;

    setIsAnimating(false);
    setZoomLevel(newZoom);
    setPanOffset({ x: newPanX, y: newPanY });
  };

  // Mouse drag to pan
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary button
    setIsDragging(true);
    setIsAnimating(false);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsAnimating(false);
      setTouchStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart && e.touches.length === 1) {
      setPanOffset({
        x: e.touches[0].clientX - touchStart.x,
        y: e.touches[0].clientY - touchStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Double click to zoom in at point
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!svgContainerRef.current) return;
    const rect = svgContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const svgX = (mouseX / rect.width) * 1000;
    const svgY = (mouseY / rect.height) * 600;

    const newZoom = Math.min(4.5, zoomLevel + 0.8);
    const worldX = (svgX - panOffset.x) / zoomLevel;
    const worldY = (svgY - panOffset.y) / zoomLevel;

    setIsAnimating(true);
    setZoomLevel(newZoom);
    setPanOffset({
      x: svgX - worldX * newZoom,
      y: svgY - worldY * newZoom,
    });
  };

  // Select voyage step
  const selectVoyageStep = (step: VoyageStep, index: number) => {
    setActiveVoyageStepIndex(index);
    const targetLoc = locationsData.find(
      (l) => l.id === step.locationId || l.name.toLowerCase().includes(step.locationName.toLowerCase())
    );
    if (targetLoc) {
      focusOnIsland(targetLoc, 3.2);
    }
  };

  // Get active island landmarks and geography
  const currentIslandGeo: IslandGeography | undefined = useMemo(() => {
    if (!selectedLocation) return undefined;
    return getIslandGeography(selectedLocation.id);
  }, [selectedLocation]);

  // Related locations for the active island
  const relatedLocations = useMemo(() => {
    if (!selectedLocation) return [];
    return locationsData
      .filter(
        (l) =>
          l.id !== selectedLocation.id &&
          (l.seaRegion === selectedLocation.seaRegion ||
            (selectedLocation.subRegion && l.subRegion === selectedLocation.subRegion) ||
            l.arcId === selectedLocation.arcId)
      )
      .slice(0, 6);
  }, [selectedLocation]);

  return (
    <div className="space-y-6">
      {/* 1. Time-Aware Navigation Chronometer Bar */}
      <div className="p-5 rounded-2xl bg-[#081326] border border-amber-500/25 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                Time-Aware Navigation Chronometer
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Chapter {activeChapterThreshold} ({currentMilestone.label})
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              Grand Line Nautical Atlas & Regional Vector Explorer
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => {
                setMilestoneIndex(STORY_MILESTONES.length - 1);
                setUserMangaChapter(1192);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-mono font-medium transition-colors"
            >
              Unveil Full Known World
            </button>
          </div>
        </div>

        {/* Milestone Scrubber Range */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={STORY_MILESTONES.length - 1}
            value={milestoneIndex}
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              setMilestoneIndex(idx);
              setUserMangaChapter(STORY_MILESTONES[idx].chapter);
            }}
            className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono overflow-x-auto pb-1">
            {STORY_MILESTONES.map((m, idx) => (
              <button
                key={m.chapter}
                onClick={() => {
                  setMilestoneIndex(idx);
                  setUserMangaChapter(m.chapter);
                }}
                className={`whitespace-nowrap px-1 transition-colors ${
                  idx === milestoneIndex ? "text-amber-300 font-bold" : "hover:text-slate-200"
                }`}
              >
                {m.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Highlights Unlocked at this point in the voyage */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Saga Clearance:</span>
          {currentMilestone.unlockedHighlights.map((item, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 font-mono text-[11px]"
            >
              ✓ {item}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Follow the Voyage Group Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#081326] border border-amber-500/25 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Ship className="w-4 h-4 text-amber-400" />
            <span className="font-display font-bold text-sm text-slate-100">
              PIRATE VOYAGE MODE: FOLLOW THE CREW
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Selected: <strong className="text-amber-300">{activeVoyageGroup.name}</strong> ({visibleVoyageSteps.length} stops reached)
          </span>
        </div>

        {/* Crew Selector Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {voyageGroupsData.map((group) => (
            <button
              key={group.id}
              onClick={() => {
                setSelectedVoyageGroupId(group.id);
                setActiveVoyageStepIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                selectedVoyageGroupId === group.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <span>{group.flagIcon}</span>
              <span>{group.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Map Controls & Layer Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#081326] border border-amber-500/20 text-xs">
        {/* Region Presets / Quick Focus */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
          <span className="text-slate-400 font-mono uppercase text-[11px] pr-1">Focus:</span>
          {[
            { label: "🌐 All Seas", value: "ALL" },
            { label: "🌊 East Blue", value: "East Blue" },
            { label: "🌴 Paradise", value: "Paradise" },
            { label: "⛩️ Red Line", value: "Red Line" },
            { label: "⚡ New World", value: "New World" },
            { label: "☁️ Sky Ocean", value: "Sky Ocean" },
            { label: "🌀 Calm Belts", value: "Calm Belts" },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => {
                setSeaFilter(r.value);
                focusRegion(r.value);
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all ${
                seaFilter === r.value
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleLayer("crewVoyageRoute")}
            className={`px-2 py-1 rounded-md border text-[11px] font-mono transition-colors ${
              activeLayers.crewVoyageRoute
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-500"
            }`}
          >
            Voyage Path
          </button>
          <button
            onClick={() => toggleLayer("poneglyphs")}
            className={`px-2 py-1 rounded-md border text-[11px] font-mono transition-colors ${
              activeLayers.poneglyphs
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-500"
            }`}
          >
            Poneglyphs
          </button>
          <button
            onClick={() => toggleLayer("landmarks")}
            className={`px-2 py-1 rounded-md border text-[11px] font-mono transition-colors ${
              activeLayers.landmarks
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-500"
            }`}
          >
            Sub-Landmarks
          </button>
          <button
            onClick={() => toggleLayer("calmBelt")}
            className={`px-2 py-1 rounded-md border text-[11px] font-mono transition-colors ${
              activeLayers.calmBelt
                ? "bg-sky-500/20 border-sky-500/50 text-sky-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-500"
            }`}
          >
            Calm Belts
          </button>
        </div>
      </div>

      {/* 4. Main Interactive Map & Side Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vector SVG World Map Canvas Container */}
        <div className="lg:col-span-8 relative rounded-2xl border border-amber-500/25 bg-[#050c18] overflow-hidden shadow-2xl">
          {/* Island Close-up HUD Banner (Visible when an Island is Focused or Zoomed In) */}
          {selectedLocation && (
            <div className="absolute top-3 inset-x-3 z-30 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-500/30 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-display font-bold text-amber-200 text-sm">
                  {selectedLocation.name}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  ({selectedLocation.japaneseName})
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]">
                  {selectedLocation.seaRegion}
                </span>
              </div>

              {/* Sub-Landmark Quick Jump Buttons */}
              <div className="flex items-center space-x-1.5 overflow-x-auto max-w-md scrollbar-none">
                {currentIslandGeo?.landmarks.map((lm) => (
                  <button
                    key={lm.id}
                    onClick={() => focusOnLandmark(lm)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono whitespace-nowrap border transition-all ${
                      selectedLandmark?.id === lm.id
                        ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm"
                        : "bg-slate-900/90 text-slate-300 hover:text-amber-200 border-slate-800"
                    }`}
                  >
                    📍 {lm.name.split(" ")[0]}
                  </button>
                ))}

                <button
                  onClick={resetToOverview}
                  className="px-2.5 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold whitespace-nowrap"
                  title="Return to World View"
                >
                  World Atlas ↺
                </button>
              </div>
            </div>
          )}

          {/* Floating Zoom and Pan Control Tools */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center space-y-1 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-2xl">
            <button
              onClick={() => {
                setIsAnimating(true);
                setZoomLevel((z) => Math.min(4.5, z + 0.35));
              }}
              className="p-1.5 text-slate-300 hover:text-amber-300 rounded hover:bg-slate-850"
              title="Zoom In (or scroll up)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="text-[10px] font-mono text-amber-400 font-bold px-1 select-none">
              {zoomLevel.toFixed(1)}x
            </div>
            <button
              onClick={() => {
                setIsAnimating(true);
                setZoomLevel((z) => Math.max(0.7, z - 0.35));
              }}
              className="p-1.5 text-slate-300 hover:text-amber-300 rounded hover:bg-slate-850"
              title="Zoom Out (or scroll down)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <div className="w-full h-px bg-slate-800 my-1" />

            {/* Directional Pan Buttons */}
            <button
              onClick={() => handlePan(0, 50)}
              className="p-1 text-slate-400 hover:text-amber-300 rounded hover:bg-slate-800"
              title="Pan Up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePan(50, 0)}
                className="p-1 text-slate-400 hover:text-amber-300 rounded hover:bg-slate-800"
                title="Pan Left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetToOverview}
                className="p-1 text-slate-400 hover:text-amber-300 rounded hover:bg-slate-800"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePan(-50, 0)}
                className="p-1 text-slate-400 hover:text-amber-300 rounded hover:bg-slate-800"
                title="Pan Right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => handlePan(0, -50)}
              className="p-1 text-slate-400 hover:text-amber-300 rounded hover:bg-slate-800"
              title="Pan Down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {selectedLocation && (
              <button
                onClick={() => focusOnIsland(selectedLocation, 3.2)}
                className="p-1.5 text-amber-400 hover:text-amber-200 rounded hover:bg-slate-800 mt-1"
                title="Recenter on Island"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive SVG Surface with Zoom & Drag Support */}
          <div
            ref={svgContainerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
            className={`w-full overflow-hidden select-none relative ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-auto min-w-[700px] select-none block"
            >
              <defs>
                <pattern id="nauticalGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path
                    d="M 100 0 L 0 0 0 100"
                    fill="none"
                    stroke="#132338"
                    strokeWidth="0.75"
                    strokeDasharray="3,3"
                  />
                </pattern>
                <linearGradient id="redLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#991b1b" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#dc2626" stopOpacity="1" />
                  <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="calmBeltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity="0.05" />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="skyAtmosphere" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.06" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.06" />
                </linearGradient>

                {/* Island Detailed Gradients */}
                <radialGradient id="islandContourGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="wanoMtFujiGrad" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="35%" stopColor="#94a3b8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.9" />
                </radialGradient>
                <radialGradient id="eggheadDomeGrad" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#0284c7" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.5" />
                </radialGradient>
              </defs>

              {/* Pan and Zoom Group Container with dynamic transform */}
              <g
                transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
                style={{
                  transition: isAnimating ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                }}
              >
                {/* Ocean Grid Background */}
                <rect width="1000" height="600" fill="#050e1d" />
                <rect width="1000" height="600" fill="url(#nauticalGrid)" />

                {/* Sky Realm Atmosphere band */}
                {activeLayers.skyIslands && (
                  <g>
                    <rect x="0" y="0" width="1000" height="85" fill="url(#skyAtmosphere)" />
                    <text
                      x="500"
                      y="22"
                      fill="#38bdf8"
                      fontSize="10"
                      letterSpacing="8"
                      opacity="0.6"
                      textAnchor="middle"
                      fontFamily="Cinzel, serif"
                    >
                      THE WHITE SEA & WHITE-WHITE SEA (7,000M - 10,000M ELEVATION)
                    </text>
                  </g>
                )}

                {/* Calm Belts (North and South borders of Grand Line) */}
                {activeLayers.calmBelt && (
                  <g opacity="0.8">
                    <rect x="0" y="210" width="1000" height="40" fill="url(#calmBeltGrad)" />
                    <text
                      x="160"
                      y="235"
                      fill="#38bdf8"
                      fontSize="8"
                      letterSpacing="3"
                      opacity="0.5"
                      fontFamily="monospace"
                    >
                      NORTH CALM BELT (SEA KINGS NEST)
                    </text>
                    <rect x="0" y="350" width="1000" height="40" fill="url(#calmBeltGrad)" />
                    <text
                      x="160"
                      y="375"
                      fill="#38bdf8"
                      fontSize="8"
                      letterSpacing="3"
                      opacity="0.5"
                      fontFamily="monospace"
                    >
                      SOUTH CALM BELT (AMAZON LILY / SEA KINGS)
                    </text>
                  </g>
                )}

                {/* Major Sea Labels */}
                <text
                  x="180"
                  y="470"
                  fill="#60a5fa"
                  fontSize="15"
                  fontWeight="bold"
                  letterSpacing="4"
                  opacity="0.35"
                  fontFamily="Cinzel, serif"
                >
                  EAST BLUE
                </text>
                <text
                  x="180"
                  y="150"
                  fill="#60a5fa"
                  fontSize="15"
                  fontWeight="bold"
                  letterSpacing="4"
                  opacity="0.3"
                  fontFamily="Cinzel, serif"
                >
                  NORTH BLUE
                </text>
                <text
                  x="750"
                  y="150"
                  fill="#60a5fa"
                  fontSize="15"
                  fontWeight="bold"
                  letterSpacing="4"
                  opacity="0.3"
                  fontFamily="Cinzel, serif"
                >
                  WEST BLUE
                </text>
                <text
                  x="750"
                  y="470"
                  fill="#60a5fa"
                  fontSize="15"
                  fontWeight="bold"
                  letterSpacing="4"
                  opacity="0.3"
                  fontFamily="Cinzel, serif"
                >
                  SOUTH BLUE
                </text>

                {/* Grand Line Paradise & New World Labels */}
                <text
                  x="450"
                  y="305"
                  fill="#f59e0b"
                  fontSize="13"
                  fontWeight="bold"
                  letterSpacing="5"
                  opacity="0.55"
                  fontFamily="Cinzel, serif"
                >
                  PARADISE (GRAND LINE)
                </text>
                <text
                  x="780"
                  y="305"
                  fill="#ec4899"
                  fontSize="13"
                  fontWeight="bold"
                  letterSpacing="5"
                  opacity="0.55"
                  fontFamily="Cinzel, serif"
                >
                  NEW WORLD (SHINSEKAI)
                </text>

                {/* THE RED LINE - Continental Vertical Ridge 1: Reverse Mountain */}
                <path
                  d="M 280,0 L 320,0 L 320,600 L 280,600 Z"
                  fill="url(#redLineGradient)"
                  opacity="0.9"
                />
                <text
                  x="300"
                  y="580"
                  fill="#fecaca"
                  fontSize="11"
                  fontWeight="bold"
                  letterSpacing="4"
                  textAnchor="middle"
                  fontFamily="Cinzel, serif"
                >
                  RED LINE
                </text>
                <text
                  x="300"
                  y="305"
                  fill="#fef08a"
                  fontSize="9"
                  fontWeight="bold"
                  letterSpacing="2"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  REVERSE MTN
                </text>

                {/* THE RED LINE - Continental Vertical Ridge 2: Mary Geoise & Fish-Man Island */}
                <path
                  d="M 600,0 L 640,0 L 640,600 L 600,600 Z"
                  fill="url(#redLineGradient)"
                  opacity="0.9"
                />
                <text
                  x="620"
                  y="580"
                  fill="#fecaca"
                  fontSize="11"
                  fontWeight="bold"
                  letterSpacing="4"
                  textAnchor="middle"
                  fontFamily="Cinzel, serif"
                >
                  RED LINE
                </text>
                <text
                  x="620"
                  y="275"
                  fill="#fef08a"
                  fontSize="9"
                  fontWeight="bold"
                  letterSpacing="1"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  MARY GEOISE
                </text>
                <text
                  x="620"
                  y="330"
                  fill="#38bdf8"
                  fontSize="8"
                  letterSpacing="1"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  -10,000M OCEAN
                </text>

                {/* Active Crew Voyage Route Path Line */}
                {activeLayers.crewVoyageRoute && visibleVoyageSteps.length > 1 && (
                  <g>
                    <path
                      d={visibleVoyageSteps
                        .map(
                          (step, idx) =>
                            `${idx === 0 ? "M" : "L"} ${step.coordinates.x * 10} ${step.coordinates.y * 6}`
                        )
                        .join(" ")}
                      fill="none"
                      stroke={activeVoyageGroup.color}
                      strokeWidth="2.5"
                      strokeDasharray="6,4"
                      opacity="0.85"
                    />
                    {/* Glowing pulse at current active stop */}
                    {visibleVoyageSteps[activeVoyageStepIndex] && (
                      <circle
                        cx={visibleVoyageSteps[activeVoyageStepIndex].coordinates.x * 10}
                        cy={visibleVoyageSteps[activeVoyageStepIndex].coordinates.y * 6}
                        r="18"
                        fill="none"
                        stroke={activeVoyageGroup.color}
                        strokeWidth="2"
                        className="animate-ping"
                        opacity="0.75"
                      />
                    )}
                  </g>
                )}

                {/* HIGH-DETAIL REGIONAL VECTOR GEOGRAPHY LAYER (renders when zoomed or focused) */}
                {selectedLocation && isLocationDiscovered(selectedLocation) && (
                  <g className="transition-opacity duration-300 pointer-events-none">
                    {/* Render customized topographical landmass contour for the selected island */}
                    {(() => {
                      const cx = selectedLocation.coordinates.x * 10;
                      const cy = selectedLocation.coordinates.y * 6;
                      const shape = currentIslandGeo?.shapeType;

                      if (shape === "wano") {
                        return (
                          <g transform={`translate(${cx}, ${cy})`}>
                            {/* Outer Waterfall Cliffs */}
                            <path
                              d="M -34,-12 L -20,-30 L 20,-30 L 34,-12 L 26,24 L -26,24 Z"
                              fill="#15803d"
                              stroke="#86efac"
                              strokeWidth="1"
                              opacity="0.45"
                            />
                            {/* Waterfall rim lines */}
                            <path
                              d="M -34,-12 L -38,-8 M 34,-12 L 38,-8 M -26,24 L -28,28 M 26,24 L 28,28"
                              stroke="#60a5fa"
                              strokeWidth="1"
                              strokeDasharray="2,2"
                            />
                            {/* Mt. Fuji volcanic cone */}
                            <polygon
                              points="-10,-2 0,-18 10,-2"
                              fill="url(#wanoMtFujiGrad)"
                              stroke="#e2e8f0"
                              strokeWidth="0.8"
                            />
                            {/* Onigashima floating skull */}
                            <g transform="translate(6, 18)">
                              <circle r="7" fill="#475569" stroke="#9333ea" strokeWidth="1" />
                              <path d="M -4,-5 L -7,-11 M 4,-5 L 7,-11" stroke="#cbd5e1" strokeWidth="1.2" />
                            </g>
                          </g>
                        );
                      }

                      if (shape === "egg_future") {
                        return (
                          <g transform={`translate(${cx}, ${cy})`}>
                            {/* Floating cloud disc */}
                            <ellipse rx="28" ry="12" fill="#0284c7" opacity="0.3" />
                            <ellipse rx="24" ry="9" fill="url(#eggheadDomeGrad)" stroke="#38bdf8" strokeWidth="1" />
                            {/* Cracked Giant Egg Shell */}
                            <path
                              d="M -12,-8 Q 0,-24 12,-8 Q 6,-2 -12,-8 Z"
                              fill="#f8fafc"
                              stroke="#38bdf8"
                              strokeWidth="0.8"
                              opacity="0.9"
                            />
                            {/* Laser Frontier Dome ring */}
                            <circle r="22" fill="none" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="3,2" />
                          </g>
                        );
                      }

                      if (shape === "desert_river") {
                        return (
                          <g transform={`translate(${cx}, ${cy})`}>
                            {/* Wide sandy desert plateaus */}
                            <path
                              d="M -38,-10 C -25,-26 25,-26 38,-10 C 44,14 18,28 -12,28 C -34,24 -42,5 -38,-10 Z"
                              fill="#ca8a04"
                              stroke="#fde047"
                              strokeWidth="1"
                              opacity="0.35"
                            />
                            {/* Blue Sandora River */}
                            <path
                              d="M -2,-25 Q 6,-5 -4,8 T 4,26"
                              fill="none"
                              stroke="#0284c7"
                              strokeWidth="2"
                              opacity="0.85"
                            />
                          </g>
                        );
                      }

                      if (shape === "fountain_city") {
                        return (
                          <g transform={`translate(${cx}, ${cy})`}>
                            {/* Tiered Fountain Discs */}
                            <circle r="22" fill="#0284c7" opacity="0.25" stroke="#38bdf8" strokeWidth="0.8" />
                            <circle r="14" fill="#0369a1" opacity="0.35" stroke="#38bdf8" strokeWidth="0.8" />
                            <circle r="6" fill="#0c4a6e" opacity="0.5" stroke="#7dd3fc" strokeWidth="0.8" />
                            {/* Sea Train Rail heading East */}
                            <line x1="14" y1="6" x2="35" y2="15" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2,2" />
                          </g>
                        );
                      }

                      if (shape === "sky_cloud") {
                        return (
                          <g transform={`translate(${cx}, ${cy})`}>
                            {/* Billowing cumulus island clouds */}
                            <ellipse cx="-12" cy="0" rx="16" ry="10" fill="#f0f9ff" opacity="0.65" />
                            <ellipse cx="12" cy="2" rx="18" ry="11" fill="#f0f9ff" opacity="0.65" />
                            <ellipse cx="0" cy="-6" rx="20" ry="12" fill="#f0f9ff" opacity="0.75" />
                            {/* Giant Jack beanstalk winding upward */}
                            <path
                              d="M -2,12 Q 6,2 -2,-8 T 3,-24"
                              fill="none"
                              stroke="#16a34a"
                              strokeWidth="2.5"
                            />
                            {/* Golden Belfry glint */}
                            <circle cx="4" cy="-22" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.75" />
                          </g>
                        );
                      }

                      if (shape === "crescent_bay") {
                        return (
                          <g transform={`translate(${cx}, ${cy})`}>
                            {/* Crescent Moon steel harbor bay */}
                            <path
                              d="M -26,-8 A 20 20 0 0 0 26,-8 L 29,-5 A 24 24 0 0 1 -29,-5 Z"
                              fill="#475569"
                              stroke="#94a3b8"
                              strokeWidth="1"
                            />
                            {/* Frozen Bay Ice */}
                            <ellipse rx="18" ry="8" fill="#e0f2fe" opacity="0.4" />
                            {/* Navy HQ Fortress */}
                            <polygon points="-8,-12 8,-12 6,-20 -6,-20" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
                          </g>
                        );
                      }

                      if (shape === "underwater_bubble") {
                        return (
                          <g transform={`translate(${cx}, ${cy})`}>
                            {/* Dual-layered resin underwater bubble */}
                            <circle r="26" fill="#0284c7" opacity="0.25" stroke="#38bdf8" strokeWidth="1.2" />
                            <circle r="22" fill="#38bdf8" opacity="0.15" stroke="#7dd3fc" strokeWidth="0.8" />
                            {/* Roots of Sunlight Tree Eve */}
                            <path d="M 0,-26 L 0,-10 M -8,-24 L -4,-12 M 8,-24 L 4,-12" stroke="#fef08a" strokeWidth="1" opacity="0.7" />
                          </g>
                        );
                      }

                      if (shape === "mangrove") {
                        return (
                          <g transform={`translate(${cx}, ${cy})`}>
                            {/* Mangrove roots spreading out */}
                            <path d="M 0,0 L -18,12 M 0,0 L 18,10 M 0,0 L 0,-16 M 0,0 L -12,-14 M 0,0 L 12,-14" stroke="#78350f" strokeWidth="2" />
                            <circle cx="-8" cy="-6" r="10" fill="#16a34a" opacity="0.4" />
                            <circle cx="8" cy="-4" r="12" fill="#16a34a" opacity="0.4" />
                            {/* Soap bubble floaters */}
                            <circle cx="-12" cy="8" r="4" fill="#a5f3fc" opacity="0.5" stroke="#38bdf8" strokeWidth="0.5" />
                            <circle cx="14" cy="-12" r="3" fill="#a5f3fc" opacity="0.5" stroke="#38bdf8" strokeWidth="0.5" />
                          </g>
                        );
                      }

                      // Generic organic contoured landmass for all other islands
                      return (
                        <g transform={`translate(${cx}, ${cy})`}>
                          <path
                            d="M -24,-8 C -18,-20 18,-20 24,-8 C 28,10 12,20 -10,20 C -22,18 -28,4 -24,-8 Z"
                            fill="#16a34a"
                            stroke="#86efac"
                            strokeWidth="0.8"
                            opacity="0.3"
                          />
                          <ellipse rx="14" ry="7" fill="#065f46" opacity="0.4" />
                        </g>
                      );
                    })()}
                  </g>
                )}

                {/* Island Markers */}
                {visibleLocations.map((loc) => {
                  const posX = loc.coordinates.x * 10;
                  const posY = loc.coordinates.y * 6;
                  const isSelected = selectedLocation?.id === loc.id;
                  const isDiscovered = isLocationDiscovered(loc);

                  return (
                    <g
                      key={loc.id}
                      onClick={() => focusOnIsland(loc, 3.2)}
                      className="cursor-pointer group"
                    >
                      {/* Active Selected Island Aura & Log Pose Crosshair */}
                      {isSelected && (
                        <g>
                          <circle
                            cx={posX}
                            cy={posY}
                            r="22"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                            strokeDasharray="4,2"
                            className="animate-spin-slow"
                          />
                          <circle
                            cx={posX}
                            cy={posY}
                            r="16"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="1.8"
                            className="animate-pulse"
                          />
                        </g>
                      )}

                      {/* Road Poneglyph Crimson Aura */}
                      {activeLayers.poneglyphs && loc.hasPoneglyph && isDiscovered && (
                        <circle
                          cx={posX}
                          cy={posY}
                          r="14"
                          fill={loc.poneglyphType === "Road" ? "#e11d48" : "#8b5cf6"}
                          opacity="0.35"
                        />
                      )}

                      {/* Island Pin Body */}
                      <circle
                        cx={posX}
                        cy={posY}
                        r={loc.isSkyIsland ? 7 : isDiscovered ? 6 : 4.5}
                        fill={
                          !isDiscovered
                            ? "#334155"
                            : loc.isSkyIsland
                            ? "#38bdf8"
                            : loc.hasPoneglyph
                            ? "#fb7185"
                            : loc.accentColor || "#f59e0b"
                        }
                        stroke={isSelected ? "#ffffff" : isDiscovered ? "#0f172a" : "#1e293b"}
                        strokeWidth={isSelected ? "2.5" : "1.5"}
                        className="transition-transform group-hover:scale-125"
                      />

                      {/* Island Name Label */}
                      <text
                        x={posX}
                        y={posY + 16}
                        fill={isSelected ? "#fef08a" : isDiscovered ? "#e2e8f0" : "#64748b"}
                        fontSize="9.5"
                        fontWeight={isSelected ? "bold" : "500"}
                        textAnchor="middle"
                        fontFamily="Cinzel, serif"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {isDiscovered ? loc.name : "Uncharted Territory"}
                      </text>
                    </g>
                  );
                })}

                {/* INTERACTIVE SUB-LANDMARK PINS (Rendered for the selected focused island) */}
                {activeLayers.landmarks &&
                  selectedLocation &&
                  isLocationDiscovered(selectedLocation) &&
                  currentIslandGeo?.landmarks.map((landmark) => {
                    const lX = selectedLocation.coordinates.x * 10 + landmark.relativeCoords.x;
                    const lY = selectedLocation.coordinates.y * 6 + landmark.relativeCoords.y;
                    const isLandmarkSelected = selectedLandmark?.id === landmark.id;

                    return (
                      <g
                        key={landmark.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLandmark(landmark);
                          setDrawerTab("landmarks");
                        }}
                        className="cursor-pointer group"
                      >
                        {isLandmarkSelected && (
                          <circle
                            cx={lX}
                            cy={lY}
                            r="11"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="2"
                            className="animate-ping"
                          />
                        )}

                        {/* Landmark Pin Bubble */}
                        <circle
                          cx={lX}
                          cy={lY}
                          r="5.5"
                          fill={
                            landmark.type === "palace"
                              ? "#eab308"
                              : landmark.type === "battlefield"
                              ? "#f43f5e"
                              : landmark.type === "ruins"
                              ? "#a855f7"
                              : landmark.type === "port"
                              ? "#38bdf8"
                              : landmark.type === "facility"
                              ? "#06b6d4"
                              : "#10b981"
                          }
                          stroke="#020617"
                          strokeWidth="1.5"
                          className="transition-transform group-hover:scale-150"
                        />

                        {/* Landmark Tag Label */}
                        <text
                          x={lX}
                          y={lY - 8}
                          fill={isLandmarkSelected ? "#fbbf24" : "#f1f5f9"}
                          fontSize="7"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                          className="pointer-events-none drop-shadow-md"
                        >
                          {landmark.name}
                        </text>
                      </g>
                    );
                  })}
              </g>

              {/* Map Compass Rose Ornament */}
              <g transform="translate(930, 80) scale(0.65)" opacity="0.6">
                <circle r="40" fill="none" stroke="#78350f" strokeWidth="1.5" strokeDasharray="4,2" />
                <polygon points="0,-45 8,-10 0,0 -8,-10" fill="#f59e0b" />
                <polygon points="0,45 8,10 0,0 -8,10" fill="#78350f" />
                <polygon points="45,0 10,8 0,0 10,-8" fill="#d97706" />
                <polygon points="-45,0 -10,8 0,0 -10,-8" fill="#78350f" />
                <text x="0" y="-50" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="bold" fontFamily="Cinzel">
                  N
                </text>
                <text x="0" y="62" textAnchor="middle" fill="#78350f" fontSize="14" fontWeight="bold" fontFamily="Cinzel">
                  S
                </text>
              </g>
            </svg>
          </div>

          {/* Floating Landmark Detail Inspection Popover (when a sub-landmark is clicked) */}
          {selectedLandmark && (
            <div className="absolute bottom-4 left-4 right-20 z-30 p-3.5 rounded-xl bg-[#09162c]/95 border border-amber-500/40 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {selectedLandmark.type}
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-100">
                      {selectedLandmark.name}
                    </h4>
                    {selectedLandmark.japaneseName && (
                      <span className="text-[11px] font-mono text-slate-400">
                        ({selectedLandmark.japaneseName})
                      </span>
                    )}
                  </div>
                  {selectedLandmark.mangaChapter && (
                    <span className="text-[11px] text-amber-400 font-mono mt-0.5 block">
                      Debut Chapter: Ch. {selectedLandmark.mangaChapter}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedLandmark(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {selectedLandmark.description}
              </p>

              {selectedLandmark.keyEvent && (
                <div className="mt-2 p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-amber-300">
                  <strong>Key Clash / Event: </strong>
                  {selectedLandmark.keyEvent}
                </div>
              )}
            </div>
          )}

          {/* Follow the Voyage Interactive Step Scrubber Drawer */}
          {isVoyageModeOpen && visibleVoyageSteps.length > 0 && (
            <div className="p-4 bg-slate-950/95 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                    Voyage Route Logbook ({activeVoyageGroup.name})
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <button
                    disabled={activeVoyageStepIndex === 0}
                    onClick={() =>
                      selectVoyageStep(
                        visibleVoyageSteps[activeVoyageStepIndex - 1],
                        activeVoyageStepIndex - 1
                      )
                    }
                    className="p-1 rounded bg-slate-850 hover:bg-slate-800 disabled:opacity-30 text-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-slate-400 px-1">
                    Stop {activeVoyageStepIndex + 1} of {visibleVoyageSteps.length}
                  </span>
                  <button
                    disabled={activeVoyageStepIndex >= visibleVoyageSteps.length - 1}
                    onClick={() =>
                      selectVoyageStep(
                        visibleVoyageSteps[activeVoyageStepIndex + 1],
                        activeVoyageStepIndex + 1
                      )
                    }
                    className="p-1 rounded bg-slate-850 hover:bg-slate-800 disabled:opacity-30 text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Step Card */}
              {visibleVoyageSteps[activeVoyageStepIndex] && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Stop #{visibleVoyageSteps[activeVoyageStepIndex].order}
                      </span>
                      <strong className="text-slate-100 font-display text-sm">
                        {visibleVoyageSteps[activeVoyageStepIndex].locationName}
                      </strong>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({visibleVoyageSteps[activeVoyageStepIndex].seaRegion})
                      </span>
                    </div>
                    <span className="text-amber-400 font-mono text-[11px]">
                      {visibleVoyageSteps[activeVoyageStepIndex].chapterRange}{" "}
                      {visibleVoyageSteps[activeVoyageStepIndex].episodeRange
                        ? `· ${visibleVoyageSteps[activeVoyageStepIndex].episodeRange}`
                        : ""}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    {visibleVoyageSteps[activeVoyageStepIndex].description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                    {visibleVoyageSteps[activeVoyageStepIndex].crewMilestone && (
                      <div className="p-2 rounded bg-slate-950/70 border border-slate-800 text-amber-300">
                        <strong>Crew Milestone: </strong>
                        {visibleVoyageSteps[activeVoyageStepIndex].crewMilestone}
                      </div>
                    )}
                    {visibleVoyageSteps[activeVoyageStepIndex].battles &&
                      visibleVoyageSteps[activeVoyageStepIndex].battles.length > 0 && (
                        <div className="p-2 rounded bg-slate-950/70 border border-slate-800 text-rose-300">
                          <strong>Clashes: </strong>
                          {visibleVoyageSteps[activeVoyageStepIndex].battles.join(", ")}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Hierarchical Island Deep-Dive Side Panel Drawer */}
        <div className="lg:col-span-4 rounded-2xl border border-amber-500/25 bg-[#081326] p-6 shadow-2xl space-y-5">
          {selectedLocation ? (
            <div className="space-y-4">
              {/* Header with Badges */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                    Region: {selectedLocation.seaRegion}{" "}
                    {selectedLocation.subRegion ? `· ${selectedLocation.subRegion}` : ""}
                  </span>
                  {selectedLocation.hasPoneglyph && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedLocation.poneglyphType === "Road"
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : "bg-purple-950 text-purple-300 border border-purple-800"
                      }`}
                    >
                      {selectedLocation.poneglyphType} Poneglyph
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-slate-100 mt-1">
                  {selectedLocation.name}
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  {selectedLocation.japaneseName} · Arc:{" "}
                  <strong className="text-amber-300">{selectedLocation.arcName}</strong>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Chapters: {selectedLocation.chapters} · Episodes: {selectedLocation.episodes}
                </div>
              </div>

              {/* Tab Navigation inside Island Drawer */}
              <div className="flex items-center space-x-1 border-b border-slate-800 pb-2 text-xs font-mono overflow-x-auto scrollbar-none">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "landmarks", label: `Landmarks (${currentIslandGeo?.landmarks.length || 0})` },
                  { id: "history", label: "History" },
                  { id: "inhabitants", label: "Characters" },
                  { id: "events", label: "Events" },
                  { id: "lore", label: "Theories" },
                  { id: "related", label: "Related" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setDrawerTab(t.id as any)}
                    className={`px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                      drawerTab === t.id
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview */}
              {drawerTab === "overview" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">
                        Ruler / Authority
                      </span>
                      <span className="text-slate-200 font-medium">
                        {selectedLocation.rulerOrAuthority || "None / Unclaimed"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">
                        Climate
                      </span>
                      <span className="text-slate-200 font-medium">
                        {selectedLocation.climate || "Variable"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedLocation.description}
                  </p>

                  {/* Topography Notes */}
                  {currentIslandGeo?.topographyNotes && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <span className="text-[11px] font-mono font-bold text-amber-400 uppercase block mb-1">
                        Topographical Notes:
                      </span>
                      {currentIslandGeo.topographyNotes}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Landmarks & Regional Sub-Locations */}
              {drawerTab === "landmarks" && (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {currentIslandGeo && currentIslandGeo.landmarks.length > 0 ? (
                    currentIslandGeo.landmarks.map((lm) => (
                      <div
                        key={lm.id}
                        className={`p-3 rounded-xl border transition-all ${
                          selectedLandmark?.id === lm.id
                            ? "bg-amber-500/15 border-amber-500/60 shadow-md"
                            : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-amber-400 font-bold text-xs">
                                {lm.name}
                              </span>
                              {lm.japaneseName && (
                                <span className="text-[10px] font-mono text-slate-400">
                                  ({lm.japaneseName})
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 mt-1 inline-block">
                              {lm.type} · Ch. {lm.mangaChapter}
                            </span>
                          </div>

                          <button
                            onClick={() => focusOnLandmark(lm)}
                            className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-mono font-bold transition-colors whitespace-nowrap"
                          >
                            Locate 📍
                          </button>
                        </div>

                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {lm.description}
                        </p>

                        {lm.keyEvent && (
                          <div className="mt-2 text-[11px] text-amber-300/90 font-mono">
                            <strong>Clash: </strong>
                            {lm.keyEvent}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/50 text-slate-400 text-xs text-center font-mono">
                      No sub-landmarks recorded for this remote island yet.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: History & Void Century */}
              {drawerTab === "history" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 leading-relaxed">
                    <span className="font-bold text-amber-400 block mb-1 text-[11px] uppercase font-mono">
                      Historical Record & Void Century:
                    </span>
                    {selectedLocation.history}
                  </div>

                  {selectedLocation.historyTimeline && selectedLocation.historyTimeline.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">
                        Chronological Milestones:
                      </span>
                      {selectedLocation.historyTimeline.map((item, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-900/70 border border-slate-800">
                          <span className="font-mono font-bold text-amber-300">{item.yearOrEra}: </span>
                          <span className="text-slate-200">{item.event}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Characters */}
              {drawerTab === "inhabitants" && (
                <div className="space-y-3 text-xs">
                  {selectedLocation.inhabitants && selectedLocation.inhabitants.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        Native Races & Inhabitants:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedLocation.inhabitants.map((inh, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">
                            {inh}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLocation.charactersConnected.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                        Connected Characters:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {selectedLocation.charactersConnected.map((charId) => (
                          <button
                            key={charId}
                            onClick={() => onSelectCharacter && onSelectCharacter(charId)}
                            className="p-2 rounded bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-left transition-colors text-slate-300 hover:text-amber-200 capitalize font-medium"
                          >
                            👤 {charId.replace(/_/g, " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Events */}
              {drawerTab === "events" && (
                <div className="space-y-2.5 text-xs max-h-80 overflow-y-auto pr-1">
                  {selectedLocation.importantEvents.map((evt, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-amber-300 font-medium">{evt.title}</strong>
                        <span className="text-[10px] font-mono text-slate-400">Ch. {evt.chapter}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{evt.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 6: Lore & Mysteries */}
              {drawerTab === "lore" && (
                <div className="space-y-3 text-xs">
                  {selectedLocation.relatedMysteries.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                        Related Unsolved Mysteries:
                      </span>
                      <div className="space-y-1.5">
                        {selectedLocation.relatedMysteries.map((mId) => (
                          <button
                            key={mId}
                            onClick={() => onSelectMystery && onSelectMystery(mId)}
                            className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-left transition-colors text-amber-300 font-mono text-[11px] flex items-center justify-between"
                          >
                            <span>❓ {mId.replace(/_/g, " ").toUpperCase()}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLocation.relatedTheories.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                        Related Fan Hypotheses:
                      </span>
                      <div className="space-y-1.5">
                        {selectedLocation.relatedTheories.map((tId) => (
                          <button
                            key={tId}
                            onClick={() => onSelectTheory && onSelectTheory(tId)}
                            className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 text-left transition-colors text-purple-300 font-mono text-[11px] flex items-center justify-between"
                          >
                            <span>🧩 {tId.replace(/_/g, " ").toUpperCase()}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 7: Related Locations in Region */}
              {drawerTab === "related" && (
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Same Sea / Connected Waterways:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto pr-1">
                    {relatedLocations.map((relLoc) => (
                      <button
                        key={relLoc.id}
                        onClick={() => focusOnIsland(relLoc, 3.2)}
                        className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center justify-between text-slate-200 hover:text-amber-200"
                      >
                        <div>
                          <div className="font-medium">{relLoc.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {relLoc.seaRegion} · Ch. {relLoc.firstMangaChapter}
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              Select an island on the map to inspect its archives and topography.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

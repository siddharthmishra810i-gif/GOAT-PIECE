import React, { useEffect, useState } from "react";

/**
 * DecorativeNavigationCompassFrame
 * Adds subtle compass tick markers and coordinate text along the screen edges,
 * anchored to the viewport to frame the workspace with antique naval cartography.
 */
export const DecorativeNavigationCompassFrame: React.FC = () => {
  const [coords, setCoords] = useState({
    lat: "24° 18' N",
    long: "139° 42' E",
    sector: "GRAND LINE · PARADISE",
  });

  // Track cursor dynamically to calculate live marine coordinates along the viewport frame
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      const latDeg = Math.floor(y * 60) - 30;
      const latMin = Math.floor((y * 3600) % 60);
      const longDeg = Math.floor(x * 180);
      const longMin = Math.floor((x * 3600) % 60);

      let sectorName = "GRAND LINE · PARADISE";
      if (x < 0.25) sectorName = y < 0.5 ? "NORTH BLUE SECTOR" : "WEST BLUE SECTOR";
      else if (x > 0.75) sectorName = y < 0.5 ? "EAST BLUE SECTOR" : "SOUTH BLUE SECTOR";
      else if (x > 0.5) sectorName = "GRAND LINE · NEW WORLD";
      else if (Math.abs(y - 0.5) > 0.35) sectorName = "CALM BELT NESTING MARGINS";

      setCoords({
        lat: `${Math.abs(latDeg)}° ${latMin.toString().padStart(2, "0")}' ${latDeg >= 0 ? "N" : "S"}`,
        long: `${longDeg}° ${longMin.toString().padStart(2, "0")}' E`,
        sector: sectorName,
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      id="viewport-compass-frame"
      className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden font-mono text-[9px]"
    >
      {/* ===================================================================== */}
      {/* 1. TOP VIEWPORT EDGE: COMPASS DEGREE TICKS & COORDINATE TEXT         */}
      {/* ===================================================================== */}
      <div className="absolute top-0 inset-x-0 h-4 border-b border-amber-500/20 bg-gradient-to-b from-[#020612]/90 via-[#030917]/40 to-transparent flex items-center justify-between px-4 sm:px-8 text-amber-500/50">
        <div className="flex items-center space-x-2">
          <span className="text-amber-400/80 font-bold tracking-widest text-[8px] sm:text-[9px]">
            ▲ N 000°
          </span>
          <span className="hidden md:inline text-slate-400/60">
            PRIME POLAR MERIDIAN · 0°00'00"
          </span>
        </div>

        {/* Graduated compass tick markers along top border */}
        <div className="flex items-center space-x-4 sm:space-x-8 opacity-70 text-[8px]">
          <span className="hidden sm:inline hover:text-amber-300 transition-colors">
            | 030° E |
          </span>
          <span className="hover:text-amber-300 transition-colors">
            | 060° E · REVERSE MT |
          </span>
          <span className="hidden sm:inline hover:text-amber-300 transition-colors">
            | 090° E |
          </span>
          <span className="hover:text-amber-300 transition-colors">
            | 120° E · MARIEJOIS |
          </span>
          <span className="hidden lg:inline hover:text-amber-300 transition-colors">
            | 150° E |
          </span>
          <span className="hidden sm:inline hover:text-amber-300 transition-colors">
            | 180° E · CALM BELT |
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[8px] sm:text-[9px]">
          <span className="hidden sm:inline text-slate-400/60">SECTOR:</span>
          <span className="text-amber-400/90 font-bold">{coords.sector}</span>
        </div>
      </div>

      {/* Top Edge Tick Marks Ruler */}
      <div className="absolute top-4 inset-x-0 h-1.5 flex justify-between px-2 opacity-30">
        {Array.from({ length: 41 }).map((_, i) => (
          <div
            key={i}
            className={`w-[1px] bg-amber-400 ${
              i % 5 === 0 ? "h-2 bg-amber-300 opacity-90" : "h-1 opacity-50"
            }`}
          />
        ))}
      </div>

      {/* ===================================================================== */}
      {/* 2. BOTTOM VIEWPORT EDGE: LOG POSE COORDINATES & DEPTH SOUNDINGS       */}
      {/* ===================================================================== */}
      <div className="absolute bottom-0 inset-x-0 h-5 border-t border-amber-500/20 bg-gradient-to-t from-[#020612]/95 via-[#030917]/50 to-transparent flex items-center justify-between px-4 sm:px-8 text-amber-500/50">
        <div className="flex items-center space-x-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-amber-400/80 font-bold tracking-widest text-[8px] sm:text-[9px]">
            ▼ S 180°
          </span>
          <span className="hidden md:inline text-slate-400/60">
            DEPTH SOUNDING: 10,000M RYUGU TRENCH
          </span>
        </div>

        {/* Live Magnetic Position Coordinates */}
        <div className="flex items-center space-x-3 sm:space-x-6 text-[8px] sm:text-[9px]">
          <span className="text-slate-300/80">
            LAT: <strong className="text-amber-300 font-normal">{coords.lat}</strong>
          </span>
          <span className="text-slate-300/80">
            LONG: <strong className="text-amber-300 font-normal">{coords.long}</strong>
          </span>
          <span className="hidden sm:inline text-sky-400/70">
            BEARING: LOG POSE STABILIZED
          </span>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-[8px] text-slate-500">
          <span>MAG-VAR: 0°04'W</span>
          <span>·</span>
          <span>VOYAGE VECTOR: 084° ESE</span>
        </div>
      </div>

      {/* Bottom Edge Tick Marks Ruler */}
      <div className="absolute bottom-5 inset-x-0 h-1.5 flex justify-between px-2 opacity-30">
        {Array.from({ length: 41 }).map((_, i) => (
          <div
            key={i}
            className={`w-[1px] bg-amber-400 ${
              i % 5 === 0 ? "h-2 bg-amber-300 opacity-90" : "h-1 opacity-50"
            }`}
          />
        ))}
      </div>

      {/* ===================================================================== */}
      {/* 3. LEFT VIEWPORT EDGE: LATITUDE DEGREES & MARGINAL TICKS              */}
      {/* ===================================================================== */}
      <div className="absolute left-0 inset-y-8 w-5 border-r border-amber-500/15 hidden lg:flex flex-col justify-between py-6 items-center text-[7px] text-amber-500/40 bg-gradient-to-r from-[#020612]/60 to-transparent">
        <span className="text-amber-300/70 font-bold">+60°N</span>
        <span>+45°</span>
        <span>+30°</span>
        <span>+15°</span>
        <span className="text-amber-400 font-bold text-[8px] bg-amber-500/10 px-0.5 rounded">
          00° EQ
        </span>
        <span>-15°</span>
        <span>-30°</span>
        <span>-45°</span>
        <span className="text-amber-300/70 font-bold">-60°S</span>
      </div>

      {/* Vertical tick ticks along left */}
      <div className="absolute left-5 inset-y-12 w-1.5 hidden lg:flex flex-col justify-between opacity-30">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`h-[1px] bg-amber-400 ${
              i % 4 === 0 ? "w-2 bg-amber-300 opacity-90" : "w-1 opacity-50"
            }`}
          />
        ))}
      </div>

      {/* ===================================================================== */}
      {/* 4. RIGHT VIEWPORT EDGE: LONGITUDE / CARTOGRAPHIC MERIDIAN MARGINS     */}
      {/* ===================================================================== */}
      <div className="absolute right-0 inset-y-8 w-5 border-l border-amber-500/15 hidden lg:flex flex-col justify-between py-6 items-center text-[7px] text-amber-500/40 bg-gradient-to-l from-[#020612]/60 to-transparent">
        <span className="text-amber-300/70 font-bold">180°W</span>
        <span>135°W</span>
        <span>090°W</span>
        <span>045°W</span>
        <span className="text-amber-400 font-bold text-[8px] bg-amber-500/10 px-0.5 rounded">
          000° M
        </span>
        <span>045°E</span>
        <span>090°E</span>
        <span>135°E</span>
        <span className="text-amber-300/70 font-bold">180°E</span>
      </div>

      {/* Vertical tick ticks along right */}
      <div className="absolute right-5 inset-y-12 w-1.5 hidden lg:flex flex-col justify-between opacity-30 items-end">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`h-[1px] bg-amber-400 ${
              i % 4 === 0 ? "w-2 bg-amber-300 opacity-90" : "w-1 opacity-50"
            }`}
          />
        ))}
      </div>

      {/* ===================================================================== */}
      {/* 5. FOUR CORNER CARTOGRAPHIC FRAMING BRACKETS & ASTROLABE CROSSHAIRS   */}
      {/* ===================================================================== */}
      {/* Top-Left Corner Bracket */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 flex items-start justify-start p-0.5">
        <span className="text-[6px] text-amber-400/60 font-bold leading-none">
          +090°
        </span>
      </div>

      {/* Top-Right Corner Bracket */}
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500/40 flex items-start justify-end p-0.5">
        <span className="text-[6px] text-amber-400/60 font-bold leading-none">
          +360°
        </span>
      </div>

      {/* Bottom-Left Corner Bracket */}
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500/40 flex items-end justify-start p-0.5">
        <span className="text-[6px] text-amber-400/60 font-bold leading-none">
          -180°
        </span>
      </div>

      {/* Bottom-Right Corner Bracket */}
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500/40 flex items-end justify-end p-0.5">
        <span className="text-[6px] text-amber-400/60 font-bold leading-none">
          -270°
        </span>
      </div>
    </div>
  );
};

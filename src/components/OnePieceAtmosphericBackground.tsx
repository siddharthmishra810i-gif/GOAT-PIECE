import React, { useEffect, useRef, useState, useMemo } from "react";

interface OnePieceAtmosphericBackgroundProps {
  activeTab: string;
}

export const OnePieceAtmosphericBackground: React.FC<OnePieceAtmosphericBackgroundProps> = ({
  activeTab,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [coordinates, setCoordinates] = useState({
    lat: "24° 18' N",
    long: "139° 42' E",
    sea: "Paradise · Grand Line",
  });

  // Track mouse coordinates for gentle optical parallax and dynamic coordinate display
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });

      // Calculate dynamic pseudo-coordinates based on cursor position across the world map
      const latDeg = Math.floor(y * 60) - 30;
      const latMin = Math.floor((y * 3600) % 60);
      const longDeg = Math.floor(x * 180);
      const longMin = Math.floor((x * 3600) % 60);

      let currentSea = "Grand Line · Paradise";
      if (x < 0.25) currentSea = y < 0.5 ? "North Blue Basin" : "West Blue Basin";
      else if (x > 0.75) currentSea = y < 0.5 ? "East Blue Basin" : "South Blue Basin";
      else if (x > 0.5) currentSea = "New World · Grand Line";
      else if (Math.abs(y - 0.5) > 0.35) currentSea = "Calm Belt Margins";

      setCoordinates({
        lat: `${Math.abs(latDeg)}° ${latMin.toString().padStart(2, "0")}' ${latDeg >= 0 ? "N" : "S"}`,
        long: `${longDeg}° ${longMin.toString().padStart(2, "0")}' E`,
        sea: currentSea,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Canvas for organic sea-mist particles and celestial stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize 40 sea-mist luminous particles
    const particleCount = window.innerWidth < 768 ? 20 : 42;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.45 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseVal: Math.random() * Math.PI * 2,
    }));

    // Fixed celestial stars in the upper atmosphere
    const starCount = 35;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.65),
      size: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Render faint celestial stars
      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const currentAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.phase));
        ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render drifting sea-mist particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulseVal += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const dynamicAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulseVal));

        // Soft bioluminescent glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        gradient.addColorStop(0, `rgba(180, 220, 255, ${dynamicAlpha})`);
        gradient.addColorStop(0.5, `rgba(212, 175, 55, ${dynamicAlpha * 0.4})`);
        gradient.addColorStop(1, "rgba(2, 6, 17, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Multi-speed parallax offsets for realistic ocean depth
  const px = mousePos.x - 0.5;
  const py = mousePos.y - 0.5;

  const pDeepOcean = { x: px * 6, y: py * 6 };          // Deepest abyssal baseline (slowest)
  const pWaves = { x: px * 16, y: py * 16 };             // Dark Ocean Waves layer with SVG mask
  const pCurrents = { x: px * -24, y: py * -24 };        // Caustic moonlight & counter-currents (reverse drift)
  const pGrid = { x: px * 12, y: py * 12 };              // Nautical Grid
  const pCartography = { x: px * 36, y: py * 36 };       // Grand Line & Continental Ridge map
  const pReefsAndShadows = { x: px * 50, y: py * 50 };   // Sea Kings & Island Outlines
  const pAtmosphere = { x: px * 68, y: py * 68 };        // Surface Mist & Celestial Particles
  const pDial = { x: px * 10, y: py * 10 };              // Corner Log Pose Dial

  // Section atmosphere mood tints
  const isMysteries = activeTab === "mysteries";
  const isHistory = activeTab === "history" || activeTab === "timeline";
  const isCharacters = activeTab === "characters" || activeTab === "bounties";
  const isTheories = activeTab === "theories";
  const isBattles = activeTab === "battles";
  const isFruits = activeTab === "devilFruits";
  const isWorld = activeTab === "world" || activeTab === "map";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* SVG MASK DEFINITIONS FOR DARK SLOW-MOVING OCEAN WAVES                    */}
      {/* ========================================================================= */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <mask
            id="dark-ocean-waves-mask"
            maskUnits="userSpaceOnUse"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            {/* Vertical fade gradient mask creating depth feathered crests */}
            <linearGradient id="wave-mask-vert-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            <rect width="100%" height="100%" fill="url(#wave-mask-vert-grad)" />

            {/* Undulating rhythmic wave crest cutouts */}
            <g className="animate-wave-mask">
              <path
                d="M -200 420 C 120 370, 360 480, 680 410 C 1000 340, 1240 470, 1560 400 C 1880 330, 2120 460, 2400 390 L 2400 1200 L -200 1200 Z"
                fill="#ffffff"
                opacity="0.9"
              />
              <path
                d="M -200 560 C 180 500, 420 620, 780 540 C 1140 460, 1380 590, 1720 520 C 2060 450, 2280 580, 2400 510 L 2400 1200 L -200 1200 Z"
                fill="#ffffff"
                opacity="0.75"
              />
            </g>
          </mask>
        </defs>
      </svg>

      {/* ========================================================================= */}
      {/* LAYER 1: BASE DEEP OCEAN NAVY GRADIENT WITH SECTION MOOD TRANSITIONS      */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-0 transition-all duration-1000 will-change-transform ${
          isMysteries
            ? "bg-gradient-to-b from-[#01040a] via-[#030914] to-[#010308]"
            : isHistory
            ? "bg-gradient-to-b from-[#050b18] via-[#091224] to-[#040813]"
            : isCharacters
            ? "bg-gradient-to-b from-[#060c18] via-[#0a1426] to-[#040914]"
            : isBattles
            ? "bg-gradient-to-b from-[#040914] via-[#081120] to-[#030712]"
            : isFruits
            ? "bg-gradient-to-b from-[#050a1b] via-[#0a1228] to-[#030714]"
            : "bg-gradient-to-b from-[#020713] via-[#051124] to-[#020610]"
        }`}
        style={{
          transform: `translate(${pDeepOcean.x}px, ${pDeepOcean.y}px)`,
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 2: ANIMATED DARK SLOW-MOVING OCEAN WAVES (SVG MASK & CSS KEYFRAMES)  */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate(${pWaves.x}px, ${pWaves.y}px)`,
          mask: "url(#dark-ocean-waves-mask)",
          WebkitMask: "url(#dark-ocean-waves-mask)",
        }}
      >
        {/* Dark primary ocean wave roll */}
        <div className="absolute -inset-x-48 inset-y-0 animate-ocean-waves-slow opacity-85">
          <svg
            className="w-[125%] h-full"
            viewBox="0 0 2000 1000"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="abyssal-wave-grad-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#040f24" stopOpacity="0.75" />
                <stop offset="35%" stopColor="#020817" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#01040d" stopOpacity="0.98" />
              </linearGradient>
              <linearGradient id="wave-sheen-glow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Primary Abyssal Wave Crest */}
            <path
              d="M 0 430 Q 250 370, 500 420 T 1000 400 T 1500 430 T 2000 390 L 2000 1000 L 0 1000 Z"
              fill="url(#abyssal-wave-grad-1)"
            />
            <path
              d="M 0 430 Q 250 370, 500 420 T 1000 400 T 1500 430 T 2000 390"
              stroke="url(#wave-sheen-glow)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Secondary Deep Swell */}
            <path
              d="M 0 580 Q 300 520, 600 570 T 1200 550 T 1800 580 T 2000 540 L 2000 1000 L 0 1000 Z"
              fill="#020612"
              opacity="0.9"
            />
            <path
              d="M 0 580 Q 300 520, 600 570 T 1200 550 T 1800 580 T 2000 540"
              stroke="rgba(56, 189, 248, 0.12)"
              strokeWidth="1"
              strokeDasharray="12 8"
              fill="none"
            />

            {/* Abyssal Floor */}
            <path
              d="M 0 740 Q 350 690, 700 730 T 1400 710 T 2000 720 L 2000 1000 L 0 1000 Z"
              fill="#010309"
              opacity="0.96"
            />
          </svg>
        </div>

        {/* Counter-drifting oceanic current wave */}
        <div className="absolute -inset-x-48 inset-y-0 animate-ocean-waves-counter opacity-65">
          <svg
            className="w-[125%] h-full"
            viewBox="0 0 2000 1000"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 490 Q 320 540, 640 480 T 1280 510 T 1920 470 L 2000 480 L 2000 1000 L 0 1000 Z"
              fill="#030b1c"
              opacity="0.65"
            />
            <path
              d="M 0 490 Q 320 540, 640 480 T 1280 510 T 1920 470 L 2000 480"
              stroke="rgba(14, 165, 233, 0.16)"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M 0 660 Q 380 710, 760 640 T 1520 680 T 2000 630 L 2000 1000 L 0 1000 Z"
              fill="#010510"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: CINEMATIC AMBIENT LIGHTING (MOONLIGHT SHEEN & OCEAN CURRENTS)    */}
      {/* ========================================================================= */}
      {/* Moonlight sweep across the upper sea (counter-drift parallax) */}
      <div
        className="absolute -top-32 left-1/4 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-sky-400/[0.04] via-amber-300/[0.02] to-transparent blur-3xl transform -translate-x-1/2 pointer-events-none transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate(${pCurrents.x}px, ${pCurrents.y}px)`,
        }}
      />

      {/* Deep Sea Current vortex (Tarai Current / Calm Belt shimmer) */}
      <div
        className="absolute bottom-1/4 -right-24 w-[700px] h-[550px] rounded-full bg-gradient-to-tl from-cyan-900/[0.06] via-blue-950/[0.04] to-transparent blur-3xl pointer-events-none transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate(${pCurrents.x * -0.8}px, ${pCurrents.y * -0.8}px)`,
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 4: FAINT CARTOGRAPHIC GRID & NAUTICAL MERIDIANS                    */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 opacity-[0.4] bg-nautical-grid pointer-events-none transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate(${pGrid.x}px, ${pGrid.y}px)`,
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 5: THE GRAND LINE CARTOGRAPHIC VECTOR MAP (ORIGINAL INTERPRETATION) */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-0 transition-all duration-1000 will-change-transform ${
          isWorld ? "opacity-35" : "opacity-20"
        }`}
        style={{
          transform: `translate(${pCartography.x}px, ${pCartography.y}px)`,
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1600 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Red Line mountain ridge gradient */}
            <linearGradient id="redline-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a2a1d" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#8f3224" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#682116" stopOpacity="0.4" />
            </linearGradient>

            {/* Grand Line current stream gradient */}
            <linearGradient id="grandline-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
            </linearGradient>

            {/* Calm Belt bounds pattern */}
            <pattern id="calmbelt-stripes" width="40" height="40" patternUnits="userSpaceOnUse">
              <line
                x1="0"
                y1="0"
                x2="40"
                y2="40"
                stroke="rgba(56, 189, 248, 0.04)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {/* 1. THE FOUR BLUES WATERMARKS & CARTOGRAPHIC SECTORS */}
          <text
            x="240"
            y="260"
            fill="rgba(212, 175, 55, 0.12)"
            fontFamily="Cinzel, serif"
            fontSize="28"
            fontWeight="bold"
            letterSpacing="8"
          >
            NORTH BLUE
          </text>
          <text
            x="240"
            y="780"
            fill="rgba(212, 175, 55, 0.12)"
            fontFamily="Cinzel, serif"
            fontSize="28"
            fontWeight="bold"
            letterSpacing="8"
          >
            WEST BLUE
          </text>
          <text
            x="1180"
            y="260"
            fill="rgba(212, 175, 55, 0.12)"
            fontFamily="Cinzel, serif"
            fontSize="28"
            fontWeight="bold"
            letterSpacing="8"
          >
            EAST BLUE
          </text>
          <text
            x="1180"
            y="780"
            fill="rgba(212, 175, 55, 0.12)"
            fontFamily="Cinzel, serif"
            fontSize="28"
            fontWeight="bold"
            letterSpacing="8"
          >
            SOUTH BLUE
          </text>

          {/* 2. CALM BELT BOUNDARIES (Twin bands flanking the Grand Line) */}
          <rect x="0" y="410" width="1600" height="40" fill="url(#calmbelt-stripes)" />
          <line
            x1="0"
            y1="410"
            x2="1600"
            y2="410"
            stroke="rgba(56, 189, 248, 0.14)"
            strokeDasharray="8 6"
            strokeWidth="1"
          />
          <text
            x="80"
            y="435"
            fill="rgba(56, 189, 248, 0.2)"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
            letterSpacing="4"
          >
            CALM BELT · NORTHERN BOUNDARY [NESTING ZONE OF SEA KINGS]
          </text>

          <rect x="0" y="550" width="1600" height="40" fill="url(#calmbelt-stripes)" />
          <line
            x1="0"
            y1="590"
            x2="1600"
            y2="590"
            stroke="rgba(56, 189, 248, 0.14)"
            strokeDasharray="8 6"
            strokeWidth="1"
          />
          <text
            x="80"
            y="575"
            fill="rgba(56, 189, 248, 0.2)"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
            letterSpacing="4"
          >
            CALM BELT · SOUTHERN BOUNDARY [WINDLESS SEA]
          </text>

          {/* 3. THE GRAND LINE EQUATORIAL OCEAN HIGHWAY (PARADISE & NEW WORLD) */}
          <line
            x1="0"
            y1="500"
            x2="1600"
            y2="500"
            stroke="rgba(212, 175, 55, 0.25)"
            strokeWidth="1.5"
          />
          <text
            x="380"
            y="492"
            fill="rgba(212, 175, 55, 0.3)"
            fontFamily="Cinzel, serif"
            fontSize="13"
            fontWeight="bold"
            letterSpacing="6"
          >
            GRAND LINE · PARADISE SECTOR
          </text>
          <text
            x="1120"
            y="492"
            fill="rgba(212, 175, 55, 0.3)"
            fontFamily="Cinzel, serif"
            fontSize="13"
            fontWeight="bold"
            letterSpacing="6"
          >
            NEW WORLD · SHINSEKAI REACHES
          </text>

          {/* 4. THE RED LINE: TOWERING VERTICAL CONTINENT RIDGE */}
          {/* First Red Line Crossing (Reverse Mountain Meridian ~ X: 150) */}
          <path
            d="M 120 0 Q 140 250 135 500 Q 130 750 150 1000 L 190 1000 Q 170 750 175 500 Q 180 250 160 0 Z"
            fill="url(#redline-grad)"
          />
          <text
            x="145"
            y="120"
            fill="rgba(225, 112, 85, 0.4)"
            fontFamily="Cinzel, serif"
            fontSize="11"
            letterSpacing="3"
            transform="rotate(90 145 120)"
          >
            RED LINE · CONTINENT RIDGE
          </text>

          {/* Reverse Mountain Canals intersection */}
          <circle
            cx="155"
            cy="500"
            r="16"
            stroke="rgba(212, 175, 55, 0.4)"
            strokeWidth="1.5"
            fill="rgba(8, 18, 36, 0.7)"
          />
          <path
            d="M 110 470 L 155 500 L 110 530"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1"
            fill="none"
          />
          <text
            x="180"
            y="525"
            fill="rgba(212, 175, 55, 0.45)"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
          >
            REVERSE MOUNTAIN [PRIME MERIDIAN 0°00']
          </text>

          {/* Second Red Line Crossing (Holy Land Mariejois & Fishman Island ~ X: 900) */}
          <path
            d="M 880 0 Q 900 250 895 500 Q 890 750 910 1000 L 950 1000 Q 930 750 935 500 Q 940 250 920 0 Z"
            fill="url(#redline-grad)"
          />
          <circle
            cx="915"
            cy="500"
            r="14"
            stroke="rgba(212, 175, 55, 0.5)"
            strokeWidth="1.5"
            fill="rgba(8, 18, 36, 0.7)"
          />
          <text
            x="940"
            y="485"
            fill="rgba(212, 175, 55, 0.4)"
            fontFamily="Cinzel, serif"
            fontSize="10"
            fontWeight="bold"
          >
            MARIEJOIS [RED PORT]
          </text>
          <text
            x="940"
            y="518"
            fill="rgba(56, 189, 248, 0.4)"
            fontFamily="JetBrains Mono, monospace"
            fontSize="8"
          >
            RYUGU KINGDOM [-10,000M DEPTH]
          </text>

          {/* 5. NAUTICAL RHUMB NAVIGATION LINES (Wind Rose Radiation Rays) */}
          <g stroke="rgba(212, 175, 55, 0.08)" strokeWidth="0.75" strokeDasharray="6 4">
            {/* Paradise Astrolabe Center */}
            <line x1="520" y1="500" x2="0" y2="0" />
            <line x1="520" y1="500" x2="1040" y2="0" />
            <line x1="520" y1="500" x2="1040" y2="1000" />
            <line x1="520" y1="500" x2="0" y2="1000" />
            <line x1="520" y1="500" x2="520" y2="0" />
            <line x1="520" y1="500" x2="520" y2="1000" />
            <circle cx="520" cy="500" r="160" fill="none" strokeWidth="0.5" />
            <circle cx="520" cy="500" r="280" fill="none" strokeWidth="0.5" />

            {/* New World Astrolabe Center */}
            <line x1="1260" y1="500" x2="740" y2="0" />
            <line x1="1260" y1="500" x2="1600" y2="160" />
            <line x1="1260" y1="500" x2="1600" y2="840" />
            <line x1="1260" y1="500" x2="740" y2="1000" />
            <line x1="1260" y1="500" x2="1260" y2="0" />
            <line x1="1260" y1="500" x2="1260" y2="1000" />
            <circle cx="1260" cy="500" r="160" fill="none" strokeWidth="0.5" />
            <circle cx="1260" cy="500" r="280" fill="none" strokeWidth="0.5" />
          </g>

          {/* 6. ISLAND ARCHIPELAGO DOTS & REEFS */}
          <g fill="rgba(212, 175, 55, 0.35)">
            {/* Paradise Islands */}
            <circle cx="210" cy="505" r="3.5" />
            <circle cx="280" cy="485" r="4" />
            <circle cx="360" cy="515" r="3.5" />
            <circle cx="450" cy="495" r="5" />
            <circle cx="560" cy="520" r="4" />
            <circle cx="680" cy="480" r="4.5" />
            <circle cx="790" cy="500" r="6" />
            <text
              x="790"
              y="522"
              fill="rgba(212, 175, 55, 0.3)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="8"
              textAnchor="middle"
            >
              SABAODY ARCHIPELAGO
            </text>

            {/* New World Islands */}
            <circle cx="1020" cy="510" r="4.5" />
            <circle cx="1110" cy="485" r="5" />
            <circle cx="1220" cy="525" r="4.5" />
            <circle cx="1340" cy="490" r="6" />
            <text
              x="1340"
              y="512"
              fill="rgba(212, 175, 55, 0.3)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="8"
              textAnchor="middle"
            >
              WANO COUNTRY
            </text>
            <circle cx="1450" cy="515" r="5" />
            <circle cx="1540" cy="495" r="4" />
            <text
              x="1540"
              y="480"
              fill="rgba(212, 175, 55, 0.3)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="8"
              textAnchor="middle"
            >
              LODESTAR REACH
            </text>
          </g>

          {/* 7. ANIMATED GRAND LINE LOG POSE SHIP ROUTE */}
          <path
            d="M 155 500 Q 240 480 320 510 T 480 490 T 640 515 T 790 500 L 915 500 Q 1050 485 1180 520 T 1340 490 T 1540 500"
            stroke="url(#grandline-grad)"
            strokeWidth="2"
            strokeDasharray="10 14"
            fill="none"
            className="animate-grandline-flow"
          />

          {/* Faint Sea King underwater shadows in Calm Belts */}
          <g fill="rgba(12, 32, 60, 0.35)" opacity="0.4">
            <ellipse cx="420" cy="425" rx="35" ry="8" transform="rotate(-5 420 425)" />
            <ellipse cx="1200" cy="430" rx="45" ry="10" transform="rotate(8 1200 430)" />
            <ellipse cx="650" cy="570" rx="40" ry="9" transform="rotate(3 650 570)" />
            <ellipse cx="1400" cy="575" rx="50" ry="11" transform="rotate(-6 1400 575)" />
          </g>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 5: ORGANIC OCEAN WAVE SWELLS (ANIMATED SVG SWAYS)                    */}
      {/* ========================================================================= */}
      <div className="absolute inset-x-0 bottom-0 h-96 opacity-15 pointer-events-none">
        {/* Upper wave swell */}
        <svg
          className="absolute inset-0 w-full h-full animate-ocean-swell"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(14, 34, 68, 0.4)"
            d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Lower wave swell with reverse timing */}
        <svg
          className="absolute inset-0 w-full h-full animate-ocean-swell-rev"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(6, 18, 38, 0.6)"
            d="M0,96L60,117.3C120,139,240,181,360,192C480,203,600,181,720,165.3C840,149,960,139,1080,149.3C1200,160,1320,192,1380,208L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 6: SECTION-SPECIFIC ATMOSPHERIC SILHOUETTES & RUNES                 */}
      {/* ========================================================================= */}
      {/* A. MYSTERIES SECTION: Faint Poneglyph stone blocks & fictional ancient glyphs */}
      {isMysteries && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-25">
          <div className="absolute right-12 top-1/3 w-80 h-80 border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.04] to-transparent p-6 rounded-lg rotate-3 shadow-2xl">
            <div className="text-[10px] font-mono text-amber-500/40 uppercase tracking-widest mb-3">
              ■ CUBIC STELE INSCRIPTION // VOID CENTURY GLYPHS
            </div>
            <div className="grid grid-cols-6 gap-2 text-amber-400/20 font-mono text-xs select-none">
              {["◬", "◈", "◇", "◫", "◰", "◱", "◲", "◳", "⬡", "⬢", "⬟", "⬠", "⊡", "⊟", "⊠", "⊞", "⊿", "▲", "▼", "◆", "▣", "▤", "▥", "▦"].map(
                (g, idx) => (
                  <span key={idx} className="flex items-center justify-center p-1 border border-amber-500/10">
                    {g}
                  </span>
                )
              )}
            </div>
            <div className="mt-4 border-t border-amber-500/15 pt-2 text-[9px] text-amber-500/30 font-mono">
              GEOMETRIC UNBREAKABLE RECORD STONE · 800-YEAR WEATHERING
            </div>
          </div>
        </div>
      )}

      {/* B. HISTORY & TIMELINE: Ancient architectural stone ruins silhouette */}
      {isHistory && (
        <div className="absolute bottom-0 inset-x-0 h-64 transition-opacity duration-1000 opacity-15">
          <svg className="w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none" fill="none">
            {/* Silhouettes of ancient pillars, sunken stone arches, and obelisks */}
            <rect x="120" y="80" width="30" height="220" fill="rgba(212, 175, 55, 0.4)" />
            <rect x="180" y="50" width="35" height="250" fill="rgba(212, 175, 55, 0.45)" />
            <path d="M 100 80 L 230 80 L 230 100 L 100 100 Z" fill="rgba(212, 175, 55, 0.4)" />
            <polygon points="650,140 700,40 750,140" fill="rgba(212, 175, 55, 0.35)" />
            <rect x="685" y="140" width="30" height="160" fill="rgba(212, 175, 55, 0.35)" />
            <rect x="940" y="90" width="25" height="210" fill="rgba(212, 175, 55, 0.4)" />
            <rect x="1000" y="110" width="30" height="190" fill="rgba(212, 175, 55, 0.35)" />
          </svg>
        </div>
      )}

      {/* C. CHARACTERS & BOUNTIES: Faint Wanted poster paper fiber & Marine Seal stamp */}
      {isCharacters && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-15">
          <div className="absolute right-8 bottom-24 w-72 h-72 rounded-full border-2 border-dashed border-amber-600/30 flex items-center justify-center rotate-12">
            <div className="text-center font-serif text-amber-500/35 uppercase">
              <div className="text-[9px] font-mono tracking-widest">WORLD GOVERNMENT</div>
              <div className="text-xl font-black tracking-widest my-1">SEAL OF JUSTICE</div>
              <div className="text-[8px] font-mono">DEAD OR ALIVE LEDGER</div>
            </div>
          </div>
        </div>
      )}

      {/* D. THEORIES: Investigation board red connecting strings */}
      {isTheories && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="20%"
              y1="35%"
              x2="45%"
              y2="55%"
              stroke="rgba(239, 68, 68, 0.3)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <line
              x1="45%"
              y1="55%"
              x2="75%"
              y2="40%"
              stroke="rgba(239, 68, 68, 0.3)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <line
              x1="75%"
              y1="40%"
              x2="60%"
              y2="75%"
              stroke="rgba(239, 68, 68, 0.3)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <circle cx="20%" cy="35%" r="4" fill="rgba(239, 68, 68, 0.5)" />
            <circle cx="45%" cy="55%" r="4" fill="rgba(239, 68, 68, 0.5)" />
            <circle cx="75%" cy="40%" r="4" fill="rgba(239, 68, 68, 0.5)" />
            <circle cx="60%" cy="75%" r="4" fill="rgba(239, 68, 68, 0.5)" />
          </svg>
        </div>
      )}

      {/* E. DEVIL FRUITS: Swirling spiral pattern motifs */}
      {isFruits && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <g stroke="rgba(192, 132, 252, 0.25)" strokeWidth="1.5" fill="none">
              <path d="M 200 200 A 30 30 0 0 1 230 230 A 20 20 0 0 1 210 250 A 10 10 0 0 1 200 240" />
              <path d="M 1200 650 A 40 40 0 0 1 1240 690 A 30 30 0 0 1 1210 720 A 15 15 0 0 1 1195 705" />
              <path d="M 850 180 A 35 35 0 0 1 885 215 A 25 25 0 0 1 860 240" />
            </g>
          </svg>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LAYER 7: CANVAS-BASED SEA MIST & BIOLUMINESCENT PARTICLES (ATMOSPHERE PARALLAX) */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate(${pAtmosphere.x}px, ${pAtmosphere.y}px)`,
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* CORNER ORNAMENTS: VINTAGE CARTOUCHE, DEN DEN MUSHI, & ROTATING LOG POSE    */}
      {/* ========================================================================= */}
      {/* Top-Left Corner: Antique Oceanographic Cartouche */}
      <div
        className="absolute top-6 left-6 hidden md:block opacity-40 hover:opacity-80 transition-all duration-500 will-change-transform"
        style={{
          transform: `translate(${pDial.x}px, ${pDial.y}px)`,
        }}
      >
        <div className="p-2 border border-amber-500/20 bg-[#06101e]/80 rounded text-[9px] font-mono leading-tight">
          <div className="font-serif font-bold text-amber-400/90 tracking-widest text-[10px]">
            ATLAS NAUTICA
          </div>
          <div className="text-slate-400 text-[8px] mt-0.5">
            GRAND LINE & FOUR SEAS CARTOGRAPHY
          </div>
          <div className="text-[7px] text-amber-500/60 font-mono mt-1">
            ARCHIVUM HISTORIA CH. 1 - 1100+
          </div>
        </div>
      </div>

      {/* Top-Right Corner: Den Den Mushi Acoustic Beacon Monitor */}
      <div
        className="absolute top-6 right-6 hidden md:block opacity-40 hover:opacity-80 transition-all duration-500 will-change-transform"
        style={{
          transform: `translate(${pDial.x * -1}px, ${pDial.y}px)`,
        }}
      >
        <div className="flex items-center space-x-2 px-2.5 py-1.5 border border-amber-500/20 bg-[#06101e]/80 rounded text-[8px] font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-den-den-pulse" />
          <div>
            <span className="text-amber-400 font-bold">DEN DEN BEACON:</span>
            <span className="text-slate-300 ml-1">TRANSMITTING</span>
          </div>
        </div>
      </div>

      {/* Bottom-Left Corner: Antique Rotating Log Pose Dial */}
      <div
        className="absolute bottom-8 left-8 hidden lg:block opacity-35 hover:opacity-75 transition-all duration-500 will-change-transform"
        style={{
          transform: `translate(${pDial.x}px, ${pDial.y}px)`,
        }}
      >
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer Glass Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 bg-radial-gradient from-amber-500/[0.03] to-transparent shadow-lg shadow-amber-950/40" />

          {/* Rotating Astrolabe Degree Ring */}
          <div className="absolute inset-1.5 rounded-full border border-dashed border-amber-500/30 animate-slow-rotate" />

          {/* Inner Cardinal Ring */}
          <div className="absolute inset-4 rounded-full border border-amber-500/20 flex items-center justify-center text-[7px] font-serif font-bold text-amber-400">
            <span className="absolute top-0.5">N</span>
            <span className="absolute bottom-0.5">S</span>
            <span className="absolute right-1">E</span>
            <span className="absolute left-1">W</span>
          </div>

          {/* Swaying Brass Log Pose Needle */}
          <div className="absolute w-1 h-16 animate-logpose-needle flex flex-col justify-between items-center pointer-events-none">
            {/* North Magnetic Arrow Head */}
            <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[18px] border-b-rose-500 filter drop-shadow" />
            {/* Center Pivot Jewel */}
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-750 shadow-inner" />
            {/* South Magnetic Arrow Tail */}
            <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[18px] border-t-amber-300 filter drop-shadow" />
          </div>

          {/* Subtitle */}
          <div className="absolute -bottom-4 text-[7px] font-mono uppercase tracking-widest text-amber-500/60 whitespace-nowrap">
            LOG POSE MAGNETIC DIAL
          </div>
        </div>
      </div>
    </div>
  );
};

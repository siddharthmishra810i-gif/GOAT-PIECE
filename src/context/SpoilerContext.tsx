import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type VoyageMode = "caught_up" | "manga" | "anime" | "custom";

export interface VoyagePreset {
  id: string;
  label: string;
  mangaChapter: number;
  animeEpisode: number;
  description: string;
}

export const VOYAGE_PRESETS: VoyagePreset[] = [
  { id: "east_blue", label: "East Blue (Loguetown)", mangaChapter: 100, animeEpisode: 53, description: "Entering the Grand Line" },
  { id: "alabasta", label: "Alabasta Climax", mangaChapter: 217, animeEpisode: 130, description: "Crocodile & Ancient Weapons" },
  { id: "enies_lobby", label: "Enies Lobby", mangaChapter: 430, animeEpisode: 312, description: "Declaration of War & Ohara" },
  { id: "marineford", label: "Summit War (Marineford)", mangaChapter: 580, animeEpisode: 490, description: "Paramount War & Ace" },
  { id: "timeskip", label: "The 3D2Y Timeskip", mangaChapter: 597, animeEpisode: 516, description: "Two-year training period" },
  { id: "dressrosa", label: "Dressrosa Grand Fleet", mangaChapter: 801, animeEpisode: 746, description: "Gear 4 & Grand Fleet" },
  { id: "wano", label: "Wano Country Climax", mangaChapter: 1057, animeEpisode: 1085, description: "Gear 5 Nika & New Emperors" },
  { id: "caught_up", label: "Fully Caught Up (Egghead / Elbaf)", mangaChapter: 1130, animeEpisode: 1125, description: "Zero restrictions" },
];

export interface SpoilerContextType {
  voyageMode: VoyageMode;
  userMangaChapter: number;
  userAnimeEpisode: number;
  showAllSpoilers: boolean;
  setVoyageMode: (mode: VoyageMode) => void;
  setUserMangaChapter: (chapter: number) => void;
  setUserAnimeEpisode: (episode: number) => void;
  setShowAllSpoilers: (show: boolean) => void;
  applyPreset: (preset: VoyagePreset) => void;
  isSpoiled: (chapter?: number, episode?: number) => boolean;
  getSpoilerBadge: (chapter?: number, episode?: number) => { isSpoiled: boolean; text: string };
  maskTextIfSpoiled: (text: string, chapter?: number, episode?: number) => string;
}

const SpoilerContext = createContext<SpoilerContextType | undefined>(undefined);

const STORAGE_KEY_CHAPTER = "gla_user_manga_chapter";
const STORAGE_KEY_EPISODE = "gla_user_anime_episode";
const STORAGE_KEY_MODE = "gla_voyage_mode";
const STORAGE_KEY_OVERRIDE = "gla_show_all_spoilers";

export const SpoilerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userMangaChapter, setUserMangaChapterState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CHAPTER);
    return saved ? parseInt(saved, 10) : 1130; // default caught up for rich browsing, adjustable anytime
  });

  const [userAnimeEpisode, setUserAnimeEpisodeState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EPISODE);
    return saved ? parseInt(saved, 10) : 1125;
  });

  const [voyageMode, setVoyageModeState] = useState<VoyageMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MODE) as VoyageMode;
    return saved || "caught_up";
  });

  const [showAllSpoilers, setShowAllSpoilersState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_OVERRIDE);
    return saved === "true";
  });

  const setUserMangaChapter = (ch: number) => {
    setUserMangaChapterState(ch);
    localStorage.setItem(STORAGE_KEY_CHAPTER, ch.toString());
  };

  const setUserAnimeEpisode = (ep: number) => {
    setUserAnimeEpisodeState(ep);
    localStorage.setItem(STORAGE_KEY_EPISODE, ep.toString());
  };

  const setVoyageMode = (mode: VoyageMode) => {
    setVoyageModeState(mode);
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  };

  const setShowAllSpoilers = (override: boolean) => {
    setShowAllSpoilersState(override);
    localStorage.setItem(STORAGE_KEY_OVERRIDE, override ? "true" : "false");
  };

  const applyPreset = (preset: VoyagePreset) => {
    setUserMangaChapter(preset.mangaChapter);
    setUserAnimeEpisode(preset.animeEpisode);
    if (preset.id === "caught_up") {
      setVoyageMode("caught_up");
    } else {
      setVoyageMode("custom");
    }
  };

  const isSpoiled = (chapter?: number, episode?: number): boolean => {
    if (showAllSpoilers) return false;
    if (voyageMode === "caught_up") return false;

    if (voyageMode === "anime") {
      if (episode !== undefined) {
        return episode > userAnimeEpisode;
      }
      // If only chapter given, estimate anime episode ~ chapter
      if (chapter !== undefined) {
        return chapter > userAnimeEpisode;
      }
      return false;
    }

    // Default or manga mode
    if (chapter !== undefined) {
      return chapter > userMangaChapter;
    }
    if (episode !== undefined) {
      return episode > userAnimeEpisode;
    }
    return false;
  };

  const getSpoilerBadge = (chapter?: number, episode?: number) => {
    const spoiled = isSpoiled(chapter, episode);
    if (!spoiled) return { isSpoiled: false, text: "Safe for You" };
    return {
      isSpoiled: true,
      text: chapter ? `Revealed in Ch. ${chapter}` : episode ? `Revealed in Ep. ${episode}` : "Spoiler",
    };
  };

  const maskTextIfSpoiled = (text: string, chapter?: number, episode?: number): string => {
    if (isSpoiled(chapter, episode)) {
      return "[SPOILER PROTECTED - Unlocks beyond your current voyage]";
    }
    return text;
  };

  return (
    <SpoilerContext.Provider
      value={{
        voyageMode,
        userMangaChapter,
        userAnimeEpisode,
        showAllSpoilers,
        setVoyageMode,
        setUserMangaChapter,
        setUserAnimeEpisode,
        setShowAllSpoilers,
        applyPreset,
        isSpoiled,
        getSpoilerBadge,
        maskTextIfSpoiled,
      }}
    >
      {children}
    </SpoilerContext.Provider>
  );
};

export const useSpoiler = (): SpoilerContextType => {
  const context = useContext(SpoilerContext);
  if (!context) {
    throw new Error("useSpoiler must be used within a SpoilerProvider");
  }
  return context;
};

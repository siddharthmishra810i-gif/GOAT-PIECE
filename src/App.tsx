import React, { useState } from "react";
import { SpoilerProvider } from "./context/SpoilerContext";
import { Navbar } from "./components/Navbar";
import { WorldMap } from "./components/WorldMap";
import { CharacterDatabase } from "./components/CharacterDatabase";
import { MysteriesAndLore } from "./components/MysteriesAndLore";
import { TheoriesExplorer } from "./components/TheoriesExplorer";
import { KnowledgeGraph } from "./components/KnowledgeGraph";
import { TimelineView } from "./components/TimelineView";
import { ForeshadowingShowcase } from "./components/ForeshadowingShowcase";
import { AiScholar } from "./components/AiScholar";
import { SearchModal } from "./components/SearchModal";
import { Footer } from "./components/Footer";
import { DataArchitectureDashboard } from "./components/DataArchitectureDashboard";
import { BountyEvolutionView } from "./components/BountyEvolutionView";
import { BattleExplorerView } from "./components/BattleExplorerView";
import { ChapterRevealsView } from "./components/ChapterRevealsView";
import { PersonalProgressView } from "./components/PersonalProgressView";
import { DevilFruitEncyclopediaView } from "./components/DevilFruitEncyclopediaView";
import { FactionsExplorerView } from "./components/FactionsExplorerView";
import { DiscoveryModeModal } from "./components/DiscoveryModeModal";
import { OnePieceAtmosphericBackground } from "./components/OnePieceAtmosphericBackground";
import { DecorativeNavigationCompassFrame } from "./components/DecorativeNavigationCompassFrame";

export default function App() {
  // World Map is the visual centerpiece home experience
  const [activeTab, setActiveTab] = useState<string>("world");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState<boolean>(false);

  // Cross-entity navigation state
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedMysteryId, setSelectedMysteryId] = useState<string | null>(null);
  const [selectedTheoryId, setSelectedTheoryId] = useState<string | null>(null);

  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setActiveTab("characters");
  };

  const handleSelectLocation = (locationId: string) => {
    setSelectedLocationId(locationId);
    setActiveTab("world");
  };

  const handleSelectMystery = (mysteryId: string) => {
    setSelectedMysteryId(mysteryId);
    setActiveTab("mysteries");
  };

  const handleSelectTheory = (theoryId: string) => {
    setSelectedTheoryId(theoryId);
    setActiveTab("theories");
  };

  const handleSelectSearchResult = (tab: string, id: string) => {
    if (tab === "characters") setSelectedCharacterId(id);
    if (tab === "map" || tab === "world") {
      setSelectedLocationId(id);
      setActiveTab("world");
      return;
    }
    if (tab === "mysteries") setSelectedMysteryId(id);
    if (tab === "theories") setSelectedTheoryId(id);
    setActiveTab(tab);
  };

  const handleDiscoveryNavigate = (tab: string, id?: string) => {
    if (id) {
      if (tab === "characters") setSelectedCharacterId(id);
      if (tab === "map" || tab === "world") setSelectedLocationId(id);
      if (tab === "mysteries") setSelectedMysteryId(id);
      if (tab === "theories") setSelectedTheoryId(id);
    }
    if (tab === "map") setActiveTab("world");
    else setActiveTab(tab);
  };

  return (
    <SpoilerProvider>
      <div className="min-h-screen relative text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
        {/* Immersive Living One Piece World Atmospheric Background */}
        <OnePieceAtmosphericBackground activeTab={activeTab} />

        {/* Decorative Compass Frame with subtle edge ticks and coordinate text anchored to viewport */}
        <DecorativeNavigationCompassFrame />

        {/* Navigation Bar with Voyage Capsule and Discovery Log Pose */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenDiscovery={() => setIsDiscoveryOpen(true)}
          onSelectCharacter={handleSelectCharacter}
          onSelectLocation={handleSelectLocation}
        />

        {/* Global Search Dialog Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectResult={handleSelectSearchResult}
        />

        {/* Discovery Mode "Show Me Something Interesting" Randomizer */}
        <DiscoveryModeModal
          isOpen={isDiscoveryOpen}
          onClose={() => setIsDiscoveryOpen(false)}
          onNavigate={handleDiscoveryNavigate}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12">
          {(activeTab === "world" || activeTab === "map") && (
            <WorldMap
              onSelectCharacter={handleSelectCharacter}
              onSelectMystery={handleSelectMystery}
              onSelectTheory={handleSelectTheory}
              selectedLocationId={selectedLocationId}
            />
          )}

          {(activeTab === "crews" || activeTab === "factions") && <FactionsExplorerView />}

          {activeTab === "bounties" && <BountyEvolutionView />}

          {activeTab === "battles" && <BattleExplorerView />}

          {activeTab === "characters" && (
            <CharacterDatabase
              onSelectLocation={handleSelectLocation}
              initialCharacterId={selectedCharacterId}
            />
          )}

          {activeTab === "mysteries" && (
            <MysteriesAndLore initialMysteryId={selectedMysteryId} />
          )}

          {activeTab === "theories" && (
            <TheoriesExplorer initialTheoryId={selectedTheoryId} />
          )}

          {(activeTab === "history" || activeTab === "timeline") && <TimelineView />}

          {activeTab === "foreshadowing" && <ForeshadowingShowcase />}

          {(activeTab === "story" || activeTab === "chapterReveals") && <ChapterRevealsView />}

          {activeTab === "personalProgress" && <PersonalProgressView />}

          {activeTab === "devilFruits" && <DevilFruitEncyclopediaView />}

          {activeTab === "graph" && (
            <KnowledgeGraph
              onSelectCharacter={handleSelectCharacter}
              onSelectMystery={handleSelectMystery}
            />
          )}

          {activeTab === "assistant" && <AiScholar />}

          {activeTab === "pipeline" && (
            <DataArchitectureDashboard onSelectCharacter={handleSelectCharacter} />
          )}
        </main>

        {/* Comprehensive Footer & Fan Legal Disclaimer */}
        <Footer onNavigate={setActiveTab} />
      </div>
    </SpoilerProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { HomeView } from './components/HomeView';
import { GladiatorHubView } from './components/GladiatorHubView';
import { ArchetypeSelectView } from './components/ArchetypeSelectView';
import { TargetSelectView } from './components/TargetSelectView';
import { BattleView } from './components/BattleView';
import { ResultModal } from './components/ResultModal';
import { ProbabilityModal } from './components/ProbabilityModal';
import { HouseLeaderboardModal } from './components/HouseLeaderboardModal';
import { FortunaTutorialModal } from './components/FortunaTutorialModal';
import { BackgroundParticles } from './components/BackgroundParticles';
import { ArchetypeId, Gladiator, BattleState, GearItem } from './types/game';
import { ARCHETYPES, getGearStats } from './engine/mathEngine';
import { soundFx } from './engine/audioEngine';
import { loadPlayerProfile } from './engine/storageEngine';

type ViewMode = 'home' | 'gladiator' | 'archetype' | 'target' | 'battle';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<ArchetypeId>('murmillo');
  const [equippedGear, setEquippedGear] = useState<{ weapon?: GearItem; armor?: GearItem; crest?: GearItem }>({});
  const [selectedEnemy, setSelectedEnemy] = useState<Gladiator | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [showProbabilityModal, setShowProbabilityModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(() => {
    const profile = loadPlayerProfile();
    return !profile.hasCompletedTutorial;
  });

  useEffect(() => {
    const handleFirstInteraction = () => {
      soundFx.initAndPlayMusic();
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('click', handleFirstInteraction);
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showTutorialModal) {
          setShowTutorialModal(false);
        } else if (showProbabilityModal) {
          setShowProbabilityModal(false);
        } else if (showLeaderboardModal) {
          setShowLeaderboardModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTutorialModal, showProbabilityModal, showLeaderboardModal]);

  const handleStartWar = () => {
    soundFx.playClick();
    setViewMode('target');
  };

  const handleSelectArchetype = (archetypeId: ArchetypeId) => {
    soundFx.playClick();
    setSelectedArchetypeId(archetypeId);
    setViewMode('home');
  };

  const handleUpdateGladiator = (
    archetypeId: ArchetypeId,
    gear: { weapon?: GearItem; armor?: GearItem; crest?: GearItem }
  ) => {
    setSelectedArchetypeId(archetypeId);
    setEquippedGear(gear);
  };

  const handleSelectTarget = (enemy: Gladiator) => {
    soundFx.playClick();
    setSelectedEnemy(enemy);
    setBattleState(null);
    setViewMode('battle');
  };

  const handleFinishBattle = (finalBattleState: BattleState) => {
    setBattleState(finalBattleState);
  };

  const handleReturnHome = () => {
    soundFx.playClick();
    setBattleState(null);
    setSelectedEnemy(null);
    setViewMode('home');
  };

  const handleRematch = () => {
    soundFx.playClick();
    setBattleState(null);
    setViewMode('battle');
  };

  const createPlayerGladiator = (): Gladiator => {
    const profile = loadPlayerProfile();
    const arch = ARCHETYPES[selectedArchetypeId];
    const gearStats = getGearStats(equippedGear);
    const maxHp = 100 + gearStats.hpBonus;
    return {
      id: 'player_hero',
      name: profile.playerName || 'Imperator',
      title: 'Gladiator Champion of Invicta',
      archetypeId: selectedArchetypeId,
      maxHp,
      currentHp: maxHp,
      shieldCharges: 0,
      houseName: 'Legio Invicta',
      isPlayer: true,
      avatarUrl: arch.portrait,
      equippedGear,
    };
  };

  // Determine dynamic full-bleed background image for each scene
  let sceneBg = './assets/arena_bg.png';
  if (viewMode === 'gladiator') sceneBg = './assets/armory_bg.png';
  else if (viewMode === 'target') sceneBg = './assets/scouting_bg.png';
  else if (viewMode === 'battle') sceneBg = './assets/arena_bg.png';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `linear-gradient(180deg, rgba(6, 8, 13, 0.45) 0%, rgba(6, 8, 13, 0.88) 100%), url(${sceneBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.4s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BackgroundParticles />
      <div className="app-container">
        <HeaderNav
          onOpenProbabilityModal={() => setShowProbabilityModal(true)}
          onOpenTutorial={() => setShowTutorialModal(true)}
          onResetToHome={handleReturnHome}
        />

        <main className="main-content">
          {viewMode === 'home' && (
            <HomeView
              onStartWar={handleStartWar}
              onOpenGladiatorHub={() => setViewMode('gladiator')}
              onOpenMath={() => setShowProbabilityModal(true)}
              onOpenLeaderboard={() => setShowLeaderboardModal(true)}
              onOpenTutorial={() => setShowTutorialModal(true)}
            />
          )}

          {viewMode === 'gladiator' && (
            <GladiatorHubView
              currentArchetypeId={selectedArchetypeId}
              equippedGear={equippedGear}
              onUpdateGladiator={handleUpdateGladiator}
              onBack={() => setViewMode('home')}
            />
          )}

          {viewMode === 'archetype' && (
            <ArchetypeSelectView
              onSelectArchetype={handleSelectArchetype}
              onBack={() => setViewMode('home')}
            />
          )}

          {viewMode === 'target' && (
            <TargetSelectView
              playerGladiator={createPlayerGladiator()}
              onSelectTarget={handleSelectTarget}
              onBack={() => setViewMode('home')}
              onUpdateEquippedGear={setEquippedGear}
            />
          )}

          {viewMode === 'battle' && selectedEnemy && (
            <BattleView
              playerGladiator={createPlayerGladiator()}
              enemyGladiator={selectedEnemy}
              onFinishBattle={handleFinishBattle}
            />
          )}
        </main>

        {/* Queen Fortuna Tutorial Modal Overlay */}
        {showTutorialModal && (
          <FortunaTutorialModal
            onClose={() => setShowTutorialModal(false)}
            onStartFirstFight={handleStartWar}
            currentViewMode={viewMode}
          />
        )}

        {/* Result Modal Overlay */}
        {battleState && (
          <ResultModal
            battleState={battleState}
            onReturnHome={handleReturnHome}
            onRematch={handleRematch}
          />
        )}

        {/* Probability Modal Overlay */}
        {showProbabilityModal && (
          <ProbabilityModal onClose={() => setShowProbabilityModal(false)} />
        )}

        {/* House Leaderboard & Roster Modal Overlay */}
        {showLeaderboardModal && (
          <HouseLeaderboardModal onClose={() => setShowLeaderboardModal(false)} />
        )}
      </div>
    </div>
  );
};

export default App;

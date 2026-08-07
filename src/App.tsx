import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { HomeView } from './components/HomeView';
import { GladiatorHubView } from './components/GladiatorHubView';
import { ArchetypeSelectView } from './components/ArchetypeSelectView';
import { TargetSelectView } from './components/TargetSelectView';
import { BattleView } from './components/BattleView';
import { ResultModal } from './components/ResultModal';
import { ProbabilityModal } from './components/ProbabilityModal';
import { BackgroundParticles } from './components/BackgroundParticles';
import { ArchetypeId, Gladiator, BattleState, GearItem } from './types/game';
import { ARCHETYPES } from './engine/mathEngine';
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
        if (showProbabilityModal) {
          setShowProbabilityModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showProbabilityModal]);

  const handleStartWar = () => {
    setViewMode('target');
  };

  const handleSelectArchetype = (archetypeId: ArchetypeId) => {
    setSelectedArchetypeId(archetypeId);
    setViewMode('target');
  };

  const handleUpdateGladiator = (
    archetypeId: ArchetypeId,
    gear: { weapon?: GearItem; armor?: GearItem; crest?: GearItem }
  ) => {
    setSelectedArchetypeId(archetypeId);
    setEquippedGear(gear);
  };

  const handleSelectTarget = (enemy: Gladiator) => {
    setSelectedEnemy(enemy);
    setViewMode('battle');
  };

  const handleFinishBattle = (finalBattleState: BattleState) => {
    setBattleState(finalBattleState);
  };

  const handleReturnHome = () => {
    setBattleState(null);
    setSelectedEnemy(null);
    setViewMode('home');
  };

  const handleRematch = () => {
    setBattleState(null);
    setViewMode('battle');
  };

  const createPlayerGladiator = (): Gladiator => {
    const profile = loadPlayerProfile();
    const arch = ARCHETYPES[selectedArchetypeId];
    const hpBonus = (equippedGear.armor?.hpBonus || 0) + (equippedGear.crest?.hpBonus || 0);
    const maxHp = 100 + hpBonus;
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
          onResetToHome={handleReturnHome}
        />

        <main className="main-content">
          {viewMode === 'home' && (
            <HomeView
              onStartWar={handleStartWar}
              onOpenGladiatorHub={() => setViewMode('gladiator')}
              onOpenMath={() => setShowProbabilityModal(true)}
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
      </div>
    </div>
  );
};

export default App;

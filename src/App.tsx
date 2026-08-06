import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { HomeView } from './components/HomeView';
import { ArchetypeSelectView } from './components/ArchetypeSelectView';
import { TargetSelectView } from './components/TargetSelectView';
import { BattleView } from './components/BattleView';
import { ResultModal } from './components/ResultModal';
import { ProbabilityModal } from './components/ProbabilityModal';
import { ArchetypeId, Gladiator, BattleState } from './types/game';
import { ARCHETYPES } from './engine/mathEngine';

type ViewMode = 'home' | 'archetype' | 'target' | 'battle';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<ArchetypeId>('murmillo');
  const [selectedEnemy, setSelectedEnemy] = useState<Gladiator | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [showProbabilityModal, setShowProbabilityModal] = useState<boolean>(false);

  const handleStartWar = () => {
    setViewMode('archetype');
  };

  const handleSelectArchetype = (archetypeId: ArchetypeId) => {
    setSelectedArchetypeId(archetypeId);
    setViewMode('target');
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
    const arch = ARCHETYPES[selectedArchetypeId];
    return {
      id: 'player_hero',
      name: 'Imperator',
      title: 'Gladiator Champion of Invicta',
      archetypeId: selectedArchetypeId,
      maxHp: 100,
      currentHp: 100,
      shieldCharges: 0,
      houseName: 'Legio Invicta',
      isPlayer: true,
      avatarUrl: arch.portrait,
    };
  };

  return (
    <div className="app-container">
      <HeaderNav
        onOpenProbabilityModal={() => setShowProbabilityModal(true)}
        onResetToHome={handleReturnHome}
      />

      <main style={{ flex: 1 }}>
        {viewMode === 'home' && (
          <HomeView
            onStartWar={handleStartWar}
            onOpenMath={() => setShowProbabilityModal(true)}
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
            playerArchetypeId={selectedArchetypeId}
            onSelectTarget={handleSelectTarget}
            onBack={() => setViewMode('archetype')}
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

      <footer style={{ textAlign: 'center', margin: '2rem 0 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
        Arena Reels — Vertical Slice Prototype | Designed for GitHub Pages | Job Assignment Demo
      </footer>
    </div>
  );
};

export default App;

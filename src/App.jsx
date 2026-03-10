/**
 * @reflection
 * [IDENTITY]: PRIMER App Router
 * [PURPOSE]: Main routing logic and sound/theme initialization. Handles game states (opening, setup, playing).
 * [STATE]: Stable
 * [LAST_UPDATE]: 2026-02-12
 * [DEPENDS_ON]: GameContext, ThemeContext, OpeningScreen, PlayerSetup, MainLayout
 * [AI_CONTEXT]: Orchestrates the top-level switching between game modes.
 */
import React, { useState, useEffect, Suspense } from 'react';
// Sound init handled once via useEffect in App() — see lines below
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { GameProvider, useGame } from './context/GameContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
// Dashboard.jsx (legacy) deleted — DashboardPage.jsx is the active dashboard
import OpeningScreen from './components/OpeningScreen.jsx';
import { soundManager } from './utils/SoundManager.js';
import DatabaseSync from './components/DatabaseSync.jsx';
import './i18n';

// Lazy load heavy game components
const SaveSlotSelector = React.lazy(() => import('./components/SaveSlotSelector'));
const PlayerSetup = React.lazy(() => import('./components/PlayerSetup'));
const MainLayout = React.lazy(() => import('./components/MainLayout'));
const RumahDinas = React.lazy(() => import('./pages/RumahDinas'));

const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-emerald-400 font-bold tracking-widest animate-pulse text-sm">MEMUAT...</p>
    </div>
  </div>
);

function GameRouter() {
  const [dbReady, setDbReady] = useState(false);
  const context = useGame();

  // hasSaveData check removed — SaveSlotSelector handles this directly

  if (!dbReady) {
    return <DatabaseSync onComplete={() => setDbReady(true)} />;
  }

  if (!context) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Game Initializing...</h1>
          <p className="text-slate-400">Please wait while the medical database is loading.</p>
        </div>
      </div>
    );
  }

  const { gameState, startNewGame, loadGame, setGameState } = context;

  const handleProfileComplete = (profile, saveData, slotId) => {
    if (saveData) {
      // Loading from save (legacy or new)
      loadGame(saveData, slotId);
    } else {
      // New game with specific slot
      startNewGame(profile, slotId);
    }
  };

  const handleSelectSlot = (slotId, saveData) => {
    if (saveData && !saveData.empty) {
      loadGame(saveData, slotId);
    } else {
      // If empty slot, go to setup but remember slot ID
      setGameState({ type: 'setup', slotId });
    }
  };

  const handleNewGameFromSlot = (slotId) => {
    setGameState({ type: 'setup', slotId });
  };

  // Opening screen (cinematic logo sequence → straight to slot select)
  if (gameState === 'opening') {
    return <OpeningScreen onComplete={() => setGameState('slot_select')} />;
  }

  if (gameState === 'slot_select') {
    return (
      <SaveSlotSelector
        onSelectSlot={handleSelectSlot}
        onNewGame={handleNewGameFromSlot}
      />
    );
  }

  // Handle object-style gameState for setup with slotId
  if (gameState === 'setup' || (typeof gameState === 'object' && gameState.type === 'setup')) {
    const targetSlotId = typeof gameState === 'object' ? gameState.slotId : null;
    return <PlayerSetup onComplete={(profile, saveData) => handleProfileComplete(profile, saveData, targetSlotId)} />;
  }

  if (gameState === 'rumah_dinas') {
    return (
      <ErrorBoundary name="Rumah Dinas">
        <RumahDinas onClose={() => setGameState('playing')} />
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <ErrorBoundary name="Game">
        <MainLayout />
      </ErrorBoundary>
    </div>
  );
}

function App() {
  // Initialize sound on first user interaction and add click sound listener
  useEffect(() => {
    // 1. Initialize sound context on FIRST interaction only (required by browsers)
    const initSound = () => {
      soundManager.init();
      soundManager.resumeBGM();
      // Remove this listener after first execution
      document.removeEventListener('click', initSound);
      document.removeEventListener('keydown', initSound);
      document.removeEventListener('touchstart', initSound);
    };

    document.addEventListener('click', initSound);
    document.addEventListener('keydown', initSound);
    document.addEventListener('touchstart', initSound);

    // 2. Play click sound for interactive elements (persistent)
    const handleNavigationSound = (e) => {
      const target = e.target;
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer') ||
        target.classList.contains('cursor-pointer');

      if (isInteractive) {
        soundManager.playClick();
      }
    };

    document.addEventListener('click', handleNavigationSound);

    return () => {
      document.removeEventListener('click', initSound);
      document.removeEventListener('keydown', initSound);
      document.removeEventListener('touchstart', initSound);
      document.removeEventListener('click', handleNavigationSound);
    };
  }, []);

  return (
    <ThemeProvider>
      <GameProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <GameRouter />
          </Suspense>
        </ErrorBoundary>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;


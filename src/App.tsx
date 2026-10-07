import React, { useEffect } from 'react';
import { GameScene } from './game/GameScene';
import { UIOverlay } from './components/UIOverlay';
import { FarmingUI } from './components/FarmingUI';
import { AnimalUI } from './components/AnimalUI';
import { Hotbar } from './components/Hotbar';
import { InventoryModal } from './components/InventoryModal';
import { BuildingMenuModal } from './components/BuildingMenuModal';
import { BuildPlacementHUD } from './components/BuildPlacementHUD';
import { VirtualJoystick } from './components/VirtualJoystick';
import { CharacterSelectScreen } from './components/character-select/CharacterSelectScreen';
import { FishingMinigameHUD } from './components/fishing/FishingMinigameHUD';
import { FishCatchCelebrationModal } from './components/fishing/FishCatchCelebrationModal';
import { useCharacterStore } from './stores/characterStore';

export const App: React.FC = () => {
  const isCharacterCreated = useCharacterStore((state) => state.isCharacterCreated);
  const showCharacterModal = useCharacterStore((state) => state.showCharacterModal);

  // Sync exact visible visualViewport height to CSS variable --app-height
  // This guarantees zero React re-renders while keeping 100% precision on iPad/iOS browsers
  useEffect(() => {
    const syncViewportHeight = () => {
      const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${h}px`);
    };

    syncViewportHeight();
    window.visualViewport?.addEventListener('resize', syncViewportHeight);
    window.addEventListener('resize', syncViewportHeight);
    window.addEventListener('orientationchange', syncViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener('resize', syncViewportHeight);
      window.removeEventListener('resize', syncViewportHeight);
      window.removeEventListener('orientationchange', syncViewportHeight);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: 'var(--app-height, 100dvh)',
        overflow: 'hidden',
      }}
    >
      <GameScene />
      <UIOverlay />
      <FarmingUI />
      <AnimalUI />
      <Hotbar />
      <VirtualJoystick />
      <InventoryModal />
      <BuildingMenuModal />
      <BuildPlacementHUD />

      {/* 3D Fishing Minigame HUD & Catch Celebration Modal */}
      <FishingMinigameHUD />
      <FishCatchCelebrationModal />

      {/* 3D Character Selection & Customization Screen */}
      {(!isCharacterCreated || showCharacterModal) && <CharacterSelectScreen />}
    </div>
  );
};

export default App;

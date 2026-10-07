import { useFarmStore } from '../stores/farmStore';
import { useAnimalStore } from '../stores/animalStore';
import { useFishingStore, getWaterTypeAtPosition } from '../stores/fishingStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { useGameStore } from '../stores/gameStore';

export interface ContextualAction {
  canInteract: boolean;
  label: string;
  icon: string;
}

/**
 * Unified Interaction Trigger.
 * Executed identically whether the player presses [E] on physical keyboard
 * or taps the touch [INTERACT] action button on iPad / mobile screen.
 */
export function performInteract(): boolean {
  // 0. Check Urgent Fishing Reactions first
  const fishingPhase = useFishingStore.getState().phase;
  const pPos = useGameStore.getState().playerPosition;
  const pRot = (useGameStore.getState() as { playerRotation?: number }).playerRotation || 0;

  if (fishingPhase === 'biting') {
    useFishingStore.getState().hookBite();
    return true;
  }
  if (fishingPhase === 'charging') {
    useFishingStore.getState().releaseCast(pPos, pRot);
    return true;
  }
  if (fishingPhase === 'waiting' || fishingPhase === 'nibble') {
    useFishingStore.getState().cancelFishing();
    return true;
  }
  if (fishingPhase === 'minigame') {
    useFishingStore.getState().pressReel(true);
    setTimeout(() => useFishingStore.getState().pressReel(false), 200);
    return true;
  }

  // 1. Check Animal Interaction
  const activeAnimalId = useAnimalStore.getState().activeAnimalId;
  if (activeAnimalId) {
    const animal = useAnimalStore
      .getState()
      .animals.find((a) => a.id === activeAnimalId);

    if (animal) {
      if (animal.isProductReady) {
        useAnimalStore.getState().collectProduct(animal.id);
        return true;
      }
      if (animal.hunger < 95) {
        useAnimalStore.getState().feedAnimal(animal.id);
        return true;
      }
      useAnimalStore.getState().petAnimal(animal.id);
      return true;
    }
  }

  // 2. Check Farm Tile Interaction
  const activeTileId = useFarmStore.getState().activeTileId;
  if (activeTileId) {
    const tile = useFarmStore
      .getState()
      .tiles.find((t) => t.id === activeTileId);

    if (tile) {
      if (tile.state === 'EMPTY') {
        useFarmStore.getState().plowTile(tile.id);
        return true;
      }
      if (tile.state === 'PLOWED') {
        useFarmStore.getState().plantTile(tile.id);
        return true;
      }
      if (tile.state === 'PLANTED' || tile.state === 'GROWING') {
        if (tile.crop && !tile.crop.wateredToday) {
          useFarmStore.getState().waterTile(tile.id);
          return true;
        }
      }
      if (tile.state === 'READY') {
        useFarmStore.getState().harvestTile(tile.id);
        return true;
      }
    }
  }

  // 3. Check Fishing Rod Cast if holding rod and facing water
  const selectedItem = useInventoryStore.getState().getSelectedItem();
  if (selectedItem && selectedItem.id.startsWith('fishing_rod') && fishingPhase === 'idle') {
    const sin = Math.sin(pRot);
    const cos = Math.cos(pRot);
    const forwardWater = getWaterTypeAtPosition(pPos[0] - sin * 6, pPos[2] - cos * 6);
    if (forwardWater) {
      useFishingStore.getState().startCharging();
      setTimeout(() => {
        useFishingStore.getState().releaseCast(pPos, pRot);
      }, 350);
      return true;
    }
  }

  return false;
}

/**
 * Returns the current contextual interaction state for the UI action button.
 */
export function getContextualAction(): ContextualAction {
  // 0. Fishing active state
  const fishingPhase = useFishingStore.getState().phase;
  if (fishingPhase === 'biting') {
    return { canInteract: true, label: 'Giật cần!', icon: '🎣' };
  }
  if (fishingPhase === 'charging') {
    return { canInteract: true, label: 'Quăng cần', icon: '🎣' };
  }
  if (fishingPhase === 'waiting' || fishingPhase === 'nibble') {
    return { canInteract: true, label: 'Thu cần', icon: '🎣' };
  }
  if (fishingPhase === 'minigame') {
    return { canInteract: true, label: 'Kéo dây', icon: '🎣' };
  }

  const activeAnimalId = useAnimalStore.getState().activeAnimalId;
  if (activeAnimalId) {
    const animal = useAnimalStore
      .getState()
      .animals.find((a) => a.id === activeAnimalId);

    if (animal) {
      if (animal.isProductReady) {
        const icon =
          animal.species === 'chicken'
            ? '🥚'
            : animal.species === 'cow'
            ? '🥛'
            : '🧶';
        return { canInteract: true, label: 'Collect', icon };
      }
      if (animal.hunger < 95) {
        return { canInteract: true, label: 'Feed', icon: '🥕' };
      }
      return { canInteract: true, label: 'Pet', icon: '❤️' };
    }
  }

  const activeTileId = useFarmStore.getState().activeTileId;
  if (activeTileId) {
    const tile = useFarmStore
      .getState()
      .tiles.find((t) => t.id === activeTileId);

    if (tile) {
      if (tile.state === 'EMPTY') {
        return { canInteract: true, label: 'Plow', icon: '⛏️' };
      }
      if (tile.state === 'PLOWED') {
        return { canInteract: true, label: 'Plant', icon: '🌱' };
      }
      if (tile.state === 'PLANTED' || tile.state === 'GROWING') {
        if (tile.crop && !tile.crop.wateredToday) {
          return { canInteract: true, label: 'Water', icon: '💧' };
        }
        return { canInteract: false, label: 'Growing', icon: '🌱' };
      }
      if (tile.state === 'READY') {
        return { canInteract: true, label: 'Harvest', icon: '✨' };
      }
    }
  }

  // 3. Check Fishing Rod near water
  const selectedItem = useInventoryStore.getState().getSelectedItem();
  if (selectedItem && selectedItem.id.startsWith('fishing_rod') && fishingPhase === 'idle') {
    const pPos = useGameStore.getState().playerPosition;
    const pRot = (useGameStore.getState() as { playerRotation?: number }).playerRotation || 0;
    const sin = Math.sin(pRot);
    const cos = Math.cos(pRot);
    const forwardWater = getWaterTypeAtPosition(pPos[0] - sin * 6, pPos[2] - cos * 6);
    if (forwardWater) {
      return { canInteract: true, label: 'Quăng mồi', icon: '🎣' };
    }
  }

  return { canInteract: false, label: 'Interact', icon: '⚡' };
}

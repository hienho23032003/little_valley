import { useFarmStore } from '../stores/farmStore';
import { useAnimalStore } from '../stores/animalStore';

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
  // 1. Check Animal Interaction first
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

  // 2. Check Farm Tile Interaction second
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

  return false;
}

/**
 * Returns the current contextual interaction state for the UI action button.
 */
export function getContextualAction(): ContextualAction {
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

  return { canInteract: false, label: 'Interact', icon: '⚡' };
}

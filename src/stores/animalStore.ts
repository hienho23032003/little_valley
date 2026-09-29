import { create } from 'zustand';
import { useInventoryStore } from './inventoryStore';
import { useFarmStore } from './farmStore';

export type AnimalSpecies = 'chicken' | 'cow' | 'sheep';

export interface Animal {
  id: string;
  species: AnimalSpecies;
  name: string;
  position: [number, number, number];
  rotation: number;
  hunger: number; // 0 to 100 (100 is fully fed)
  happiness: number; // 0 to 100
  age: number; // in days
  health: number; // 0 to 100
  productCooldown: number; // seconds remaining until next product is ready (0 = ready)
  isProductReady: boolean;
  penId: string;

  // Wandering internal state
  targetPosition: [number, number, number];
  isWalking: boolean;
  idleTimer: number; // seconds
}

export interface PenBounds {
  id: string;
  name: string;
  species: AnimalSpecies;
  center: [number, number, number];
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface AnimalStoreState {
  animals: Animal[];
  pens: Record<string, PenBounds>;
  activeAnimalId: string | null;

  // Actions
  feedAnimal: (animalId: string) => boolean;
  petAnimal: (animalId: string) => void;
  collectProduct: (animalId: string) => boolean;
  setActiveAnimalId: (id: string | null) => void;
  updateAnimals: (delta: number) => void;
  resetDailyAnimals: (day: number) => void;
}

// Pen boundaries in the farm area
export const ANIMAL_PENS: Record<string, PenBounds> = {
  coop: {
    id: 'coop',
    name: 'Chicken Coop',
    species: 'chicken',
    center: [-15.0, 0, 5.5],
    minX: -17.2,
    maxX: -12.8,
    minZ: 3.5,
    maxZ: 7.5,
  },
  barn: {
    id: 'barn',
    name: 'Cow Pasture',
    species: 'cow',
    center: [9.0, 0, 8.5],
    minX: 5.5,
    maxX: 12.5,
    minZ: 6.2,
    maxZ: 10.8,
  },
  sheepPen: {
    id: 'sheepPen',
    name: 'Sheep Pen',
    species: 'sheep',
    center: [9.0, 0, 14.0],
    minX: 5.5,
    maxX: 12.5,
    minZ: 11.5,
    maxZ: 16.0,
  },
};

const INITIAL_ANIMALS: Animal[] = [
  // Chickens (Coop)
  {
    id: 'chicken-1',
    species: 'chicken',
    name: 'Clucky',
    position: [-14.5, 0, 5.0],
    rotation: 0.4,
    hunger: 75,
    happiness: 80,
    age: 14,
    health: 100,
    productCooldown: 0,
    isProductReady: true, // Start ready for instant player test!
    penId: 'coop',
    targetPosition: [-14.5, 0, 5.0],
    isWalking: false,
    idleTimer: 2.5,
  },
  {
    id: 'chicken-2',
    species: 'chicken',
    name: 'Pip',
    position: [-16.0, 0, 6.2],
    rotation: -1.2,
    hunger: 60,
    happiness: 70,
    age: 8,
    health: 100,
    productCooldown: 25,
    isProductReady: false,
    penId: 'coop',
    targetPosition: [-16.0, 0, 6.2],
    isWalking: false,
    idleTimer: 4.0,
  },

  // Cows (Barn / Pasture)
  {
    id: 'cow-1',
    species: 'cow',
    name: 'Bessie',
    position: [7.5, 0, 8.2],
    rotation: 0.8,
    hunger: 80,
    happiness: 85,
    age: 28,
    health: 100,
    productCooldown: 0,
    isProductReady: true, // Ready to milk
    penId: 'barn',
    targetPosition: [7.5, 0, 8.2],
    isWalking: false,
    idleTimer: 3.5,
  },
  {
    id: 'cow-2',
    species: 'cow',
    name: 'Buttercup',
    position: [10.5, 0, 9.5],
    rotation: -0.5,
    hunger: 65,
    happiness: 75,
    age: 20,
    health: 100,
    productCooldown: 40,
    isProductReady: false,
    penId: 'barn',
    targetPosition: [10.5, 0, 9.5],
    isWalking: false,
    idleTimer: 5.0,
  },

  // Sheep (Sheep Pen)
  {
    id: 'sheep-1',
    species: 'sheep',
    name: 'Woolly',
    position: [7.2, 0, 13.8],
    rotation: -0.8,
    hunger: 70,
    happiness: 90,
    age: 18,
    health: 100,
    productCooldown: 0,
    isProductReady: true, // Ready to shear
    penId: 'sheepPen',
    targetPosition: [7.2, 0, 13.8],
    isWalking: false,
    idleTimer: 3.0,
  },
  {
    id: 'sheep-2',
    species: 'sheep',
    name: 'Cloud',
    position: [11.0, 0, 14.5],
    rotation: 1.1,
    hunger: 55,
    happiness: 65,
    age: 12,
    health: 100,
    productCooldown: 35,
    isProductReady: false,
    penId: 'sheepPen',
    targetPosition: [11.0, 0, 14.5],
    isWalking: false,
    idleTimer: 4.5,
  },
];

export const useAnimalStore = create<AnimalStoreState>((set, get) => ({
  animals: INITIAL_ANIMALS,
  pens: ANIMAL_PENS,
  activeAnimalId: null,

  setActiveAnimalId: (id) => set({ activeAnimalId: id }),

  feedAnimal: (animalId) => {
    const { animals } = get();
    const animal = animals.find((a) => a.id === animalId);
    if (!animal) return false;

    const invStore = useInventoryStore.getState();
    const farmStore = useFarmStore.getState();

    // Determine required feed:
    // Chicken: wheat_seed (or corn_seed)
    // Cow & Sheep: wheat (or corn)
    let feedItemId = 'wheat';
    let feedName = 'Wheat';

    if (animal.species === 'chicken') {
      if (invStore.hasItem('wheat_seed', 1)) {
        feedItemId = 'wheat_seed';
        feedName = 'Wheat Seed';
      } else if (invStore.hasItem('corn_seed', 1)) {
        feedItemId = 'corn_seed';
        feedName = 'Corn Seed';
      } else if (invStore.hasItem('wheat', 1)) {
        feedItemId = 'wheat';
        feedName = 'Wheat';
      } else {
        feedItemId = 'wheat_seed';
        feedName = 'Wheat Seed';
      }
    }

    if (!invStore.hasItem(feedItemId, 1)) {
      farmStore.addNotification(`Need 1 ${feedName} to feed ${animal.name}!`, '🌾', '#e76f51');
      return false;
    }

    // Deduct food item from inventory
    invStore.removeItem(feedItemId, 1);

    // Feeding boosts hunger (+35) and happiness (+25), reduces product cooldown
    const updatedAnimals = animals.map((a) => {
      if (a.id === animalId) {
        const newHunger = Math.min(100, a.hunger + 35);
        const newHappiness = Math.min(100, a.happiness + 25);
        const newCooldown = Math.max(0, a.productCooldown - 15);
        const isReady = newCooldown === 0;

        return {
          ...a,
          hunger: newHunger,
          happiness: newHappiness,
          productCooldown: newCooldown,
          isProductReady: isReady || a.isProductReady,
        };
      }
      return a;
    });

    set({ animals: updatedAnimals });
    farmStore.addNotification(`Fed ${animal.name} ${feedName}! ❤️`, '❤️', '#e63946');
    return true;
  },

  petAnimal: (animalId) => {
    const { animals } = get();
    const animal = animals.find((a) => a.id === animalId);
    if (!animal) return;

    const farmStore = useFarmStore.getState();
    const newHappiness = Math.min(100, animal.happiness + 10);

    set({
      animals: animals.map((a) =>
        a.id === animalId ? { ...a, happiness: newHappiness } : a
      ),
    });

    farmStore.addNotification(`Petted ${animal.name}! ❤️ (Happiness: ${newHappiness}%)`, '❤️', '#ff758f');
  },

  collectProduct: (animalId) => {
    const { animals } = get();
    const animal = animals.find((a) => a.id === animalId);
    if (!animal || !animal.isProductReady) return false;

    const invStore = useInventoryStore.getState();
    const farmStore = useFarmStore.getState();

    let productId = 'egg';
    let productName = 'Egg';
    let icon = '🥚';
    let nextCooldown = 60; // 60 seconds base

    if (animal.species === 'chicken') {
      productId = 'egg';
      productName = 'Egg';
      icon = '🥚';
      nextCooldown = 45;
    } else if (animal.species === 'cow') {
      productId = 'milk';
      productName = 'Fresh Milk';
      icon = '🥛';
      nextCooldown = 75;
    } else if (animal.species === 'sheep') {
      productId = 'wool';
      productName = 'Soft Wool';
      icon = '🧶';
      nextCooldown = 60;
    }

    // Happy animals produce products faster
    const happinessBonus = (animal.happiness / 100) * 20;
    const finalCooldown = Math.max(20, nextCooldown - happinessBonus);

    // Add product to inventory
    invStore.addItem(productId, 1);

    // Reset animal product readiness
    set({
      animals: animals.map((a) =>
        a.id === animalId
          ? {
              ...a,
              isProductReady: false,
              productCooldown: finalCooldown,
            }
          : a
      ),
    });

    // Floating notification
    farmStore.addNotification(`+1 ${productName}`, icon, '#2a9d8f');
    return true;
  },

  updateAnimals: (delta) => {
    const { animals, pens } = get();

    const updatedAnimals = animals.map((animal) => {
      const pen = pens[animal.penId];
      if (!pen) return animal;

      let { position, targetPosition, isWalking, idleTimer, rotation, productCooldown, isProductReady, hunger } = animal;

      // 1. Product cooldown progression (fed animals produce faster)
      if (!isProductReady) {
        const hungerMultiplier = hunger > 40 ? 1.0 : 0.4;
        const newCooldown = Math.max(0, productCooldown - delta * hungerMultiplier);
        productCooldown = newCooldown;
        if (newCooldown === 0) {
          isProductReady = true;
        }
      }

      // 2. Slow hunger decay over time (takes ~15 minutes to deplete)
      const newHunger = Math.max(0, hunger - (delta / 12));

      // 3. Simple Wandering within Pen Bounds
      const speed = animal.species === 'chicken' ? 0.9 : animal.species === 'sheep' ? 0.65 : 0.5;

      if (isWalking) {
        const dx = targetPosition[0] - position[0];
        const dz = targetPosition[2] - position[2];
        const dist = Math.hypot(dx, dz);

        if (dist > 0.1) {
          // Face target direction
          const targetAngle = Math.atan2(dx, dz);
          rotation = targetAngle;

          // Move toward target
          const step = Math.min(dist, speed * delta);
          const newX = position[0] + (dx / dist) * step;
          const newZ = position[2] + (dz / dist) * step;

          // Clamp firmly within pen
          position = [
            Math.max(pen.minX, Math.min(pen.maxX, newX)),
            position[1],
            Math.max(pen.minZ, Math.min(pen.maxZ, newZ)),
          ];
        } else {
          // Reached destination, start idle period
          isWalking = false;
          idleTimer = 3.0 + Math.random() * 4.0;
        }
      } else {
        // Idle countdown
        idleTimer -= delta;
        if (idleTimer <= 0) {
          // Pick new random spot within pen
          const newTargetX = pen.minX + 0.3 + Math.random() * (pen.maxX - pen.minX - 0.6);
          const newTargetZ = pen.minZ + 0.3 + Math.random() * (pen.maxZ - pen.minZ - 0.6);
          targetPosition = [newTargetX, 0, newTargetZ];
          isWalking = true;
        }
      }

      return {
        ...animal,
        position,
        targetPosition,
        isWalking,
        idleTimer,
        rotation,
        productCooldown,
        isProductReady,
        hunger: newHunger,
      };
    });

    set({ animals: updatedAnimals });
  },

  resetDailyAnimals: () => {
    const { animals } = get();

    // On new day: animals age +1, hunger drops, well-fed animals have product ready in morning
    const updated = animals.map((a) => {
      const willProduce = a.hunger > 30 && a.happiness > 40;
      return {
        ...a,
        age: a.age + 1,
        hunger: Math.max(10, a.hunger - 25),
        isProductReady: willProduce || a.isProductReady,
        productCooldown: willProduce ? 0 : a.productCooldown,
      };
    });

    set({ animals: updated });
  },
}));

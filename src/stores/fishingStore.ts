import { create } from 'zustand';
import {
  FishSpecies,
  FishingRodDefinition,
  FISHING_RODS,
  getRandomFish,
  generateFishStats,
  WaterType,
} from '../data/fishData';
import { useInventoryStore } from './inventoryStore';
import { RIVER_BOUNDS } from '../data/worldData';

export type FishingPhase =
  | 'idle'
  | 'charging'
  | 'cast'
  | 'waiting'
  | 'nibble'
  | 'biting'
  | 'minigame'
  | 'celebration'
  | 'escaped';

export interface CaughtRecord {
  species: FishSpecies;
  weight: number;
  length: number;
  price: number;
  caughtAt: number;
}

export interface FishingState {
  isFishing: boolean;
  phase: FishingPhase;
  rodLevel: number;
  equippedRod: FishingRodDefinition;
  equippedBaitId: string | null;

  // Casting state
  castPower: number; // 0.0 to 1.0
  chargeDirection: number; // 1 or -1
  bobberPos: [number, number, number] | null;
  waterType: WaterType;

  // Bite state
  biteTimer: number; // countdown
  biteReactionWindow: number; // remaining reaction time when biting
  targetFish: FishSpecies | null;

  // Minigame tension state
  barPos: number; // 0.0 (bottom) to 1.0 (top)
  barVelocity: number;
  barHeight: number; // fraction of bar (default 0.22, boosted by rod/bait)
  isHoldingReel: boolean;
  fishPos: number; // 0.0 to 1.0
  fishTargetPos: number;
  fishTimer: number;
  catchProgress: number; // 0.0 to 1.0 (reaches 1.0 = caught!)

  // Caught Celebration
  lastCaught: CaughtRecord | null;
  records: Record<string, CaughtRecord>; // best record per fish id

  // Notifications
  notification: string | null;

  // Actions
  equipRod: (rodId: string) => void;
  equipBait: (baitId: string | null) => void;
  startCharging: () => boolean;
  releaseCast: (playerPos: [number, number, number], playerRotY: number) => boolean;
  hookBite: () => boolean;
  pressReel: (pressing: boolean) => void;
  tickFishing: (delta: number) => void;
  claimCatch: () => void;
  cancelFishing: () => void;
  clearNotification: () => void;
}

// Detection for whether a coordinate is over water (River or Lake)
export function getWaterTypeAtPosition(x: number, z: number): WaterType | null {
  // 1. Clearwater River corridor
  if (x >= -85 && x <= 14 && z >= RIVER_BOUNDS.minZ - 0.5 && z <= RIVER_BOUNDS.maxZ + 0.5) {
    return 'river';
  }
  // 2. Azure Lake basin
  if (x >= 12.5 && x <= 76 && z >= 21 && z <= 69) {
    return 'lake';
  }
  return null;
}

export const useFishingStore = create<FishingState>((set, get) => ({
  isFishing: false,
  phase: 'idle',
  rodLevel: 1,
  equippedRod: FISHING_RODS.rod_lvl1,
  equippedBaitId: 'worm',

  castPower: 0,
  chargeDirection: 1,
  bobberPos: null,
  waterType: 'all',

  biteTimer: 0,
  biteReactionWindow: 1.8,
  targetFish: null,

  barPos: 0.1,
  barVelocity: 0,
  barHeight: 0.24,
  isHoldingReel: false,
  fishPos: 0.2,
  fishTargetPos: 0.3,
  fishTimer: 0,
  catchProgress: 0.35,

  lastCaught: null,
  records: {},
  notification: null,

  equipRod: (rodId: string) => {
    const rod = FISHING_RODS[rodId] || FISHING_RODS.rod_lvl1;
    set({
      rodLevel: rod.level,
      equippedRod: rod,
      barHeight: 0.22 * rod.barWidthMultiplier,
    });
  },

  equipBait: (baitId: string | null) => {
    set({ equippedBaitId: baitId });
  },

  startCharging: () => {
    const { phase } = get();
    if (phase !== 'idle') return false;

    set({
      isFishing: true,
      phase: 'charging',
      castPower: 0.05,
      chargeDirection: 1,
      notification: null,
    });
    return true;
  },

  releaseCast: (playerPos: [number, number, number], playerRotY: number) => {
    const { phase, castPower, equippedRod, equippedBaitId } = get();
    if (phase !== 'charging') return false;

    // Calculate cast destination forward from player
    const maxDist = equippedRod.castDistance;
    const distance = 4.0 + castPower * (maxDist - 4.0);
    // Player facing angle (character faces -Z when rotY is 0)
    const sin = Math.sin(playerRotY);
    const cos = Math.cos(playerRotY);

    const landX = playerPos[0] - sin * distance;
    const landZ = playerPos[2] - cos * distance;

    const detectedWater = getWaterTypeAtPosition(landX, landZ);
    if (!detectedWater) {
      set({
        phase: 'idle',
        isFishing: false,
        bobberPos: null,
        notification: 'Mồi câu rơi trên cạn! Hãy nhắm vào sông hoặc hồ nước.',
      });
      return false;
    }

    // Generate bite wait time (3 to 7 seconds, reduced by bait)
    let baseWait = 3.2 + Math.random() * 3.8;
    if (equippedBaitId === 'worm') baseWait *= 0.75;
    if (equippedBaitId === 'lure_master') baseWait *= 0.55;

    // Deduct 1 bait if using consumable worm
    if (equippedBaitId === 'worm') {
      const inv = useInventoryStore.getState();
      if (inv.hasItem('worm', 1)) {
        inv.removeItem('worm', 1);
      }
    }

    set({
      phase: 'waiting',
      bobberPos: [landX, 0.05, landZ],
      waterType: detectedWater,
      biteTimer: baseWait,
      targetFish: null,
      notification: 'Đang câu cá... Hãy kiên nhẫn quan sát phao câu! 🌊',
    });
    return true;
  },

  hookBite: () => {
    const { phase, waterType, rodLevel, equippedBaitId, equippedRod } = get();
    if (phase !== 'biting') return false;

    // Roll for hooked fish
    const fish = getRandomFish(waterType, rodLevel, equippedBaitId || undefined);
    const effectiveBarHeight = 0.22 * equippedRod.barWidthMultiplier;

    set({
      phase: 'minigame',
      targetFish: fish,
      barPos: 0.2,
      barVelocity: 0,
      barHeight: effectiveBarHeight,
      fishPos: 0.35,
      fishTargetPos: 0.5,
      fishTimer: 0.5,
      catchProgress: 0.38,
      notification: `Dính cá rồi! Kéo cần câu để bắt ${fish.name}! 🎣`,
    });
    return true;
  },

  pressReel: (pressing: boolean) => {
    set({ isHoldingReel: pressing });
  },

  tickFishing: (delta: number) => {
    const { phase } = get();
    if (phase === 'idle') return;

    const dt = Math.min(delta, 0.05);

    // 1. Charging cast power oscillation
    if (phase === 'charging') {
      const { castPower, chargeDirection } = get();
      let nextPower = castPower + chargeDirection * dt * 1.5;
      let nextDir = chargeDirection;
      if (nextPower >= 1.0) {
        nextPower = 1.0;
        nextDir = -1;
      } else if (nextPower <= 0.05) {
        nextPower = 0.05;
        nextDir = 1;
      }
      set({ castPower: nextPower, chargeDirection: nextDir });
      return;
    }

    // 2. Waiting for fish bite
    if (phase === 'waiting') {
      const { biteTimer } = get();
      const nextTimer = biteTimer - dt;
      if (nextTimer <= 0) {
        // Fish bite triggered!
        set({
          phase: 'biting',
          biteTimer: 0,
          biteReactionWindow: 1.85,
          notification: 'CÁ CẮN CÂU! Bấm [Space] hoặc [E] ngay! ❗',
        });
      } else if (nextTimer <= 0.8 && get().phase === 'waiting') {
        // Nibble subtle dip before strike
        set({ biteTimer: nextTimer, phase: 'nibble' });
      } else {
        set({ biteTimer: nextTimer });
      }
      return;
    }

    if (phase === 'nibble') {
      const { biteTimer } = get();
      const nextTimer = biteTimer - dt;
      if (nextTimer <= 0) {
        set({
          phase: 'biting',
          biteTimer: 0,
          biteReactionWindow: 1.85,
          notification: 'CÁ CẮN CÂU! Bấm [Space] hoặc [E] ngay! ❗',
        });
      } else {
        set({ biteTimer: nextTimer });
      }
      return;
    }

    // 3. Fish biting reaction window
    if (phase === 'biting') {
      const { biteReactionWindow } = get();
      const nextWindow = biteReactionWindow - dt;
      if (nextWindow <= 0) {
        // Missed hook!
        set({
          phase: 'escaped',
          notification: 'Cá đã đớp mồi rồi chuồn mất! Thử lại nào.',
          bobberPos: null,
          isFishing: false,
        });
      } else {
        set({ biteReactionWindow: nextWindow });
      }
      return;
    }

    // 4. Minigame Reel-in Loop (Stardew Style)
    if (phase === 'minigame') {
      const state = get();
      const fish = state.targetFish;
      if (!fish) return;

      // Update player bar physics
      const gravity = 2.4;
      const lift = 3.6;
      let barVel = state.barVelocity;

      if (state.isHoldingReel) {
        barVel += lift * dt;
      } else {
        barVel -= gravity * dt;
      }
      barVel = Math.max(-2.5, Math.min(2.5, barVel));

      let barPos = state.barPos + barVel * dt;
      if (barPos < 0) {
        barPos = 0;
        barVel = -barVel * 0.2; // slight bounce on bottom
      }
      if (barPos > 1.0 - state.barHeight) {
        barPos = 1.0 - state.barHeight;
        barVel = 0;
      }

      // Update fish erratic AI movement
      let fishTimer = state.fishTimer - dt;
      let fishTarget = state.fishTargetPos;
      if (fishTimer <= 0) {
        // Change target position based on fish difficulty (1 to 10)
        fishTarget = Math.random();
        // Higher difficulty fish change direction more erratically & frequently
        fishTimer = Math.max(0.25, 1.4 - (fish.difficulty / 10) * 0.9);
      }

      const fishSpeed = 0.8 + (fish.difficulty / 10) * 2.2;
      let fishPos = state.fishPos + (fishTarget - state.fishPos) * dt * fishSpeed;
      fishPos = Math.max(0.04, Math.min(0.96, fishPos));

      // Overlap check: is fish inside the green bar?
      const barBottom = barPos;
      const barTop = barPos + state.barHeight;
      const isInside = fishPos >= barBottom && fishPos <= barTop;

      // Reel progression
      const reelMult = state.equippedRod.reelSpeedMultiplier;
      let progress = state.catchProgress;
      if (isInside) {
        progress += dt * 0.32 * reelMult;
      } else {
        progress -= dt * 0.28;
      }

      if (progress >= 1.0) {
        // VICTORY! FISH CAUGHT!
        const stats = generateFishStats(fish);
        const record: CaughtRecord = {
          species: fish,
          weight: stats.weight,
          length: stats.length,
          price: stats.price,
          caughtAt: Date.now(),
        };

        const existingBest = state.records[fish.id];
        const isNewRecord = !existingBest || stats.weight > existingBest.weight;

        set({
          phase: 'celebration',
          catchProgress: 1.0,
          lastCaught: record,
          records: isNewRecord ? { ...state.records, [fish.id]: record } : state.records,
          notification: `BẮT ĐƯỢC ${fish.name.toUpperCase()}! 🎉`,
          bobberPos: null,
        });
      } else if (progress <= 0.0) {
        // ESCAPED
        set({
          phase: 'escaped',
          catchProgress: 0,
          notification: `${fish.name} đã vùng vẫy thoát thân! 💨`,
          bobberPos: null,
          isFishing: false,
        });
      } else {
        set({
          barPos,
          barVelocity: barVel,
          fishPos,
          fishTargetPos: fishTarget,
          fishTimer,
          catchProgress: progress,
        });
      }
    }
  },

  claimCatch: () => {
    const { lastCaught } = get();
    if (lastCaught) {
      // Add fish item to inventory
      useInventoryStore.getState().addItem(lastCaught.species.id, 1);
    }
    set({
      phase: 'idle',
      isFishing: false,
      lastCaught: null,
      bobberPos: null,
    });
  },

  cancelFishing: () => {
    set({
      phase: 'idle',
      isFishing: false,
      bobberPos: null,
      targetFish: null,
      notification: null,
    });
  },

  clearNotification: () => {
    set({ notification: null });
  },
}));

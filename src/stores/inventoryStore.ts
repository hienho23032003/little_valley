import { create } from 'zustand';
import { ItemDefinition, getItemDefinition } from '../data/itemData';

export interface InventorySlot {
  slotIndex: number;
  itemId: string | null;
  quantity: number;
}

export interface InventoryState {
  slots: InventorySlot[];
  selectedHotbarIndex: number; // 0 to 8
  isInventoryOpen: boolean;
  coins: number;

  // Required API
  addItem: (itemId: string, quantity?: number) => boolean;
  removeItem: (itemId: string, quantity?: number) => boolean;
  hasItem: (itemId: string, quantity?: number) => boolean;
  getItemCount: (itemId: string) => number;

  // Currency API
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => boolean;
  hasCoins: (amount: number) => boolean;

  // Additional helper methods for UX & Hotbar
  selectHotbarSlot: (index: number) => void;
  getSelectedItem: () => ItemDefinition | null;
  getSelectedSlot: () => InventorySlot;
  toggleInventory: () => void;
  setInventoryOpen: (open: boolean) => void;
  swapSlots: (fromIndex: number, toIndex: number) => void;
  clearSlot: (slotIndex: number) => void;
}

export const TOTAL_SLOTS = 24;
export const HOTBAR_SLOTS_COUNT = 9;

function createInitialSlots(): InventorySlot[] {
  const slots: InventorySlot[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
    slotIndex: i,
    itemId: null,
    quantity: 0,
  }));

  // Initial Seed & Tool Setup for Hotbar (Slots 0 to 8, matching example [🌱][🌱][🌱][💧][🪓][⛏️])
  slots[0] = { slotIndex: 0, itemId: 'wheat_seed', quantity: 8 };
  slots[1] = { slotIndex: 1, itemId: 'corn_seed', quantity: 8 };
  slots[2] = { slotIndex: 2, itemId: 'carrot_seed', quantity: 8 };
  slots[3] = { slotIndex: 3, itemId: 'tomato_seed', quantity: 8 };
  slots[4] = { slotIndex: 4, itemId: 'watering_can', quantity: 1 };
  slots[5] = { slotIndex: 5, itemId: 'hoe', quantity: 1 };
  slots[6] = { slotIndex: 6, itemId: 'axe', quantity: 1 };
  slots[7] = { slotIndex: 7, itemId: 'pickaxe', quantity: 1 };
  slots[8] = { slotIndex: 8, itemId: 'wood', quantity: 64 };

  // Initial Backpack Items (Slots 9 to 23)
  slots[9] = { slotIndex: 9, itemId: 'stone', quantity: 48 };
  slots[10] = { slotIndex: 10, itemId: 'wheat', quantity: 15 }; // Stacked identical items
  slots[11] = { slotIndex: 11, itemId: 'carrot', quantity: 6 };
  slots[12] = { slotIndex: 12, itemId: 'bread', quantity: 3 };

  return slots;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  slots: createInitialSlots(),
  selectedHotbarIndex: 0,
  isInventoryOpen: false,
  coins: 1200,

  addCoins: (amount: number) => {
    if (amount <= 0) return;
    set((state) => ({ coins: state.coins + amount }));
  },

  removeCoins: (amount: number): boolean => {
    if (amount <= 0) return true;
    const { coins } = get();
    if (coins < amount) return false;
    set({ coins: coins - amount });
    return true;
  },

  hasCoins: (amount: number): boolean => {
    return get().coins >= amount;
  },

  getItemCount: (itemId: string): number => {
    const { slots } = get();
    return slots.reduce((total, slot) => {
      return slot.itemId === itemId ? total + slot.quantity : total;
    }, 0);
  },

  hasItem: (itemId: string, quantity = 1): boolean => {
    return get().getItemCount(itemId) >= quantity;
  },

  addItem: (itemId: string, quantity = 1): boolean => {
    const itemDef = getItemDefinition(itemId);
    if (!itemDef || quantity <= 0) return false;

    const { slots } = get();
    const newSlots = slots.map((s) => ({ ...s }));
    const maxStack = itemDef.maxStack || 99;
    let remaining = quantity;

    // 1. Stack into existing slots with matching itemId that aren't full
    for (const slot of newSlots) {
      if (slot.itemId === itemId && slot.quantity < maxStack) {
        const canTake = maxStack - slot.quantity;
        const toAdd = Math.min(canTake, remaining);
        slot.quantity += toAdd;
        remaining -= toAdd;
        if (remaining <= 0) break;
      }
    }

    // 2. Put remaining quantity into first empty slots
    if (remaining > 0) {
      for (const slot of newSlots) {
        if (slot.itemId === null || slot.quantity === 0) {
          const toAdd = Math.min(maxStack, remaining);
          slot.itemId = itemId;
          slot.quantity = toAdd;
          remaining -= toAdd;
          if (remaining <= 0) break;
        }
      }
    }

    if (remaining < quantity) {
      set({ slots: newSlots });
      return remaining === 0;
    }

    return false; // Inventory was full
  },

  removeItem: (itemId: string, quantity = 1): boolean => {
    if (quantity <= 0) return true;
    if (!get().hasItem(itemId, quantity)) return false;

    const { slots } = get();
    const newSlots = slots.map((s) => ({ ...s }));
    let needed = quantity;

    // Deduct starting from last matching slots to keep hotbar tidy
    for (let i = newSlots.length - 1; i >= 0; i--) {
      const slot = newSlots[i];
      if (slot.itemId === itemId) {
        if (slot.quantity <= needed) {
          needed -= slot.quantity;
          slot.itemId = null;
          slot.quantity = 0;
        } else {
          slot.quantity -= needed;
          needed = 0;
        }
        if (needed <= 0) break;
      }
    }

    set({ slots: newSlots });
    return true;
  },

  selectHotbarSlot: (index: number) => {
    if (index >= 0 && index < HOTBAR_SLOTS_COUNT) {
      set({ selectedHotbarIndex: index });
    }
  },

  getSelectedItem: (): ItemDefinition | null => {
    const { slots, selectedHotbarIndex } = get();
    const currentSlot = slots[selectedHotbarIndex];
    if (!currentSlot || !currentSlot.itemId) return null;
    return getItemDefinition(currentSlot.itemId) || null;
  },

  getSelectedSlot: (): InventorySlot => {
    const { slots, selectedHotbarIndex } = get();
    return slots[selectedHotbarIndex] || { slotIndex: 0, itemId: null, quantity: 0 };
  },

  toggleInventory: () => set((state) => ({ isInventoryOpen: !state.isInventoryOpen })),

  setInventoryOpen: (open: boolean) => set({ isInventoryOpen: open }),

  swapSlots: (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const { slots } = get();
    if (
      fromIndex < 0 ||
      fromIndex >= slots.length ||
      toIndex < 0 ||
      toIndex >= slots.length
    )
      return;

    const newSlots = slots.map((s) => ({ ...s }));
    const tempItem = newSlots[fromIndex].itemId;
    const tempQty = newSlots[fromIndex].quantity;

    newSlots[fromIndex].itemId = newSlots[toIndex].itemId;
    newSlots[fromIndex].quantity = newSlots[toIndex].quantity;

    newSlots[toIndex].itemId = tempItem;
    newSlots[toIndex].quantity = tempQty;

    set({ slots: newSlots });
  },

  clearSlot: (slotIndex: number) => {
    const { slots } = get();
    if (slotIndex < 0 || slotIndex >= slots.length) return;
    const newSlots = slots.map((s) =>
      s.slotIndex === slotIndex ? { ...s, itemId: null, quantity: 0 } : { ...s }
    );
    set({ slots: newSlots });
  },
}));

import { create } from 'zustand';
import { CharacterId, CHARACTERS, DEFAULT_NAMES, COLOR_OPTIONS } from '../data/characterData';

const STORAGE_KEY = 'little_valley_character_profile';

interface StoredProfile {
  characterId: CharacterId;
  playerName: string;
  farmName: string;
  selectedColor: string;
  isCreated: boolean;
}

const loadStoredProfile = (): StoredProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore local storage errors
  }
  return null;
};

const saved = loadStoredProfile();

export interface CharacterStoreState {
  selectedCharacterId: CharacterId;
  playerName: string;
  farmName: string;
  selectedColor: string;
  previewAnimation: 'Idle_A' | 'Walking_A' | 'Running_A' | 'Interact' | 'Jump_Full_Short';
  isCharacterCreated: boolean;
  showCharacterModal: boolean;

  // Actions
  selectCharacter: (id: CharacterId) => void;
  nextCharacter: () => void;
  prevCharacter: () => void;
  setPlayerName: (name: string) => void;
  setFarmName: (farmName: string) => void;
  setSelectedColor: (color: string) => void;
  setPreviewAnimation: (anim: 'Idle_A' | 'Walking_A' | 'Running_A' | 'Interact' | 'Jump_Full_Short') => void;
  randomizeName: () => void;
  completeCreation: () => void;
  openCharacterModal: () => void;
  closeCharacterModal: () => void;
}

const characterOrder: CharacterId[] = ['knight', 'mage', 'barbarian', 'ranger', 'rogue', 'rogue_hooded'];

export const useCharacterStore = create<CharacterStoreState>((set, get) => ({
  selectedCharacterId: saved?.characterId || 'knight',
  playerName: saved?.playerName || 'Khách',
  farmName: saved?.farmName || '',
  selectedColor: saved?.selectedColor || COLOR_OPTIONS[0].hex,
  previewAnimation: 'Idle_A',
  isCharacterCreated: saved?.isCreated ?? false,
  showCharacterModal: false,

  selectCharacter: (id: CharacterId) => {
    if (CHARACTERS[id]) {
      set({ selectedCharacterId: id });
    }
  },

  nextCharacter: () => {
    const currentId = get().selectedCharacterId;
    const currentIndex = characterOrder.indexOf(currentId);
    const nextIndex = (currentIndex + 1) % characterOrder.length;
    set({ selectedCharacterId: characterOrder[nextIndex] });
  },

  prevCharacter: () => {
    const currentId = get().selectedCharacterId;
    const currentIndex = characterOrder.indexOf(currentId);
    const prevIndex = (currentIndex - 1 + characterOrder.length) % characterOrder.length;
    set({ selectedCharacterId: characterOrder[prevIndex] });
  },

  setPlayerName: (name: string) => set({ playerName: name }),
  setFarmName: (farmName: string) => set({ farmName }),
  setSelectedColor: (color: string) => set({ selectedColor: color }),
  setPreviewAnimation: (anim) => set({ previewAnimation: anim }),

  randomizeName: () => {
    const idx = Math.floor(Math.random() * DEFAULT_NAMES.length);
    set({ playerName: DEFAULT_NAMES[idx] });
  },

  completeCreation: () => {
    const state = get();
    const profile: StoredProfile = {
      characterId: state.selectedCharacterId,
      playerName: state.playerName.trim() || 'Khách',
      farmName: state.farmName.trim() || 'Nông trại Mây Hồng',
      selectedColor: state.selectedColor,
      isCreated: true,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
    set({
      isCharacterCreated: true,
      showCharacterModal: false,
      playerName: profile.playerName,
      farmName: profile.farmName,
    });
  },

  openCharacterModal: () => set({ showCharacterModal: true }),
  closeCharacterModal: () => set({ showCharacterModal: false }),
}));

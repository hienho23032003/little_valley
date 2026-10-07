import { create } from 'zustand';
import { useFarmStore, TileState } from './farmStore';
import { useAnimalStore } from './animalStore';

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type TimePeriod = 'Morning' | 'Day' | 'Evening' | 'Night';

export interface TimeState {
  // Clock state
  timeOfDay: number; // 0.00 to 24.00 (in decimal hours)
  hour: number; // 0..23
  minute: number; // 0..59
  day: number; // 1..28
  season: Season;
  year: number; // 1, 2, ...
  period: TimePeriod;

  // Configuration
  timeScale: number; // Game seconds per real-world second (e.g. 60 = 1 real sec is 1 game min)
  isPaused: boolean;
  daysPerSeason: number;

  // Extensible Day Change Handlers
  dayChangeCallbacks: Array<(day: number, season: Season, year: number) => void>;

  // Actions
  tickTime: (deltaRealSeconds: number) => void;
  setTime: (hour: number, minute?: number) => void;
  setTimeScale: (scale: number) => void;
  togglePause: () => void;
  setSeason: (season: Season) => void;
  advanceToNextDay: () => void;
  registerDayChangeCallback: (cb: (day: number, season: Season, year: number) => void) => () => void;
}

export const SEASONS: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];

export function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 5 && hour < 10) return 'Morning';
  if (hour >= 10 && hour < 17) return 'Day';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
}

export function formatTime12Hour(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute < 10 ? `0${minute}` : `${minute}`;
  return `${displayHour}:${displayMinute} ${period}`;
}

export const useTimeStore = create<TimeState>((set, get) => ({
  timeOfDay: 8.5, // Start at 08:30 AM on Day 1
  hour: 8,
  minute: 30,
  day: 1,
  season: 'Spring',
  year: 1,
  period: 'Morning',

  // Default: 1 real second = 60 game seconds (1 game minute)
  // This means 1 real minute = 1 game hour. 24 real minutes = 1 full day.
  timeScale: 60,
  isPaused: false,
  daysPerSeason: 28,

  dayChangeCallbacks: [],

  tickTime: (deltaRealSeconds: number) => {
    const state = get();
    if (state.isPaused) return;

    // Convert delta seconds to game hours
    const gameSecondsPassed = deltaRealSeconds * state.timeScale;
    const gameHoursPassed = gameSecondsPassed / 3600;
    let newTimeOfDay = state.timeOfDay + gameHoursPassed;

    if (newTimeOfDay >= 24) {
      // 24:00 Rollover: Start a new day
      newTimeOfDay = newTimeOfDay % 24;
      state.advanceToNextDay();
    }

    // Always keep state.timeOfDay up-to-date in place for 60fps sun/sky calculations without React re-render churn
    (state as { timeOfDay: number }).timeOfDay = newTimeOfDay;

    const currentHour = Math.floor(newTimeOfDay);
    const currentMinute = Math.floor((newTimeOfDay - currentHour) * 60);

    // Only notify React subscribers when the displayed minute or hour changes
    if (currentMinute !== state.minute || currentHour !== state.hour) {
      const currentPeriod = getTimePeriod(currentHour);
      set({
        timeOfDay: newTimeOfDay,
        hour: currentHour,
        minute: currentMinute,
        period: currentPeriod,
      });
    }
  },

  setTime: (hour: number, minute = 0) => {
    const clampedHour = Math.max(0, Math.min(23, hour));
    const clampedMinute = Math.max(0, Math.min(59, minute));
    const newTimeOfDay = clampedHour + clampedMinute / 60;
    const currentPeriod = getTimePeriod(clampedHour);

    set({
      timeOfDay: newTimeOfDay,
      hour: clampedHour,
      minute: clampedMinute,
      period: currentPeriod,
    });
  },

  setTimeScale: (scale: number) => {
    set({ timeScale: Math.max(1, scale) });
  },

  togglePause: () => {
    set((state) => ({ isPaused: !state.isPaused }));
  },

  setSeason: (season: Season) => {
    set({ season });
  },

  advanceToNextDay: () => {
    const { day, season, year, daysPerSeason, dayChangeCallbacks } = get();

    let nextDay = day + 1;
    let nextSeason = season;
    let nextYear = year;

    if (nextDay > daysPerSeason) {
      nextDay = 1;
      const seasonIndex = SEASONS.indexOf(season);
      if (seasonIndex === SEASONS.length - 1) {
        nextSeason = SEASONS[0];
        nextYear = year + 1;
      } else {
        nextSeason = SEASONS[seasonIndex + 1];
      }
    }

    // 1. Advance crops that were watered today to next growth stage and reset watering state
    const farmState = useFarmStore.getState();
    let grownCount = 0;
    const updatedTiles = farmState.tiles.map((tile) => {
      if (tile.crop) {
        if (tile.crop.wateredToday) {
          grownCount++;
          // Watered crops advance to next growth stage (_1 -> _2 -> _3 -> _4)
          const nextStage = Math.min(3, tile.crop.stage + 1) as 0 | 1 | 2 | 3;
          const nextProgress = nextStage / 3.0;
          const nextState: TileState = nextStage === 3 ? 'READY' : 'GROWING';
          return {
            ...tile,
            state: nextState,
            crop: {
              ...tile.crop,
              stage: nextStage,
              growthProgress: nextProgress,
              wateredToday: false, // Reset watered state for new morning
            },
          };
        } else {
          // Unwatered crop does not progress overnight
          return {
            ...tile,
            crop: {
              ...tile.crop,
              wateredToday: false,
            },
          };
        }
      }
      return tile;
    });
    useFarmStore.setState({ tiles: updatedTiles });
    if (grownCount > 0) {
      useFarmStore.getState().addNotification(`Cây trồng đã lớn thêm một giai đoạn! 🌱`, '🌱', '#52b788');
    }
    useFarmStore.getState().addNotification(`Day ${nextDay} of ${nextSeason} has begun! 🌅`, '☀️', '#f4a261');

    // 2. Reset daily animal states (aging, daily products, hunger)
    useAnimalStore.getState().resetDailyAnimals(nextDay);

    // 3. Execute any registered day change callbacks (extensible for NPCs, events, etc.)
    dayChangeCallbacks.forEach((cb) => {
      try {
        cb(nextDay, nextSeason, nextYear);
      } catch (err) {
        console.error('Error in day change callback:', err);
      }
    });

    set({
      day: nextDay,
      season: nextSeason,
      year: nextYear,
    });
  },

  registerDayChangeCallback: (cb) => {
    set((state) => ({
      dayChangeCallbacks: [...state.dayChangeCallbacks, cb],
    }));

    return () => {
      set((state) => ({
        dayChangeCallbacks: state.dayChangeCallbacks.filter((c) => c !== cb),
      }));
    };
  },
}));

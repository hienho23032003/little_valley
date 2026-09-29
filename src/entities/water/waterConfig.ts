export interface WaterConfig {
  type: 'river' | 'lake';
  flowDirection: [number, number]; // Normalized flow vector [dx, dz] in world space
  flowSpeed: number;               // Flow animation speed
  waveStrength: number;            // Vertex displacement amplitude (in meters)
  rippleFrequency: number;         // Wave density scale
  deepColor: string;               // Deep channel water color
  shallowColor: string;            // Shoreline / clear water color
  foamColor: string;               // Wave crest & shoreline foam color
  highlightColor: string;          // Sun sparkle highlight color
  opacity: number;                 // Base water opacity (0.0 to 1.0)
  roughness: number;               // Surface roughness for specular glint
  playerInteractionRadius: number; // Max distance for player water ripples
}

export const RIVER_WATER_CONFIG: WaterConfig = {
  type: 'river',
  flowDirection: [1.0, 0.0], // West (X: -85) to East (X: +15) into Azure Lake
  flowSpeed: 0.35,           // Calmer, gentle flow (~58% reduction from 0.85)
  waveStrength: 0.0014,      // Very subtle vertex displacement (1.4mm, calm surface)
  rippleFrequency: 1.8,
  deepColor: '#2274a5',
  shallowColor: '#4ea8de',
  foamColor: '#e8f7fc',
  highlightColor: '#ffffff',
  opacity: 0.88,
  roughness: 0.15,
  playerInteractionRadius: 6.5,
};

export const LAKE_WATER_CONFIG: WaterConfig = {
  type: 'lake',
  flowDirection: [0.0, 0.0], // Calm omnidirectional surface
  flowSpeed: 0.14,
  waveStrength: 0.0018,
  rippleFrequency: 1.4,
  deepColor: '#1d6092',
  shallowColor: '#48cae4',
  foamColor: '#d8f3dc',
  highlightColor: '#ffffff',
  opacity: 0.86,
  roughness: 0.12,
  playerInteractionRadius: 7.0,
};

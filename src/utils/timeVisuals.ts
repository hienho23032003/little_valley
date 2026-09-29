import * as THREE from 'three';

export interface TimeVisualSettings {
  skyColor: THREE.Color;
  fogColor: THREE.Color;
  sunColor: THREE.Color;
  sunIntensity: number;
  sunPosition: [number, number, number];
  ambientColor: THREE.Color;
  ambientIntensity: number;
  hemiSkyColor: THREE.Color;
  hemiGroundColor: THREE.Color;
  hemiIntensity: number;
}

interface RawKeyframe {
  hour: number;
  skyColor: string;
  fogColor: string;
  sunColor: string;
  sunIntensity: number;
  sunPosition: [number, number, number];
  ambientColor: string;
  ambientIntensity: number;
  hemiSkyColor: string;
  hemiGroundColor: string;
  hemiIntensity: number;
}

interface ParsedKeyframe {
  hour: number;
  skyColor: THREE.Color;
  fogColor: THREE.Color;
  sunColor: THREE.Color;
  sunIntensity: number;
  sunPosition: [number, number, number];
  ambientColor: THREE.Color;
  ambientIntensity: number;
  hemiSkyColor: THREE.Color;
  hemiGroundColor: THREE.Color;
  hemiIntensity: number;
}

const RAW_KEYFRAMES: RawKeyframe[] = [
  // 00:00 - Midnight
  {
    hour: 0,
    skyColor: '#0f172a',
    fogColor: '#0f172a',
    sunColor: '#93c5fd',
    sunIntensity: 0.18,
    sunPosition: [-15, 30, -15],
    ambientColor: '#1e293b',
    ambientIntensity: 0.22,
    hemiSkyColor: '#1e293b',
    hemiGroundColor: '#0b1320',
    hemiIntensity: 0.35,
  },
  // 05:00 - Dawn / Pre-sunrise
  {
    hour: 5,
    skyColor: '#3a3247',
    fogColor: '#473d56',
    sunColor: '#f97316',
    sunIntensity: 0.35,
    sunPosition: [35, 8, 20],
    ambientColor: '#4c3957',
    ambientIntensity: 0.3,
    hemiSkyColor: '#6d597a',
    hemiGroundColor: '#2b2d42',
    hemiIntensity: 0.45,
  },
  // 06:30 - Sunrise / Golden Morning
  {
    hour: 6.5,
    skyColor: '#fecdd3',
    fogColor: '#fde0cf',
    sunColor: '#fdba74',
    sunIntensity: 1.2,
    sunPosition: [32, 20, 20],
    ambientColor: '#fed7aa',
    ambientIntensity: 0.45,
    hemiSkyColor: '#fed7aa',
    hemiGroundColor: '#65a30d',
    hemiIntensity: 0.75,
  },
  // 09:00 - Mid Morning Crisp
  {
    hour: 9,
    skyColor: '#bae6fd',
    fogColor: '#d4ebf7',
    sunColor: '#fef08a',
    sunIntensity: 1.6,
    sunPosition: [28, 38, 20],
    ambientColor: '#fff7ed',
    ambientIntensity: 0.4,
    hemiSkyColor: '#d8ecf8',
    hemiGroundColor: '#88bf58',
    hemiIntensity: 0.85,
  },
  // 12:00 - High Noon
  {
    hour: 12,
    skyColor: '#93c5fd',
    fogColor: '#cce6f8',
    sunColor: '#ffffff',
    sunIntensity: 1.85,
    sunPosition: [10, 48, 15],
    ambientColor: '#ffffff',
    ambientIntensity: 0.45,
    hemiSkyColor: '#e0f2fe',
    hemiGroundColor: '#9ecf6d',
    hemiIntensity: 0.95,
  },
  // 16:30 - Golden Afternoon
  {
    hour: 16.5,
    skyColor: '#fde68a',
    fogColor: '#fdeac2',
    sunColor: '#fbbf24',
    sunIntensity: 1.5,
    sunPosition: [-20, 32, 20],
    ambientColor: '#fef3c7',
    ambientIntensity: 0.45,
    hemiSkyColor: '#fef3c7',
    hemiGroundColor: '#84cc16',
    hemiIntensity: 0.85,
  },
  // 18:30 - Sunset
  {
    hour: 18.5,
    skyColor: '#fb7185',
    fogColor: '#ea580c',
    sunColor: '#ea580c',
    sunIntensity: 1.1,
    sunPosition: [-36, 12, 18],
    ambientColor: '#fb923c',
    ambientIntensity: 0.35,
    hemiSkyColor: '#f43f5e',
    hemiGroundColor: '#3f3f46',
    hemiIntensity: 0.65,
  },
  // 20:30 - Dusk
  {
    hour: 20.5,
    skyColor: '#312e81',
    fogColor: '#27203b',
    sunColor: '#818cf8',
    sunIntensity: 0.3,
    sunPosition: [-30, 8, -10],
    ambientColor: '#312e81',
    ambientIntensity: 0.25,
    hemiSkyColor: '#3730a3',
    hemiGroundColor: '#1e293b',
    hemiIntensity: 0.42,
  },
  // 24:00 - Midnight wrap
  {
    hour: 24,
    skyColor: '#0f172a',
    fogColor: '#0f172a',
    sunColor: '#93c5fd',
    sunIntensity: 0.18,
    sunPosition: [-15, 30, -15],
    ambientColor: '#1e293b',
    ambientIntensity: 0.22,
    hemiSkyColor: '#1e293b',
    hemiGroundColor: '#0b1320',
    hemiIntensity: 0.35,
  },
];

// Pre-parse keyframe colors ONCE at startup to eliminate all runtime allocations
const PARSED_KEYFRAMES: ParsedKeyframe[] = RAW_KEYFRAMES.map((k) => ({
  hour: k.hour,
  skyColor: new THREE.Color(k.skyColor),
  fogColor: new THREE.Color(k.fogColor),
  sunColor: new THREE.Color(k.sunColor),
  sunIntensity: k.sunIntensity,
  sunPosition: k.sunPosition,
  ambientColor: new THREE.Color(k.ambientColor),
  ambientIntensity: k.ambientIntensity,
  hemiSkyColor: new THREE.Color(k.hemiSkyColor),
  hemiGroundColor: new THREE.Color(k.hemiGroundColor),
  hemiIntensity: k.hemiIntensity,
}));

// Pre-allocated static output cache objects to guarantee ZERO runtime allocations in useFrame
const outSkyColor = new THREE.Color();
const outFogColor = new THREE.Color();
const outSunColor = new THREE.Color();
const outAmbientColor = new THREE.Color();
const outHemiSkyColor = new THREE.Color();
const outHemiGroundColor = new THREE.Color();
const outSunPosition: [number, number, number] = [0, 0, 0];

const cachedVisualResult: TimeVisualSettings = {
  skyColor: outSkyColor,
  fogColor: outFogColor,
  sunColor: outSunColor,
  sunIntensity: 1.0,
  sunPosition: outSunPosition,
  ambientColor: outAmbientColor,
  ambientIntensity: 0.4,
  hemiSkyColor: outHemiSkyColor,
  hemiGroundColor: outHemiGroundColor,
  hemiIntensity: 0.8,
};

export function calculateTimeVisuals(timeOfDay: number): TimeVisualSettings {
  const hour = Math.max(0, Math.min(24, timeOfDay));

  // Find adjacent keyframes
  let k1 = PARSED_KEYFRAMES[0];
  let k2 = PARSED_KEYFRAMES[1];

  for (let i = 0; i < PARSED_KEYFRAMES.length - 1; i++) {
    if (hour >= PARSED_KEYFRAMES[i].hour && hour <= PARSED_KEYFRAMES[i + 1].hour) {
      k1 = PARSED_KEYFRAMES[i];
      k2 = PARSED_KEYFRAMES[i + 1];
      break;
    }
  }

  const range = k2.hour - k1.hour;
  const t = range === 0 ? 0 : (hour - k1.hour) / range;

  // Smooth Hermite interpolation factor
  const smoothT = t * t * (3 - 2 * t);

  outSkyColor.copy(k1.skyColor).lerp(k2.skyColor, smoothT);
  outFogColor.copy(k1.fogColor).lerp(k2.fogColor, smoothT);
  outSunColor.copy(k1.sunColor).lerp(k2.sunColor, smoothT);
  outAmbientColor.copy(k1.ambientColor).lerp(k2.ambientColor, smoothT);
  outHemiSkyColor.copy(k1.hemiSkyColor).lerp(k2.hemiSkyColor, smoothT);
  outHemiGroundColor.copy(k1.hemiGroundColor).lerp(k2.hemiGroundColor, smoothT);

  cachedVisualResult.sunIntensity = THREE.MathUtils.lerp(k1.sunIntensity, k2.sunIntensity, smoothT);
  cachedVisualResult.ambientIntensity = THREE.MathUtils.lerp(k1.ambientIntensity, k2.ambientIntensity, smoothT);
  cachedVisualResult.hemiIntensity = THREE.MathUtils.lerp(k1.hemiIntensity, k2.hemiIntensity, smoothT);

  outSunPosition[0] = THREE.MathUtils.lerp(k1.sunPosition[0], k2.sunPosition[0], smoothT);
  outSunPosition[1] = THREE.MathUtils.lerp(k1.sunPosition[1], k2.sunPosition[1], smoothT);
  outSunPosition[2] = THREE.MathUtils.lerp(k1.sunPosition[2], k2.sunPosition[2], smoothT);

  return cachedVisualResult;
}

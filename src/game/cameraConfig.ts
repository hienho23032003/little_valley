export interface CameraConfig {
  defaultDistance: number;
  minDistance: number;
  maxDistance: number;
  defaultPolarAngle: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  rotationSpeed: number;
  zoomSpeed: number;
  lerpFactor: number;
  baseFov: number;
}

export const CAMERA_CONFIG: CameraConfig = {
  defaultDistance: 46,
  minDistance: 14,
  maxDistance: 75,
  defaultPolarAngle: Math.PI / 4, // 45 degrees pitch
  minPolarAngle: (Math.PI / 180) * 28, // 28 degrees pitch (top-down view limit)
  maxPolarAngle: (Math.PI / 180) * 72, // 72 degrees pitch (ground clipping limit)
  rotationSpeed: 0.007,
  zoomSpeed: 0.035,
  lerpFactor: 4.2,
  baseFov: 44,
};

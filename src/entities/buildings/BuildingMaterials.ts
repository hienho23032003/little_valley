export function getBuildingMaterialProps(
  originalColor: string,
  isGhost?: boolean,
  isValid = true
) {
  if (isGhost) {
    return {
      color: isValid ? '#52b788' : '#e63946',
      transparent: true,
      opacity: 0.65,
      roughness: 0.4,
      metalness: 0.05,
      emissive: isValid ? '#2d6a4f' : '#9b2226',
      emissiveIntensity: 0.35,
      depthWrite: true,
    };
  }
  return {
    color: originalColor,
    roughness: 0.8,
    transparent: false,
    opacity: 1.0,
  };
}

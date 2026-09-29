import * as THREE from 'three';
import { WaterConfig } from './waterConfig';

export const waterVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWaterType; // 0.0 = river, 1.0 = lake
  uniform vec2 uFlowDir;
  uniform float uFlowSpeed;
  uniform float uWaveStrength;
  uniform vec3 uPlayerPos;
  uniform float uPlayerSpeed;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vWaveHeight;

  void main() {
    vUv = uv;

    vec4 initialWorldPos = modelMatrix * vec4(position, 1.0);
    float wave = 0.0;

    if (uWaterType < 0.5) {
      // 1. RIVER: Directional flow waves along river axis (West to East along +X)
      // Calm, gentle, non-wobbling surface displacement
      float flowCoord = dot(initialWorldPos.xz, uFlowDir);
      float crossCoord = initialWorldPos.x * uFlowDir.y - initialWorldPos.z * uFlowDir.x;

      float w1 = sin(flowCoord * 0.7 - uTime * (uFlowSpeed * 1.1) + sin(crossCoord * 0.5) * 0.35) * 0.65;
      float w2 = cos(flowCoord * 1.3 - uTime * (uFlowSpeed * 1.4) + crossCoord * 0.75) * 0.35;
      wave = (w1 + w2) * uWaveStrength;
    } else {
      // 2. LAKE: Calm, breathing swell and gentle radial pulses
      vec2 lakeCenter = vec2(43.75, 43.0);
      float distFromCenter = length(initialWorldPos.xz - lakeCenter);
      float w1 = sin(distFromCenter * 0.4 - uTime * 0.9) * 0.6;
      float w2 = cos(initialWorldPos.x * 0.28 + initialWorldPos.z * 0.26 - uTime * 0.65) * 0.4;
      wave = (w1 + w2) * uWaveStrength;
    }

    // 3. PLAYER INTERACTION: Subtle physical ripple bump around player position
    float pDist = length(initialWorldPos.xz - uPlayerPos.xz);
    if (pDist < 6.5) {
      float pRipple = sin(pDist * 4.5 - uTime * 5.5) * exp(-pDist * 0.6) * smoothstep(6.5, 0.4, pDist);
      wave += pRipple * 0.003 * max(0.2, min(uPlayerSpeed, 1.4));
    }

    // Displace along local normal (local +Z points along world +Y after -PI/2 X rotation)
    vec3 displacedPos = position + normal * wave;
    vWaveHeight = wave;

    vec4 finalWorldPos = modelMatrix * vec4(displacedPos, 1.0);
    vWorldPos = finalWorldPos.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * viewMatrix * finalWorldPos;
  }
`;

export const waterFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uWaterType; // 0.0 = river, 1.0 = lake
  uniform vec2 uFlowDir;
  uniform float uFlowSpeed;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFoamColor;
  uniform vec3 uHighlightColor;
  uniform float uOpacity;
  uniform vec3 uSunDir;
  uniform vec3 uPlayerPos;
  uniform float uPlayerSpeed;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vWaveHeight;

  void main() {
    vec3 waterColor = uDeepColor;
    float foamFactor = 0.0;
    float highlightFactor = 0.0;

    if (uWaterType < 0.5) {
      // ========================================================
      // 1. REFINED NATURAL RIVER FLOW EFFECT (PEACEFUL COUNTRYSIDE STREAM)
      // Directional flow follows river axis West to East (+X)
      // ========================================================
      // River length ~100m, width ~5.4m -> isotropic aspect ratio ~18.5
      vec2 flowUv = vec2(vUv.x * 18.5, vUv.y);
      float flowTime = uTime * uFlowSpeed;

      // Parabolic channel velocity: center flows slightly faster than banks
      float bankDist = abs(vUv.y - 0.5) * 2.0; // 0.0 at center, 1.0 at banks
      float channelVelocity = mix(1.15, 0.78, bankDist * bankDist);

      // --- LAYER 1: Primary Slow Directional Flow ---
      // Gentle downstream curve bowing smoothly downstream in center
      float gentleBow = sin(vUv.y * 3.14159) * 0.45;
      float flowX1 = flowUv.x - flowTime * 0.82 * channelVelocity + gentleBow;
      float layer1_waveA = sin(flowX1 * 1.1 + sin(vUv.y * 2.5) * 0.6);
      float layer1_waveB = cos(flowX1 * 1.7 - flowUv.y * 1.3);
      float primaryFlow = layer1_waveA * 0.6 + layer1_waveB * 0.4;

      // --- LAYER 2: Secondary Surface Movement (Cross-Drift & Different Scale/Speed) ---
      // Moves at a different speed, finer scale, and slight angled cross-current drift
      float flowX2 = flowUv.x * 1.6 - flowTime * 0.52 + sin(flowUv.y * 4.0 + flowTime * 0.25) * 0.35;
      float layer2_wave = sin(flowX2 * 1.8 + flowUv.y * 3.2) * cos(flowX2 * 1.1 - flowUv.y * 2.1);

      // --- LAYER 3: Subtle Micro-Ripples & Wave Distortion ---
      // Micro surface perturbation warped by Layer 1 & Layer 2 for organic variation
      vec2 warpUv = flowUv * 3.2 + vec2(primaryFlow * 0.18, layer2_wave * 0.14);
      float rippleTime = flowTime * 0.95 * channelVelocity;
      float r1 = sin(warpUv.x * 2.2 - rippleTime * 1.2 + warpUv.y * 1.4);
      float r2 = cos(warpUv.x * 3.1 - rippleTime * 1.6 - warpUv.y * 1.8);
      float fineRipples = (r1 * 0.55 + r2 * 0.45) * 0.5 + 0.5;

      // Subtle, stylized foam crest lines (only at wave convergence, not a mechanical grid)
      float crestEnergy = primaryFlow * 0.5 + layer2_wave * 0.3 + (fineRipples - 0.5) * 0.4;
      float crest = smoothstep(0.72, 0.94, crestEnergy) * smoothstep(0.92, 0.4, bankDist) * 0.45;

      // Shoreline edge foam: peaceful soft lapping rim along the riverbank slopes
      float edgeNoise = sin(flowUv.x * 2.2 - flowTime * 0.4) * 0.25 + cos(flowUv.x * 4.5 + flowTime * 0.3) * 0.15;
      float edgeFoam = smoothstep(0.76, 0.98, bankDist + edgeNoise * 0.12);
      edgeFoam *= (0.55 + 0.45 * sin(uTime * 0.9 + flowUv.x * 0.8));

      foamFactor = clamp(crest + edgeFoam * 0.82, 0.0, 1.0);

      // Water depth color gradient: deeper sapphire blue in center, turquoise clear water near banks
      float depthMix = smoothstep(0.92, 0.2, bankDist);
      waterColor = mix(uShallowColor, uDeepColor, depthMix);
      // Subtle secondary tint from fine ripples
      waterColor += (fineRipples - 0.5) * 0.04;

      // --- LAYER 4: Moving Elongated Highlights ---
      // Sunlight glints stretched horizontally along the flow direction, fading in and out slowly
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      vec3 halfVec = normalize(uSunDir + viewDir);
      float NdotH = max(dot(vNormal, halfVec), 0.0);
      float specular = pow(NdotH, 28.0);

      // Elongated highlight streaks along stream
      float streakCoordX = flowUv.x * 2.8 - flowTime * 0.7 * channelVelocity;
      float streakCoordY = flowUv.y * 8.5 + sin(flowUv.x * 1.2) * 0.8;
      float streakPattern = smoothstep(0.68, 0.95, sin(streakCoordX) * cos(streakCoordY));
      
      // Breathing envelope so streaks appear & vanish gradually rather than flashing
      float breath = sin(vWorldPos.x * 0.25 + flowTime * 0.4) * 0.5 + 0.5;
      float glancingFresnel = pow(1.0 - max(dot(viewDir, vec3(0.0, 1.0, 0.0)), 0.0), 2.5);

      highlightFactor = specular * (0.35 + 0.65 * primaryFlow) + streakPattern * 0.22 * breath * (0.3 + 0.7 * glancingFresnel);

    } else {
      // ========================================================
      // 2. AZURE LAKE EFFECT
      // Calm, soft ripples, shimmering caustics, and peaceful lapping
      // ========================================================
      // Lake dimensions: 56.5m x 44.0m
      vec2 lakeUv = (vUv - vec2(0.5)) * vec2(56.5, 44.0) * 0.18;
      float lakeTime = uTime * uFlowSpeed;

      // Stylized shallow water caustics (gentle sunlight interference)
      float c1 = sin(lakeUv.x * 1.8 + lakeTime * 1.2) * cos(lakeUv.y * 1.6 - lakeTime * 0.9);
      float c2 = sin(lakeUv.x * 1.1 - lakeUv.y * 1.3 + lakeTime * 1.5);
      float c3 = cos(lakeUv.x * 1.5 + lakeUv.y * 0.9 - lakeTime * 1.1);
      float caustics = smoothstep(0.38, 0.78, (c1 + c2 + c3) / 3.0);

      // Concentric calm ripples radiating softly from center
      float r = length(lakeUv);
      float radialRipples = sin(r * 2.6 - uTime * 0.8) * 0.5 + 0.5;
      float gentleCrossWaves = (cos(lakeUv.x * 1.4 + lakeUv.y * 1.2 + uTime * 0.4) * 0.5 + 0.5);
      float lakeRipples = radialRipples * 0.6 + gentleCrossWaves * 0.4;

      // Soft shoreline rim around the perimeter of the lake
      vec2 uvFromCenter = abs(vUv - vec2(0.5)) * 2.0;
      float shoreDist = length(uvFromCenter);
      float lakeShoreFoam = smoothstep(0.84, 0.99, shoreDist) * (0.65 + 0.35 * sin(uTime * 1.6 + r * 1.8));

      // Color gradient: deep azure in center, bright turquoise near shoreline
      float depthFactor = smoothstep(0.95, 0.25, shoreDist);
      waterColor = mix(uShallowColor, uDeepColor, depthFactor);

      foamFactor = clamp(lakeShoreFoam * 0.78 + caustics * 0.38 + smoothstep(0.75, 0.98, lakeRipples) * 0.22, 0.0, 1.0);

      // Gentle sun glint on lake ripples
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      vec3 halfVec = normalize(uSunDir + viewDir);
      float spec = pow(max(dot(vNormal, halfVec), 0.0), 22.0);
      highlightFactor = spec * 0.38 * lakeRipples;
    }

    // ========================================================
    // 3. PLAYER INTERACTION RIPPLE (RIVER & LAKE)
    // Dynamic concentric ripple rings expanding from player
    // ========================================================
    float pDist = length(vWorldPos.xz - uPlayerPos.xz);
    if (pDist < 6.5) {
      float pWave = sin(pDist * 4.8 - uTime * 5.2) * 0.5 + 0.5;
      float pRing = smoothstep(0.42, 0.82, pWave) * smoothstep(6.5, 0.3, pDist);
      float pIntensity = min(uPlayerSpeed, 1.2) * 0.52 + 0.22;
      foamFactor = max(foamFactor, pRing * pIntensity);
    }

    // Composite final stylized color
    vec3 finalColor = mix(waterColor, uFoamColor, foamFactor * 0.74);
    finalColor += uHighlightColor * (highlightFactor * 0.55);

    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

export function createWaterMaterial(config: WaterConfig): THREE.ShaderMaterial {
  const uniforms = {
    uTime: { value: 0 },
    uWaterType: { value: config.type === 'river' ? 0.0 : 1.0 },
    uFlowDir: { value: new THREE.Vector2(...config.flowDirection) },
    uFlowSpeed: { value: config.flowSpeed },
    uWaveStrength: { value: config.waveStrength },
    uRippleFrequency: { value: config.rippleFrequency },
    uDeepColor: { value: new THREE.Color(config.deepColor) },
    uShallowColor: { value: new THREE.Color(config.shallowColor) },
    uFoamColor: { value: new THREE.Color(config.foamColor) },
    uHighlightColor: { value: new THREE.Color(config.highlightColor) },
    uOpacity: { value: config.opacity },
    uSunDir: { value: new THREE.Vector3(0.5, 0.8, 0.35).normalize() },
    uPlayerPos: { value: new THREE.Vector3(0, 0, 4) },
    uPlayerSpeed: { value: 0.0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    transparent: true,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
  });
}

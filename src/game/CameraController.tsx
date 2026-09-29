import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../stores/gameStore';
import { useBuildStore } from '../stores/buildStore';
import { CAMERA_CONFIG } from './cameraConfig';
import { inputManager } from '../systems/inputManager';

// Reusable temporary vector to avoid allocations inside useFrame
const tmpLookAt = new THREE.Vector3();
const tmpDesiredPos = new THREE.Vector3();

export const CameraController: React.FC = () => {
  const { camera, size, gl } = useThree();
  const worldBounds = useGameStore((state) => state.worldBounds);

  // Authoritative single source of truth for orbit state in spherical coordinates
  const sphericalRef = useRef({
    radius: CAMERA_CONFIG.defaultDistance,
    targetRadius: CAMERA_CONFIG.defaultDistance,
    theta: 0, // Azimuth horizontal angle (0 rad = south looking north)
    targetTheta: 0,
    phi: CAMERA_CONFIG.defaultPolarAngle, // Polar pitch angle (45 degrees down)
    targetPhi: CAMERA_CONFIG.defaultPolarAngle,
  });

  // Authoritative focal target in world space
  const initialPos = useGameStore.getState().playerPosition;
  const currentLookAt = useRef(new THREE.Vector3(initialPos[0], initialPos[1] || 0, initialPos[2]));

  // Track dragging state and multi-touch gestures
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const activeTouches = useRef<Map<number, { x: number; y: number }>>(new Map());
  const touchDistance = useRef<number | null>(null);

  // Event handlers for desktop mouse and mobile touch controls
  useEffect(() => {
    const domElement = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        activeTouches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (activeTouches.current.size >= 2) {
          // Entering 2-finger pinch mode: disable single-finger orbit dragging immediately
          isDragging.current = false;
          const touches = Array.from(activeTouches.current.values());
          touchDistance.current = Math.hypot(
            touches[0].x - touches[1].x,
            touches[0].y - touches[1].y
          );
          return;
        }
      }

      // Allow orbit on right click (button 2), middle click (button 1),
      // or left click (button 0) when NOT in build placement mode
      const isPlacingBuilding = useBuildStore.getState().selectedBuildingId !== null;
      if (e.button === 2 || e.button === 1 || (!isPlacingBuilding && e.button === 0)) {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // 1. Multi-touch handling: Two-finger pinch gesture purely modifies zoom
      if (e.pointerType === 'touch') {
        if (activeTouches.current.has(e.pointerId)) {
          activeTouches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        }

        if (activeTouches.current.size >= 2) {
          isDragging.current = false; // Never orbit during pinch
          const touches = Array.from(activeTouches.current.values());
          const dist = Math.hypot(
            touches[0].x - touches[1].x,
            touches[0].y - touches[1].y
          );

          if (touchDistance.current !== null) {
            const deltaDist = touchDistance.current - dist;
            const s = sphericalRef.current;
            s.targetRadius += deltaDist * 0.12;
            s.targetRadius = THREE.MathUtils.clamp(
              s.targetRadius,
              CAMERA_CONFIG.minDistance,
              CAMERA_CONFIG.maxDistance
            );
          }
          touchDistance.current = dist;
          return;
        }
      }

      // 2. Single-pointer orbit drag (desktop mouse or single touch)
      if (!isDragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragStart.current = { x: e.clientX, y: e.clientY };

      const s = sphericalRef.current;
      // Rotate azimuth (horizontal 360 degrees)
      s.targetTheta -= dx * CAMERA_CONFIG.rotationSpeed;

      // Rotate polar pitch (clamped within safe limits)
      // Touch convention: swipe UP pitches up, swipe DOWN pitches down
      const pitchFactor = e.pointerType === 'touch' ? -1 : 1;
      s.targetPhi += dy * pitchFactor * CAMERA_CONFIG.rotationSpeed;
      s.targetPhi = THREE.MathUtils.clamp(
        s.targetPhi,
        CAMERA_CONFIG.minPolarAngle,
        CAMERA_CONFIG.maxPolarAngle
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        activeTouches.current.delete(e.pointerId);
        if (activeTouches.current.size < 2) {
          touchDistance.current = null;
        }
        if (activeTouches.current.size === 0) {
          isDragging.current = false;
        }
      } else {
        isDragging.current = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Normalize wheel delta across browsers and input devices (trackpad vs notched wheel)
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 20; // Firefox lines mode
      else if (e.deltaMode === 2) dy *= 80; // Pages mode
      // Clamp per-event delta to eliminate sudden jumps
      dy = THREE.MathUtils.clamp(dy, -80, 80);

      const s = sphericalRef.current;
      s.targetRadius += dy * 0.032;
      s.targetRadius = THREE.MathUtils.clamp(
        s.targetRadius,
        CAMERA_CONFIG.minDistance,
        CAMERA_CONFIG.maxDistance
      );
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });
    domElement.addEventListener('contextmenu', preventContextMenu);

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [gl]);

  // Responsive camera resize handler
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const aspect = size.width / Math.max(size.height, 1);
      camera.aspect = aspect;

      // Adjust FOV dynamically on narrow/portrait viewports so table is never cropped
      if (aspect < 1.6) {
        camera.fov = Math.min(74, CAMERA_CONFIG.baseFov * (1.6 / Math.max(aspect, 0.55)));
      } else {
        camera.fov = CAMERA_CONFIG.baseFov;
      }

      camera.near = 1.0;
      camera.far = 300;
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = sphericalRef.current;

    // Smoothly interpolate orbit values (single unified damping)
    const lerpRate = Math.min(dt * 8.0, 1.0);
    s.radius = THREE.MathUtils.lerp(s.radius, s.targetRadius, lerpRate);
    s.theta = THREE.MathUtils.lerp(s.theta, s.targetTheta, lerpRate);
    s.phi = THREE.MathUtils.lerp(s.phi, s.targetPhi, lerpRate);

    // Sync camera horizontal angle for camera-relative player movement without triggering React re-renders
    inputManager.setCameraAngle(s.theta);
    (useGameStore.getState() as { cameraAngle: number }).cameraAngle = s.theta;

    // Read player position directly from store to avoid React re-renders on camera
    const [px, py, pz] = useGameStore.getState().playerPosition;

    // Clamp follow target within comfortable bounds of the world
    const maxFollowX = worldBounds.maxX * 0.85;
    const minFollowX = worldBounds.minX * 0.85;
    const maxFollowZ = worldBounds.maxZ * 0.85;
    const minFollowZ = worldBounds.minZ * 0.85;

    const clampedTargetX = THREE.MathUtils.clamp(px, minFollowX, maxFollowX);
    const clampedTargetZ = THREE.MathUtils.clamp(pz, minFollowZ, maxFollowZ);
    const targetY = py || 0;

    tmpLookAt.set(clampedTargetX, targetY, clampedTargetZ);
    currentLookAt.current.lerp(tmpLookAt, lerpRate);

    // Spherical to Cartesian coordinate conversion:
    // x = r * sin(phi) * sin(theta)
    // y = r * cos(phi)
    // z = r * sin(phi) * cos(theta)
    const sinPhi = Math.sin(s.phi);
    const cosPhi = Math.cos(s.phi);
    const sinTheta = Math.sin(s.theta);
    const cosTheta = Math.cos(s.theta);

    tmpDesiredPos.set(
      currentLookAt.current.x + s.radius * sinPhi * sinTheta,
      currentLookAt.current.y + s.radius * cosPhi,
      currentLookAt.current.z + s.radius * sinPhi * cosTheta
    );

    // FIX: Set camera position directly to the smooth spherical position.
    // Previously, an extra Cartesian camera.position.lerp() cut across spherical chords,
    // causing radial distance oscillation and camera vibration during zoom.
    camera.position.copy(tmpDesiredPos);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

import React, { useEffect, useRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useBuildStore } from '../../stores/buildStore';
import { getBuildingDefinition } from '../../data/buildingData';
import { BuildingRenderer } from './BuildingRenderer';

export const BuildingPlacementManager: React.FC = () => {
  const selectedBuildingId = useBuildStore((state) => state.selectedBuildingId);
  const previewPosition = useBuildStore((state) => state.previewPosition);
  const previewRotation = useBuildStore((state) => state.previewRotation);
  const isValidPlacement = useBuildStore((state) => state.isValidPlacement);

  const setPreviewPosition = useBuildStore((state) => state.setPreviewPosition);
  const rotatePreview = useBuildStore((state) => state.rotatePreview);
  const placeBuilding = useBuildStore((state) => state.placeBuilding);
  const cancelPlacement = useBuildStore((state) => state.cancelPlacement);
  const toggleBuildMenu = useBuildStore((state) => state.toggleBuildMenu);

  const selectedDef = selectedBuildingId ? getBuildingDefinition(selectedBuildingId) : null;

  // Keyboard shortcut listener for B (menu), R (rotate), and Escape (cancel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.code === 'KeyB') {
        e.preventDefault();
        toggleBuildMenu();
      } else if (e.code === 'KeyR' && selectedBuildingId) {
        e.preventDefault();
        rotatePreview();
      } else if (e.code === 'Escape') {
        if (selectedBuildingId) {
          e.preventDefault();
          cancelPlacement();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBuildingId, rotatePreview, cancelPlacement, toggleBuildMenu]);

  // Handle pointer move across terrain to update ghost preview coordinates
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!selectedBuildingId) return;
    e.stopPropagation();

    // Snap to 0.5 meter grid for clean, satisfying placement
    const snapX = Math.round(e.point.x * 2) / 2;
    const snapZ = Math.round(e.point.z * 2) / 2;

    setPreviewPosition([snapX, 0, snapZ]);
  };

  // Handle left click to place
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!selectedBuildingId) return;
    // Only handle primary left click (button === 0)
    if (e.button === 0) {
      e.stopPropagation();
      placeBuilding();
    }
  };

  // Pulse animation for ghost footprint
  const footprintRef = useRef<THREE.Mesh>(null);

  const footprintColor = isValidPlacement ? '#52b788' : '#e63946';

  return (
    <group>
      {/* 1. All Constructed & Placed Buildings in the World (isolated & memoized) */}
      <PlacedBuildingsList />

      {/* 2. Invisible Raycast Ground Plane (Only active during placement mode) */}
      {selectedBuildingId && (
        <mesh
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
        >
          <planeGeometry args={[76, 76]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}

      {/* 3. Ghost Preview & Placement Footprint */}
      {selectedBuildingId && selectedDef && (
        <group position={previewPosition} rotation={[0, previewRotation, 0]}>
          {/* Ground Footprint Plane */}
          <mesh
            ref={footprintRef}
            position={[0, 0.04, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[selectedDef.size[0], selectedDef.size[1]]} />
            <meshBasicMaterial
              color={footprintColor}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Footprint Boundary Lines */}
          <lineSegments position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <edgesGeometry
              args={[new THREE.PlaneGeometry(selectedDef.size[0], selectedDef.size[1])]}
            />
            <lineBasicMaterial color={footprintColor} linewidth={2} />
          </lineSegments>

          {/* Front Entrance Pointer Arrow */}
          <mesh
            position={[0, 0.06, selectedDef.size[1] / 2 + 0.35]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <coneGeometry args={[0.3, 0.5, 3]} />
            <meshBasicMaterial color={footprintColor} />
          </mesh>

          {/* Ghost 3D Building Preview */}
          <BuildingRenderer
            buildingTypeId={selectedBuildingId}
            isGhost={true}
            isValid={isValidPlacement}
          />
        </group>
      )}
    </group>
  );
};

const PlacedBuildingsList: React.FC = React.memo(() => {
  const placedBuildings = useBuildStore((state) => state.placedBuildings);
  return (
    <group>
      {placedBuildings.map((building) => (
        <group
          key={building.id}
          position={building.position}
          rotation={[0, building.rotation, 0]}
        >
          <BuildingRenderer buildingTypeId={building.buildingTypeId} isGhost={false} />
        </group>
      ))}
    </group>
  );
});

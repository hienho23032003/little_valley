import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { PALETTE } from '../../utils/colors';
import { CozyBarnModel } from '../buildings/CozyBarnModel';

// ======================================================================
// 1. CHICKEN COOP STRUCTURE (Elevated chunky house, ramp, nesting box, fenced run)
// ======================================================================
const CHICKEN_COOP_URL = '/models/farm_buildings/ChickenCoop.glb';

const ChickenCoop3D: React.FC = () => {
  const { scene } = useGLTF(CHICKEN_COOP_URL);
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            const m = mat as THREE.MeshStandardMaterial;
            m.metalness = 0;
            m.roughness = 0.85;
            if (m.name === 'RoofBlack') {
              m.color.set('#495057');
            } else if (m.name === 'DarkRed' || m.name === 'LightRed') {
              m.color.set('#c84b31');
            } else if (m.name === 'Brown') {
              m.color.set('#c08552');
            } else if (m.name === 'White') {
              m.color.set('#f4f1de');
            }
          });
        }
      }
    });
    return c;
  }, [scene]);
  return <primitive object={clone} scale={[1.4, 1.4, 1.4]} position={[0, 0, 0]} />;
};


export const ChickenCoopStructure: React.FC = () => {
  const honeyWood = '#c08552';
  const darkTimber = '#4a2810';
  const warmPine = '#ddb892';
  const terracottaRoof = '#d96b43';
  const strawColor = '#f4e285';
  const metalColor = '#495057';
  const waterBlue = '#0077b6';

  return (
    <group position={[-15.0, 0, 5.5]}>
      {/* --- A. Real 3D Chicken Coop House from Quaternius Farm Buildings --- */}
      <group position={[-1.0, 0, -0.6]}>
        <ChickenCoop3D />
      </group>
      <group visible={false} position={[-1.1, 0, -0.8]}>
        {/* 4 Stone Pad Footings */}
        {[
          [-0.7, -0.6],
          [0.7, -0.6],
          [-0.7, 0.6],
          [0.7, 0.6],
        ].map(([x, z], idx) => (
          <mesh key={`pad-${idx}`} position={[x, 0.08, z]} castShadow receiveShadow>
            <boxGeometry args={[0.26, 0.16, 0.26]} />
            <meshStandardMaterial color="#6c757d" roughness={0.9} flatShading />
          </mesh>
        ))}

        {/* 4 Sturdy Chunky Timber Stilts */}
        {[
          [-0.7, -0.6],
          [0.7, -0.6],
          [-0.7, 0.6],
          [0.7, 0.6],
        ].map(([x, z], idx) => (
          <mesh key={`stilt-${idx}`} position={[x, 0.42, z]} castShadow>
            <boxGeometry args={[0.14, 0.72, 0.14]} />
            <meshStandardMaterial color={darkTimber} roughness={0.9} flatShading />
          </mesh>
        ))}

        {/* Stilt Cross Tie-Beams */}
        <mesh position={[0, 0.35, -0.6]} castShadow>
          <boxGeometry args={[1.4, 0.08, 0.08]} />
          <meshStandardMaterial color={darkTimber} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.35, 0.6]} castShadow>
          <boxGeometry args={[1.4, 0.08, 0.08]} />
          <meshStandardMaterial color={darkTimber} roughness={0.9} />
        </mesh>

        {/* Base Floor Plate */}
        <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.12, 1.55]} />
          <meshStandardMaterial color={darkTimber} roughness={0.88} flatShading />
        </mesh>

        {/* Main Hen House Chunky Body */}
        <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 1.15, 1.4]} />
          <meshStandardMaterial color={honeyWood} roughness={0.85} flatShading />
        </mesh>

        {/* Timber Corner Posts */}
        {[
          [-0.84, -0.71],
          [0.84, -0.71],
          [-0.84, 0.71],
          [0.84, 0.71],
        ].map(([x, z], idx) => (
          <mesh key={`corner-${idx}`} position={[x, 1.35, z]} castShadow>
            <boxGeometry args={[0.12, 1.2, 0.12]} />
            <meshStandardMaterial color={darkTimber} roughness={0.9} flatShading />
          </mesh>
        ))}

        {/* Chunky Terracotta Shingled Roof */}
        <group position={[0, 1.95, 0]}>
          <mesh position={[-0.48, 0.26, 0]} rotation={[0, 0, Math.PI / 5]} castShadow receiveShadow>
            <boxGeometry args={[1.15, 0.14, 1.65]} />
            <meshStandardMaterial color={terracottaRoof} roughness={0.75} flatShading />
          </mesh>
          <mesh position={[0.48, 0.26, 0]} rotation={[0, 0, -Math.PI / 5]} castShadow receiveShadow>
            <boxGeometry args={[1.15, 0.14, 1.65]} />
            <meshStandardMaterial color={terracottaRoof} roughness={0.75} flatShading />
          </mesh>
          {/* Ridge Cap */}
          <mesh position={[0, 0.58, 0]} castShadow>
            <boxGeometry args={[0.18, 0.16, 1.72]} />
            <meshStandardMaterial color={darkTimber} roughness={0.85} flatShading />
          </mesh>
          {/* Gable End Walls Front & Back */}
          {[-0.71, 0.71].map((z, idx) => (
            <mesh key={`coop-gable-${idx}`} position={[0, 0.22, z]}>
              <boxGeometry args={[1.4, 0.45, 0.04]} />
              <meshStandardMaterial color={warmPine} roughness={0.85} flatShading />
            </mesh>
          ))}
        </group>

        {/* Side Nesting Box with Hinged Lid (Right Side: X = 1.0) */}
        <group position={[1.0, 1.1, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.55, 0.95]} />
            <meshStandardMaterial color={warmPine} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0.02, 0.32, 0]} rotation={[0, 0, -0.3]} castShadow>
            <boxGeometry args={[0.58, 0.08, 1.05]} />
            <meshStandardMaterial color={terracottaRoof} roughness={0.75} flatShading />
          </mesh>
        </group>

        {/* Front Chicken Pop-Hole Doorway */}
        <mesh position={[0, 1.05, 0.72]}>
          <boxGeometry args={[0.42, 0.52, 0.04]} />
          <meshStandardMaterial color="#1a1412" roughness={0.95} />
        </mesh>
        {/* Door Frame */}
        <mesh position={[0, 1.05, 0.71]}>
          <boxGeometry args={[0.54, 0.64, 0.05]} />
          <meshStandardMaterial color={darkTimber} roughness={0.9} />
        </mesh>

        {/* Wooden Chicken Ramp with Climbing Slats */}
        <group position={[0, 0.38, 1.15]} rotation={[0.46, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.36, 0.06, 1.05]} />
            <meshStandardMaterial color={warmPine} roughness={0.88} flatShading />
          </mesh>
          {[-0.38, -0.18, 0.02, 0.22, 0.42].map((z, idx) => (
            <mesh key={`rung-${idx}`} position={[0, 0.04, z]}>
              <boxGeometry args={[0.38, 0.03, 0.05]} />
              <meshStandardMaterial color={darkTimber} roughness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Straw bed beneath coop */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <cylinderGeometry args={[0.9, 1.0, 0.06, 7]} />
          <meshStandardMaterial color={strawColor} roughness={0.95} flatShading />
        </mesh>
      </group>

      {/* --- B. Fenced Chicken Run Enclosure (X from -2.2 to 2.2, Z from -2.0 to 2.0) --- */}
      <group>
        {/* Perimeter Rails: North, West, East, and South with Walk-in Gate Opening */}
        {/* North Rail */}
        <mesh position={[-0.2, 0.45, -2.0]} castShadow>
          <boxGeometry args={[4.0, 0.06, 0.06]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} />
        </mesh>
        {/* South Rails with 1.4m gate opening at relative X: -0.2 to 1.2 */}
        <mesh position={[-1.2, 0.45, 2.0]} castShadow>
          <boxGeometry args={[2.0, 0.06, 0.06]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} />
        </mesh>
        <mesh position={[1.5, 0.45, 2.0]} castShadow>
          <boxGeometry args={[0.6, 0.06, 0.06]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} />
        </mesh>
        {/* West Rail */}
        <mesh position={[-2.2, 0.45, 0]} castShadow>
          <boxGeometry args={[0.06, 0.06, 4.0]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} />
        </mesh>
        {/* East Rail (World X: -13.2 for generous walkway clearance) */}
        <mesh position={[1.8, 0.45, 0]} castShadow>
          <boxGeometry args={[0.06, 0.06, 4.0]} />
          <meshStandardMaterial color={PALETTE.woodMedium} roughness={0.9} />
        </mesh>

        {/* Fence Corner, Intermediate, and Gate Posts */}
        {[-2.2, 0, 1.8].map((x) =>
          [-2.0, 2.0].map((z) => (
            <mesh key={`run-post-${x}-${z}`} position={[x, 0.4, z]} castShadow>
              <boxGeometry args={[0.12, 0.8, 0.12]} />
              <meshStandardMaterial color={darkTimber} roughness={0.9} flatShading />
            </mesh>
          ))
        )}
        {/* Gate Post Accent at X = -0.2, Z = 2.0 */}
        <mesh position={[-0.2, 0.4, 2.0]} castShadow>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
          <meshStandardMaterial color={darkTimber} roughness={0.9} flatShading />
        </mesh>

        {/* Carved Wooden Grain Feeding Dish */}
        <group position={[0.7, 0, 0.4]}>
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.35, 0.2, 0.55]} />
            <meshStandardMaterial color={darkTimber} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.26, 0.05, 0.45]} />
            <meshStandardMaterial color={strawColor} roughness={0.7} />
          </mesh>
        </group>

        {/* Fresh Water Pan */}
        <group position={[0.7, 0, -0.4]}>
          <mesh position={[0, 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 0.14, 8]} />
            <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.03, 8]} />
            <meshStandardMaterial color={waterBlue} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ======================================================================
// 2. RED BARN STRUCTURE (Classic Rustic Crimson Cattle Barn with Gambrel Roof & Hayloft)
// ======================================================================
export const BarnStructure: React.FC = () => {
  const timberDark = '#3d2616';
  const hayColor = '#e9c46a';
  const metalColor = '#495057';

  return (
    <group position={[9.0, 0, 8.5]}>
      {/* --- A. Real 3D Cozy Barn & Silo Model from cozyfarmbystyloo --- */}
      <CozyBarnModel position={[1.4, 0, -1.2]} rotation={0} scale={1.0} />

      {/* --- B. Cattle Pasture Props: Hay Trough & Stacked Hay Bales --- */}
      {/* Large Carved Wooden Hay Feeding Trough */}
      <group position={[-1.6, 0, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.5, 0.7]} />
          <meshStandardMaterial color={timberDark} roughness={0.9} flatShading />
        </mesh>
        {/* Sweet Golden Hay inside Trough */}
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[1.6, 0.18, 0.55]} />
          <meshStandardMaterial color={hayColor} roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* 3 Stacked Chunky Golden Hay Bales */}
      <group position={[-1.7, 0, 1.4]}>
        <mesh position={[0, 0.28, 0]} rotation={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.55, 0.9]} />
          <meshStandardMaterial color={hayColor} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0.65, 0.28, -0.1]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 0.55, 0.88]} />
          <meshStandardMaterial color={hayColor} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0.3, 0.8, -0.05]} rotation={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 0.52, 0.88]} />
          <meshStandardMaterial color={hayColor} roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* Vintage Milk Can */}
      <group position={[-0.7, 0, 0.8]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.18, 0.5, 8]} />
          <meshStandardMaterial color={metalColor} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

// ======================================================================
// 3. SHEEP PEN STRUCTURE (Rustic Open-Front Shelter, Straw Bedding & Feed Rack)
// ======================================================================
export const SheepPenStructure: React.FC = () => {
  const weatheredWood = '#7f5539';
  const timberPost = '#4a2810';
  const thatchRoof = '#c29b38';
  const strawColor = '#faedcd';
  const hayColor = '#e9c46a';
  const cloverGreen = '#88bf58';

  return (
    <group position={[9.0, 0, 14.0]}>
      {/* --- A. Open-Front Wooden Sheep Shelter at Back South Corner: [1.4, 0, 1.2] --- */}
      <group position={[1.4, 0, 1.2]}>
        {/* Stone Foundation Footings */}
        {[-1.3, 1.3].map((x) =>
          [-0.9, 0.9].map((z) => (
            <mesh key={`sheep-pad-${x}-${z}`} position={[x, 0.08, z]} castShadow receiveShadow>
              <boxGeometry args={[0.3, 0.16, 0.3]} />
              <meshStandardMaterial color="#6c757d" roughness={0.92} flatShading />
            </mesh>
          ))
        )}

        {/* 4 Chunky Timber Corner Support Pillars */}
        {[-1.3, 1.3].map((x) =>
          [-0.9, 0.9].map((z) => (
            <mesh key={`sheep-post-${x}-${z}`} position={[x, 1.15, z]} castShadow>
              <boxGeometry args={[0.18, 2.15, 0.18]} />
              <meshStandardMaterial color={timberPost} roughness={0.9} flatShading />
            </mesh>
          ))
        )}

        {/* Back Wall (North: Z = -0.9) */}
        <mesh position={[0, 1.05, -0.9]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 1.85, 0.14]} />
          <meshStandardMaterial color={weatheredWood} roughness={0.92} flatShading />
        </mesh>
        {/* Horizontal Wall Timber Strapping */}
        <mesh position={[0, 1.05, -0.82]} castShadow>
          <boxGeometry args={[2.5, 0.1, 0.06]} />
          <meshStandardMaterial color={timberPost} roughness={0.9} />
        </mesh>

        {/* Left Side Wall (X = -1.3) */}
        <mesh position={[-1.3, 1.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 1.85, 1.7]} />
          <meshStandardMaterial color={weatheredWood} roughness={0.92} flatShading />
        </mesh>

        {/* Right Side Wall (X = 1.3) */}
        <mesh position={[1.3, 1.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 1.85, 1.7]} />
          <meshStandardMaterial color={weatheredWood} roughness={0.92} flatShading />
        </mesh>

        {/* FRONT IS COMPLETELY OPEN! (South: Z = 0.9 has only top lintel header) */}
        <mesh position={[0, 2.05, 0.9]} castShadow>
          <boxGeometry args={[2.7, 0.18, 0.18]} />
          <meshStandardMaterial color={timberPost} roughness={0.9} flatShading />
        </mesh>

        {/* Cozy Thick Golden Straw Bedding on Floor */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.14, 1.7]} />
          <meshStandardMaterial color={strawColor} roughness={0.98} flatShading />
        </mesh>

        {/* Chunky Sloped Thatch / Shingle Roof */}
        <mesh position={[0, 2.25, 0.05]} rotation={[0.22, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.2, 2.2]} />
          <meshStandardMaterial color={thatchRoof} roughness={0.85} flatShading />
        </mesh>
        {/* Roof Timber Eaves Beam */}
        <mesh position={[0, 2.05, 1.15]} rotation={[0.22, 0, 0]} castShadow>
          <boxGeometry args={[3.08, 0.14, 0.12]} />
          <meshStandardMaterial color={timberPost} roughness={0.9} />
        </mesh>
      </group>

      {/* --- B. Wooden Sheep Hay Feed Rack / Manger (Left Side: [-1.6, 0, 0.2]) --- */}
      <group position={[-1.6, 0, 0.2]}>
        {/* Timber Trough Box */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.52, 0.6]} />
          <meshStandardMaterial color={timberPost} roughness={0.9} flatShading />
        </mesh>
        {/* Slanted Hay Slats on Front */}
        {[-0.5, -0.25, 0, 0.25, 0.5].map((x, idx) => (
          <mesh key={`slat-${idx}`} position={[x, 0.42, 0.31]} rotation={[0.1, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.42, 0.04]} />
            <meshStandardMaterial color={weatheredWood} roughness={0.9} />
          </mesh>
        ))}
        {/* Sweet Green Grass & Golden Clover inside Rack */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.35, 0.2, 0.48]} />
          <meshStandardMaterial color={cloverGreen} roughness={0.85} flatShading />
        </mesh>
      </group>

      {/* Stacked Hay Bale for Sheep */}
      <group position={[-1.6, 0, 1.4]}>
        <mesh position={[0, 0.28, 0]} rotation={[0, -0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.55, 0.88]} />
          <meshStandardMaterial color={hayColor} roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* Shearing Wooden Bench / Stool Prop */}
      <group position={[-0.5, 0, 1.8]}>
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.08, 0.38]} />
          <meshStandardMaterial color={timberPost} roughness={0.9} flatShading />
        </mesh>
        {[-0.35, 0.35].map((x, idx) => (
          <mesh key={`bench-leg-${idx}`} position={[x, 0.11, 0]} castShadow>
            <boxGeometry args={[0.08, 0.22, 0.32]} />
            <meshStandardMaterial color={timberPost} roughness={0.9} />
          </mesh>
        ))}
        {/* Coiled Wool Fleece Bundle on Bench */}
        <mesh position={[0.15, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 0.16, 6]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
};

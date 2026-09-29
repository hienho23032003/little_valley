import React from 'react';
import { PALETTE } from '../../utils/colors';

// ======================================================================
// 1. CHICKEN COOP STRUCTURE (Elevated chunky house, ramp, nesting box, fenced run)
// ======================================================================
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
      {/* --- A. Elevated Chunky Coop House --- */}
      <group position={[-1.1, 0, -0.8]}>
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
  const barnRed = '#a31621';
  const stoneBase = '#495057';
  const roofSlate = '#2b2d42';
  const whiteTrim = '#f8f9fa';
  const timberDark = '#3d2616';
  const hayColor = '#e9c46a';
  const metalColor = '#495057';

  return (
    <group position={[9.0, 0, 8.5]}>
      {/* --- A. Main Red Barn Building (Positioned at North Corner: [1.4, 0, -1.2]) --- */}
      <group position={[1.4, 0, -1.2]}>
        {/* Stone Foundation Base */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.36, 3.2]} />
          <meshStandardMaterial color={stoneBase} roughness={0.92} flatShading />
        </mesh>
        {/* Front Stone Step */}
        <mesh position={[0, 0.1, 1.7]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.2, 0.5]} />
          <meshStandardMaterial color="#6c757d" roughness={0.9} flatShading />
        </mesh>

        {/* Main Crimson Barn Body */}
        <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 2.4, 2.9]} />
          <meshStandardMaterial color={barnRed} roughness={0.82} flatShading />
        </mesh>

        {/* Chunky White Corner Timber Posts */}
        {[
          [-1.76, -1.46],
          [1.76, -1.46],
          [-1.76, 1.46],
          [1.76, 1.46],
        ].map(([x, z], idx) => (
          <mesh key={`barn-corner-${idx}`} position={[x, 1.55, z]} castShadow>
            <boxGeometry args={[0.18, 2.44, 0.18]} />
            <meshStandardMaterial color={whiteTrim} roughness={0.9} flatShading />
          </mesh>
        ))}

        {/* Horizontal White Timber Belt */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <boxGeometry args={[3.56, 0.12, 2.96]} />
          <meshStandardMaterial color={whiteTrim} roughness={0.9} flatShading />
        </mesh>

        {/* Gambrel (Dutch Barn) Roof */}
        <group position={[0, 2.75, 0]}>
          {/* Lower Steep Slopes */}
          <mesh position={[-1.25, 0.55, 0]} rotation={[0, 0, Math.PI / 3.4]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.18, 3.3]} />
            <meshStandardMaterial color={roofSlate} roughness={0.75} flatShading />
          </mesh>
          <mesh position={[1.25, 0.55, 0]} rotation={[0, 0, -Math.PI / 3.4]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.18, 3.3]} />
            <meshStandardMaterial color={roofSlate} roughness={0.75} flatShading />
          </mesh>

          {/* Upper Gentle Slopes */}
          <mesh position={[-0.5, 1.3, 0]} rotation={[0, 0, Math.PI / 7.5]} castShadow receiveShadow>
            <boxGeometry args={[1.25, 0.18, 3.3]} />
            <meshStandardMaterial color={roofSlate} roughness={0.75} flatShading />
          </mesh>
          <mesh position={[0.5, 1.3, 0]} rotation={[0, 0, -Math.PI / 7.5]} castShadow receiveShadow>
            <boxGeometry args={[1.25, 0.18, 3.3]} />
            <meshStandardMaterial color={roofSlate} roughness={0.75} flatShading />
          </mesh>

          {/* Ridge Cap Beam */}
          <mesh position={[0, 1.55, 0]} castShadow>
            <boxGeometry args={[0.26, 0.2, 3.4]} />
            <meshStandardMaterial color={whiteTrim} roughness={0.85} flatShading />
          </mesh>

          {/* Weathervane Rooster Finial */}
          <group position={[0, 1.7, 0.8]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.45, 4]} />
              <meshStandardMaterial color={metalColor} metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.25, 0]} rotation={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[0.28, 0.14, 0.02]} />
              <meshStandardMaterial color="#d90429" metalness={0.4} roughness={0.4} />
            </mesh>
          </group>

          {/* Front & Back Gable Facades */}
          {[-1.46, 1.46].map((z, idx) => (
            <group key={`barn-gable-${idx}`} position={[0, 0.65, z]}>
              <mesh>
                <boxGeometry args={[2.8, 1.3, 0.05]} />
                <meshStandardMaterial color={barnRed} roughness={0.85} flatShading />
              </mesh>
              <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[2.1, 0.08, 0.07]} />
                <meshStandardMaterial color={whiteTrim} roughness={0.9} flatShading />
              </mesh>
            </group>
          ))}

          {/* Upper Hayloft Loading Door & Hoist Beam */}
          <group position={[0, 0.65, 1.5]}>
            <mesh castShadow>
              <boxGeometry args={[0.75, 0.85, 0.05]} />
              <meshStandardMaterial color={whiteTrim} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.62, 0.72, 0.05]} />
              <meshStandardMaterial color={barnRed} roughness={0.85} />
            </mesh>
            {/* Protruding Hoist Crane Beam */}
            <mesh position={[0, 0.65, 0.38]} castShadow>
              <boxGeometry args={[0.12, 0.12, 0.8]} />
              <meshStandardMaterial color={timberDark} roughness={0.9} flatShading />
            </mesh>
            {/* Pulley & Hanging Lantern */}
            <mesh position={[0, 0.25, 0.65]}>
              <cylinderGeometry args={[0.015, 0.015, 0.22, 4]} />
              <meshStandardMaterial color={metalColor} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.1, 0.65]}>
              <boxGeometry args={[0.09, 0.11, 0.09]} />
              <meshStandardMaterial color="#ffb703" emissive="#ffb703" emissiveIntensity={0.6} />
            </mesh>
          </group>
        </group>

        {/* Front Barn Sliding Double Doors with White X */}
        <group position={[0, 1.05, 1.48]}>
          <mesh>
            <boxGeometry args={[1.7, 1.65, 0.04]} />
            <meshStandardMaterial color="#212529" />
          </mesh>
          {/* Left Door */}
          <group position={[-0.42, 0, 0.03]}>
            <mesh castShadow>
              <boxGeometry args={[0.78, 1.55, 0.04]} />
              <meshStandardMaterial color={barnRed} />
            </mesh>
            <mesh position={[0, 0, 0.02]} rotation={[0, 0, 0.58]}>
              <boxGeometry args={[0.07, 1.58, 0.02]} />
              <meshStandardMaterial color={whiteTrim} />
            </mesh>
            <mesh position={[0, 0, 0.02]} rotation={[0, 0, -0.58]}>
              <boxGeometry args={[0.07, 1.58, 0.02]} />
              <meshStandardMaterial color={whiteTrim} />
            </mesh>
          </group>
          {/* Right Door */}
          <group position={[0.42, 0, 0.03]}>
            <mesh castShadow>
              <boxGeometry args={[0.78, 1.55, 0.04]} />
              <meshStandardMaterial color={barnRed} />
            </mesh>
            <mesh position={[0, 0, 0.02]} rotation={[0, 0, 0.58]}>
              <boxGeometry args={[0.07, 1.58, 0.02]} />
              <meshStandardMaterial color={whiteTrim} />
            </mesh>
            <mesh position={[0, 0, 0.02]} rotation={[0, 0, -0.58]}>
              <boxGeometry args={[0.07, 1.58, 0.02]} />
              <meshStandardMaterial color={whiteTrim} />
            </mesh>
          </group>
        </group>
      </group>

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

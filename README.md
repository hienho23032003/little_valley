# Little Valley 🌾🏡

A browser-based 3D low-poly cozy farming simulation game built with **React 19**, **Three.js**, **React Three Fiber (`@react-three/fiber`)**, **`@react-three/drei`**, and **Zustand**.

---

## 🎮 Implemented Features

### 🚜 Phase 01: Low-Poly 3D World & Character
- **Low-poly Aesthetic**: Pastel colors, soft green environment, miniature diorama terrain with stepped layers.
- **Environment**: River with animated water, wooden arched bridge with lanterns, 4 customizable houses with smoking chimneys and flower beds, trees (Pine, Oak, Fruit), bushes, rocks, wildflowers, and dirt path network.
- **Farmer Character**: Low-poly farmer with straw hat, blue overalls, animated walking bob, arm/leg swing, smooth WASD / Arrow key movement, and world boundary collision.
- **Elevated Follow Camera**: 45-degree isometric-style camera following the player with smooth interpolation (lerp) and map clamping.

### 🌱 Phase 02: Interactive Grid Farming
- **4×4 Dedicated Farm Field**: Grid plots near the main farmhouse with states: `EMPTY` ➔ `PLOWED` ➔ `PLANTED` ➔ `GROWING` ➔ `READY`.
- **4 Data-Driven Crops**:
  - 🌾 **Wheat** (fast growth)
  - 🌽 **Corn** (medium growth)
  - 🥕 **Carrot** (fast root crop)
  - 🍅 **Tomato** (lush vine crop)
- **Growth Stages & Visuals**: Stage 0 (seeds), Stage 1 (sprout), Stage 2 (vegetative growth), Stage 3 (harvest-ready crop with vibrant colors).
- **Watering System**: Soil visibly darkens when watered. Watered crops grow at standard speed; unwatered crops grow slower.
- **Harvesting & Visual Feedback**: Harvest ready crops with `[E]`, floating toast notifications (`+1 Wheat`), and auto-delivery into inventory.

### 🎒 Phase 03: Typed Item & Inventory System
- **Typed Item Registry (`itemData.ts`)**:
  - Categories: `Seed`, `Crop`, `Resource`, `AnimalProduct`, `Material`, `Food`, `Tool`.
  - Items: Wheat Seed, Corn Seed, Carrot Seed, Tomato Seed, Wheat, Corn, Carrot, Tomato, Wood, Stone, Fresh Milk, Farm Egg, Soft Wool, Bread, Valley Salad, River Clay, Tools (Hoe, Watering Can, Axe, Pickaxe).
- **Zustand Inventory (`inventoryStore.ts`)**: Automatic item stacking up to `maxStack: 99` (e.g. `Wheat x 15`), slot management, active item selection.
- **Currency System**: Track player coins `🪙` with starting balance and persistent updates.
- **Bottom-Center Hotbar (`Hotbar.tsx`)**: 9 slots equipped with icons, badges, hotkeys `1 - 9`, and seed auto-equip for planting.
- **Backpack Modal (`InventoryModal.tsx`)**: Toggle with `[I]` or clicking the backpack icon. Filter by item categories, inspect descriptions, and use quick dev utilities.

### ⏰ Phase 04: Game Time, Day/Night & Seasons
- **Game Clock (`timeStore.ts`)**: Configurable time scale (default: 1 real minute = 1 game hour).
- **Day/Night Cycle & Visuals (`timeVisuals.ts`, `Lighting.tsx`)**:
  - Morning (`06:00`): Warm golden sunrise, soft pinkish-amber fog.
  - Day (`10:00` - `17:00`): Crisp daylight, vibrant pastures, soft shadows.
  - Evening (`18:00`): Deep orange sunset, purple atmospheric haze.
  - Night (`22:00`): Mystical deep blue indigo sky, lowered ambient light, soft moonbeam illumination.
- **24:00 Day Transition**: Daily reset of crop watering states and animal production cooldowns.
- **Seasons**: Spring, Summer, Autumn, Winter cycle tracking globally.
- **Clock Widget (`ClockWidget.tsx`)**: Top-right HUD displaying current day, season, time, animated sun/moon indicator, and speed toggles (`1x`, `2x`, `5x`, `Pause`, `Skip to Tomorrow`).

### 🐔 Phase 05: Animal System & Pastoral Pens
- **3 Animal Species**:
  - 🐔 **Chicken**: Low-poly hen with pecking idle, wing flutters, waddling walk, and Egg (`egg`) production.
  - 🐄 **Cow**: Low-poly spotted dairy cow with grazing idle, tail swish, 4-leg walk cycle, and Fresh Milk (`milk`) production.
  - 🐑 **Sheep**: Low-poly fluffy sheep with puffy cloud fleece, chewing idle, bounce walk, and Soft Wool (`wool`) production.
- **Dedicated Animal Pens (`AnimalPen.tsx`)**:
  - **Chicken Coop**: Elevated coop house with ramp, straw nesting box, and fenced enclosure.
  - **Cow Pasture & Barn**: Red barn shelter with corrugated roof, hay trough, and timber railing fence.
  - **Sheep Pen**: Open-air timber shed with straw bedding and feed rack.
- **Autonomous Pen-Bound Wandering AI (`animalStore.ts`)**:
  - Animals wander within designated pen bounds, alternate between idle and walking, and turn naturally towards their targets.
- **Feeding & Care**:
  - Feed with `[F]` or `[E]` (Chickens consume `wheat_seed`; Cows and Sheep consume `wheat`).
  - Feeding restores Hunger (+35) and boosts Happiness (+25).
  - Pet with `[P]` or `[E]` to raise Happiness (+15) with heart particle reactions.
- **Product Generation**:
  - Well-fed, happy animals produce products during daily morning transitions.
  - Visual 3D floating icons indicate ready products above animals.
  - Interact with `[E]` within proximity (2.4m) to collect products straight to inventory.

### 🔨 Phase 06: Building & Construction System
- **Build Mode & Building Menu (`BuildingMenuModal.tsx`)**:
  - Press **`[B]`** or click **`[🔨 Build]`** to open the construction workshop.
  - Live resource inspection (`Wood`, `Stone`, `Coins`) and material requirement status per building.
  - Quick test spawner for materials.
- **6 Data-Driven Initial Buildings (`buildingData.ts`)**:
  - 🐔 **Chicken Coop** (Size: 3×3m, Cost: 20 Wood, 10 Stone, 250 Coins)
  - 🐄 **Barn** (Size: 4×4m, Cost: 30 Wood, 10 Stone, 500 Coins)
  - 🌾 **Silo** (Size: 2.5×2.5m, Cost: 15 Wood, 25 Stone, 300 Coins)
  - 🏚️ **Storage Shed** (Size: 3×3m, Cost: 25 Wood, 5 Stone, 200 Coins)
  - 🍞 **Bakery** (Size: 4×4m, Cost: 35 Wood, 30 Stone, 650 Coins)
  - 💨 **Windmill** (Size: 3.5×3.5m, Cost: 40 Wood, 20 Stone, 600 Coins)
- **Ghost Preview & Placement System (`BuildingPlacementManager.tsx`)**:
  - Raycasted cursor following across the 3D terrain with 0.5m grid snapping.
  - **Valid Placement**: Semi-transparent lush green ghost preview (`#52b788`) and glowing green footprint bounding box.
  - **Invalid Placement**: Semi-transparent crimson ghost preview (`#e63946`) and red warning footprint.
  - Direction indicator arrow marking the building entrance.
- **Strict Collision & Boundary Validation (`buildingValidation.ts`)**:
  - Prevents overlap with existing village houses.
  - Prevents overlap with the river corridor and bridge.
  - Prevents overlap with main and village roads/paths.
  - Prevents overlap with active farming plots and animal pens.
  - Prevents overlap with previously constructed player buildings.
  - Prevents placement outside valley world boundaries.
- **Placement Controls & HUD (`BuildPlacementHUD.tsx`)**:
  - **Left Click**: Place building (deducts exact wood, stone, and coins).
  - **`[R]`**: Rotate building preview in 90° increments.
  - **`[Esc]`**: Cancel placement.
  - Floating contextual HUD showing building name, size, rotation degrees, cost, and validation status.

---

## ⌨️ Controls

| Key | Action |
| --- | --- |
| **`W` / `A` / `S` / `D`** or **Arrows** | Move Farmer |
| **`E`** | Interact (Plow, Plant, Water, Harvest crop / Collect animal product / Care) |
| **`F`** | Feed nearby animal (requires Wheat or Wheat Seed) |
| **`P`** | Pet nearby animal |
| **`B`** | Open / Close Building & Construction Menu |
| **`Left Click`** *(in Build Mode)* | Place & construct selected building |
| **`R`** *(in Build Mode)* | Rotate building preview by 90° |
| **`Esc`** *(in Build Mode)* | Cancel building placement |
| **`1` – `9`** | Select hotbar slot |
| **`I`** | Open / Close Backpack & Inventory |

---

## 📁 Architecture

```
src/
├── components/
│   ├── AnimalUI.tsx                     # Context tooltip & health/hunger HUD for nearby animals
│   ├── BuildingMenuModal.tsx            # [NEW] Construction workshop menu with costs & requirements
│   ├── BuildPlacementHUD.tsx            # [NEW] Floating HUD for placement mode (rotate, cancel, status)
│   ├── ClockWidget.tsx                  # Top-right clock, day, season, and time speed controls
│   ├── FarmingUI.tsx                    # Action prompts and floating harvest notifications
│   ├── Hotbar.tsx                       # Bottom-center 1-9 hotbar with stack counts and icons
│   ├── InventoryModal.tsx               # Cozy backpack modal with categories and item management
│   └── UIOverlay.tsx                    # HUD header, region badge, coords, controls, backpack/build buttons
├── data/
│   ├── buildingData.ts                  # [NEW] Typed data-driven definitions for 6 constructible buildings
│   ├── cropData.ts                      # Data-driven definitions for crops (Wheat, Corn, Carrot, Tomato)
│   ├── itemData.ts                      # Typed item registry for all categories and initial items
│   └── worldData.ts                     # World dimensions, house configs, exclusion zones & nature
├── entities/
│   ├── animals/
│   │   ├── AnimalPen.tsx                # Chicken Coop, Red Barn, and Sheep Shed structures & fences
│   │   ├── AnimalsManager.tsx           # Animal loop, wandering AI, player proximity & keyboard events
│   │   ├── ChickenModel.tsx             # Low-poly chicken 3D model with waddle, peck, egg indicator
│   │   ├── CowModel.tsx                 # Low-poly cow 3D model with walk, grazing, milk indicator
│   │   └── SheepModel.tsx               # Low-poly sheep 3D model with fluff puff wool, wool indicator
│   ├── buildings/
│   │   ├── BakeryBuilding.tsx           # [NEW] Artisan bakery with animated chimney smoke & striped awning
│   │   ├── BarnBuilding.tsx             # [NEW] Traditional red gambrel barn with hayloft & double doors
│   │   ├── BuildingMaterials.ts         # [NEW] Material generator for normal vs ghost valid/invalid states
│   │   ├── BuildingPlacementManager.tsx # [NEW] 3D raycasting, ghost preview, grid snap, placement loop
│   │   ├── BuildingRenderer.tsx         # [NEW] Building model selector component
│   │   ├── ChickenCoopBuilding.tsx      # [NEW] Raised stilt coop with entry ramp and nesting box
│   │   ├── SiloBuilding.tsx             # [NEW] Round grain silo tower with access ladder & chute
│   │   ├── StorageShedBuilding.tsx      # [NEW] Rustic wood storage shed with firewood stack & lantern
│   │   └── WindmillBuilding.tsx         # [NEW] Windmill with 4 animated spinning cloth sails
│   ├── Bridge.tsx                       # Wooden arched bridge with posts and lanterns
│   ├── Bush.tsx                         # Reusable low-poly foliage bush
│   ├── CropModel.tsx                    # 3D low-poly crop models for 4 crops across stages 0-3
│   ├── FarmingField.tsx                 # 4x4 interactive grid, tile states, proximity detection, growth loop
│   ├── Fence.tsx                        # Split-rail post & fence component
│   ├── Flower.tsx                       # Stylized colorful wildflowers
│   ├── House.tsx                        # Customizable low-poly cottage with smoke and flowers
│   ├── Path.tsx                         # Dirt road network and cobblestones
│   ├── Player.tsx                       # Low-poly farmer with animation and physics checks
│   ├── River.tsx                        # Riverbed with animated water shimmer and foam
│   ├── Rock.tsx                         # Low-poly faceted rock boulders
│   ├── Tree.tsx                         # Pine, Oak, and Fruit trees
│   └── VillageDecor.tsx                 # Village well, signposts, benches, street lanterns
├── game/
│   ├── CameraController.tsx             # Smooth 45-degree elevated follow camera
│   ├── GameScene.tsx                    # Canvas setup, fog, tone mapping
│   ├── Lighting.tsx                     # Dynamic daylight, sun rotation, ambient & hemisphere lights
│   ├── Terrain.tsx                      # Multi-layered diorama terrain plate
│   └── World.tsx                        # Root world scene composition with pens, fields, village, placed buildings
├── stores/
│   ├── animalStore.ts                   # Animal states (hunger, happiness, wandering, feeding, products)
│   ├── buildStore.ts                    # [NEW] Zustand build store (placement mode, rotation, costs, validation)
│   ├── farmStore.ts                     # Farm tile states, growth ticks, and crop harvesting
│   ├── gameStore.ts                     # Player position, rotation, bounds
│   ├── inventoryStore.ts                # Zustand inventory store (addItem, removeItem, stacking, slots, coins)
│   └── timeStore.ts                     # Game clock, day counter, seasons, speed multiplier, daily resets
├── systems/
│   ├── buildingValidation.ts            # [NEW] AABB obstacle & boundary collision checking
│   ├── timeVisuals.ts                   # Sky, sun, ambient, and fog color/intensity interpolation
│   └── useKeyboardControls.ts           # WASD / Arrow keys input system
├── utils/
│   ├── colors.ts                        # Cohesive pastel palette definition
│   └── math.ts                          # Seeded PRNG, lerp, clamp, distance helpers
├── App.tsx                              # Main App container mounting UI overlays and 3D GameScene
├── index.css                            # Fullscreen styles, low-poly aesthetics, and UI keyframes
└── main.tsx                             # React root entry point
```

---

## 🚀 How to Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local dev server**:
   ```bash
   npm run dev
   ```

3. **Access the game**:
   - On this machine: `http://localhost:5173/`
   - On other devices on the same Wi-Fi: `http://<your-local-ip>:5173/` (e.g. `http://192.168.0.102:5173/`)

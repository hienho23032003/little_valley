# Little Valley — AI Coding Rules & Engineering Standards

These rules enforce commercial-quality engineering, optimal React Three Fiber rendering performance, clean architecture, and strict code preservation for the **Little Valley** 3D farming game.

---

## 1. Core Architecture & Discovery Rules
- **Inspect Before Implementing**: Before implementing any new feature or utility, always search the codebase to identify existing components, functions, data structures, and math helpers. Never duplicate functionality.
- **Data-Driven Design**: Separate game data and visual configuration from rendering logic. Move entity properties, costs, sizes, densities, and coordinates into typed configuration files (e.g. `src/data/`).
- **Decoupled Game Systems**: Keep reusable game systems (movement, time, farming, animals, inventory, building validation) strictly independent from UI and rendering components.
- **Component Modularity**: Prefer small, focused components with a single responsibility. Decompose complex scenes into domain-specific subcomponents (e.g., `World` ➔ `Terrain`, `Environment`, `VillageArea`, `FarmArea`, `ForestArea`, `WaterBodies`).

---

## 2. React Performance Rules
- **No Rapid React State Updates**: Never put values that change on every animation frame (e.g. character positions, camera transforms, physics velocities) into React state or Zustand state that triggers component re-renders.
- **Refs for 60 FPS State**: Use mutable Three.js `useRef` objects for frequently changing 3D transforms (`position`, `rotation`, `scale`, velocities).
- **Zustand Selectors**: Always subscribe to Zustand stores with narrow selectors (e.g., `useGameStore(state => state.isMoving)`) instead of subscribing to the entire store. Never subscribe components to state they do not render.
- **Pragmatic Memoization**: Use `React.memo`, `useMemo`, and `useCallback` only when there is measurable value (e.g., heavy procedural geometry generation or reference equality for pure children). Do not blindly memoize cheap primitives.

---

## 3. Three.js & React Three Fiber Rules
- **Shared Geometries & Materials**: Never recreate identical geometries or materials inside render loops or across repeated component instances. Use shared geometry and material singletons or factories.
- **Instancing for Repeated Environment Objects**: When rendering dozens or hundreds of similar objects (trees, bushes, flowers, rocks, grass tufts, crops), always use `InstancedMesh` or R3F `<Instances>` rather than hundreds of independent React components and draw calls.
- **Zero Allocations inside `useFrame`**: Never allocate new objects (`new THREE.Vector3()`, `new THREE.Color()`, arrays, or closures) inside a `useFrame` loop. Reuse pre-allocated module-level or ref vectors (`tmpVec`, `tmpQuat`).
- **Shadow Optimization**: Do not allow every small foliage blade or decorative prop to cast dynamic shadows. Prioritize shadow casting for the player, key buildings, and major structures. Keep shadow map resolutions sensible (1024 or 2048) with tightly bounded shadow frustums.
- **Smooth Delta-Time Motion**: Always multiply movement and animation velocities by frame delta (`dt`), capping delta (`Math.min(delta, 0.05)`) to prevent tunneling or physics explosions when the browser tab loses focus.

---

## 4. Camera & Viewport Rules
- **Non-Clipped Frustum**: Ensure the camera position, FOV, and near/far clipping planes comfortably frame the active scene.
- **Responsive Viewport & Aspect Ratio**: Always update camera aspect and recalculate FOV on window resize, fullscreen toggle, or orientation change (`camera.updateProjectionMatrix()`). Narrow viewports (portrait/square) must adapt FOV so the world is not cropped horizontally.
- **No Browser Scrolling**: The root canvas and application container must remain fixed (`width: 100%; height: 100%; overflow: hidden; position: fixed; touch-action: none;`).

---

## 5. TypeScript & Code Quality Rules
- **Strict TypeScript**: Preserve strict TypeScript compilation. Avoid `any`, `as any`, and `@ts-ignore`.
- **Explicit Interfaces**: Provide clear, exported TypeScript interfaces for all game entities, configs, state stores, and component props.
- **No Magic Numbers**: Extract speeds, interaction distances, cooldowns, margins, and world bounds into named constants or configuration objects.
- **Preserve Existing Gameplay**: Never break or delete working gameplay systems (movement, farming, inventory, animals, time, seasons, building placement, hotbar). When refactoring, maintain backwards-compatible APIs.

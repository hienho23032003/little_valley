/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useGameStore } from './stores/gameStore';
import { useFarmStore } from './stores/farmStore';
import { useAnimalStore } from './stores/animalStore';
import { useInventoryStore } from './stores/inventoryStore';
import { useBuildStore } from './stores/buildStore';
import { useTimeStore } from './stores/timeStore';

if (Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV)) {
  (window as unknown as { __STORES__: unknown }).__STORES__ = {
    gameStore: useGameStore,
    farmStore: useFarmStore,
    animalStore: useAnimalStore,
    inventoryStore: useInventoryStore,
    buildStore: useBuildStore,
    timeStore: useTimeStore,
  };
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * This module is responsible for orchestrating the procedural generation 
 * of the entire game world. It wires together the sky, terrain, obstacles, 
 * and wildlife.
 */
import { CONFIG, gameState, player, monsterRegistry } from '../config.js';
import { buildSkyAndSun } from '../world/sky.js';
import { buildMountains } from '../world/mountains.js';
import { buildBoulders } from '../world/boulders.js';
import { buildForest } from '../world/forest.js';
import {buildWildlifeBirds, buildWildlifeSquirrels} from '../world/wildlife.js';

let lockScreenRef = null;

/**
 * Sets the reference to the UI lock screen so the world can manage its visibility.
 */
export function setWorldLockScreen(screenEl) {
    lockScreenRef = screenEl;
}

/**
 * Main entry point for world generation. 
 * Clears the existing scene and re-builds everything from scratch.
 * @param {Function} onResetComplete - Optional callback when generation finishes.
 */
export function initProceduralWorld(onResetComplete) {
    const worldGroup = document.getElementById('procedural-world');
    if (!worldGroup) return;

    // Clear existing geometry
    worldGroup.innerHTML = '';
    monsterRegistry.length = 0;

    // Reset obstacle collision registry for the new world layout
    window.obstacleRegistry = [];

    // Reset all global game state variables
    gameState.score = 0;
    gameState.health = CONFIG.maxHealth;
    gameState.ammo = CONFIG.maxAmmo;
    gameState.isReloading = false;
    gameState.startTime = null;
    gameState.elapsedTime = 0;
    gameState.gameActive = true;

    // Reset player position and orientation
    player.pos = { x: 0, y: 2, z: 30 };
    player.yaw = 0;
    player.pitch = 0;

    if (window.uiManager) {
        window.uiManager.updateHUD();
    }
    const timerEl = document.getElementById('timer-display');
    if (timerEl) timerEl.innerText = `TIME: 0.0S`;

    // Trigger individual generation modules to build the scene nodes
    buildSkyAndSun(worldGroup);
    buildMountains(worldGroup);
    buildBoulders(worldGroup);
    buildForest(worldGroup);
    buildWildlifeBirds(worldGroup);
    buildWildlifeSquirrels(worldGroup);

    // Spawn the hostile entities
    if (window.entityManager) {
        window.entityManager.spawnMonsters(CONFIG.totalMonsters, 600);
    }

    // Sync the lock screen state
    if (lockScreenRef) {
        lockScreenRef.style.display = gameState.isLocked ? 'none' : 'flex';
    }
    if (onResetComplete) onResetComplete();
}
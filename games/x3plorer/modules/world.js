import { CONFIG, gameState, player, monsterRegistry } from '../config.js';
import { updateHUD } from './ui.js';
import { buildSkyAndSun } from '../world/sky.js';
import { buildMountains } from '../world/mountains.js';
import { buildWaterBodies } from '../world/water.js';
import { buildBoulders } from '../world/boulders.js';
import { buildForest } from '../world/forest.js';
import {buildWildlifeBirds, buildWildlifeSquirrels} from '../world/wildlife.js';
import { buildMonsters } from '../world/monsters.js';

let lockScreenRef = null;

export function setWorldLockScreen(screenEl) {
    lockScreenRef = screenEl;
}

export function initProceduralWorld(onResetComplete) {
    const worldGroup = document.getElementById('procedural-world');
    if (!worldGroup) return;

    worldGroup.innerHTML = '';
    monsterRegistry.length = 0;

    // Reset obstacle collision registry
    window.obstacleRegistry = [];

    gameState.score = 0;
    gameState.health = CONFIG.maxHealth;
    gameState.ammo = CONFIG.maxAmmo;
    gameState.isReloading = false;
    gameState.startTime = null;
    gameState.elapsedTime = 0;
    gameState.gameActive = true;

    player.pos = { x: 0, y: 2, z: 30 };
    player.yaw = 0;
    player.pitch = 0;

    updateHUD();
    const timerEl = document.getElementById('timer-display');
    if (timerEl) timerEl.innerText = `TIME: 0.0S`;

    // Invoke individual pack files
    buildSkyAndSun(worldGroup);
    buildMountains(worldGroup);
    buildWaterBodies(worldGroup);
    buildBoulders(worldGroup);
    buildForest(worldGroup);
    buildWildlifeBirds(worldGroup);
    buildWildlifeSquirrels(worldGroup);
    buildMonsters(worldGroup);

    if (lockScreenRef) {
        lockScreenRef.style.display = gameState.isLocked ? 'none' : 'flex';
    }
    if (onResetComplete) onResetComplete();
}
/**
 * Central configuration for game balancing and constants.
 */
export const CONFIG = {
    totalMonsters: 1,      // Initial monster count (can be changed in menu)
    totalTargets: 5,        // Number of collectibles to spawn
    maxHealth: 100,
    maxAmmo: 12,
    reloadTime: 1500,       // Milliseconds
    playerSpeed: .5,        // Movement units per frame
    mouseSensitivity: 0.003
};

/**
 * Global game state tracking metrics like score, progress, and active phase.
 */
export const gameState = {
    score: 0,
    targetsCollected: 0,
    health: CONFIG.maxHealth,
    ammo: CONFIG.maxAmmo,
    isReloading: false,
    isLocked: false,
    startTime: null,        // performance.now() timestamp
    elapsedTime: 0,
    gameActive: true
};

/**
 * Shared player data for position and orientation.
 */
export const player = {
    pos: { x: 0, y: 2, z: 30 },
    yaw: 0,                 // Horizontal rotation
    pitch: 0                // Vertical rotation
};

// Input state tracking
export const keys = { w: false, a: false, s: false, d: false };

// Shared registries for active entities
export let activeProjectiles = [];
export let monsterRegistry = [];
export let targetRegistry = [];
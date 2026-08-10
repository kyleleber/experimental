export const CONFIG = {
    totalMonsters: 1,
    maxHealth: 100,
    maxAmmo: 12,
    reloadTime: 1500,
    playerSpeed: .5,
    mouseSensitivity: 0.003
};

export const gameState = {
    score: 0,
    health: CONFIG.maxHealth,
    ammo: CONFIG.maxAmmo,
    isReloading: false,
    isLocked: false,
    startTime: null,
    elapsedTime: 0,
    gameActive: true
};

export const player = {
    pos: { x: 0, y: 2, z: 30 },
    yaw: 0,
    pitch: 0
};

export const keys = { w: false, a: false, s: false, d: false };
export let activeProjectiles = [];
export let monsterRegistry = [];
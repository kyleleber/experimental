import { CONFIG, gameState, player, keys } from '../config.js';

let lockScreen, x3dElement;

export function initPlayerSystem() {
    lockScreen = document.getElementById('lock-screen');
    x3dElement = document.getElementById('x3d-element');

    if (lockScreen) {
        lockScreen.addEventListener('click', () => {
            if (x3dElement) x3dElement.requestPointerLock();
        });
    }

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === x3dElement) {
            gameState.isLocked = true;
            if (lockScreen) lockScreen.style.display = 'none';
            if (!gameState.startTime && gameState.gameActive) gameState.startTime = performance.now();
        } else {
            gameState.isLocked = false;
            if (gameState.gameActive && lockScreen) lockScreen.style.display = 'flex';
        }
    });

    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd', 'r'].includes(key)) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (key === 'w') keys.w = true;
        if (key === 'a') keys.a = true;
        if (key === 's') keys.s = true;
        if (key === 'd') keys.d = true;
        if (key === 'r') resetGameFunc();
        if (key === 'q' && !gameState.isReloading) reloadWeaponFunc();
    }, true);

    window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (key === 'w') keys.w = false;
        if (key === 'a') keys.a = false;
        if (key === 's') keys.s = false;
        if (key === 'd') keys.d = false;
    }, true);

    window.addEventListener('mousemove', (e) => {
        if (gameState.isLocked && gameState.gameActive) {
            player.yaw -= e.movementX * CONFIG.mouseSensitivity;
            player.pitch -= e.movementY * CONFIG.mouseSensitivity;

            const maxPitch = Math.PI / 2 - 0.05;
            player.pitch = Math.max(-maxPitch, Math.min(maxPitch, player.pitch));
        }
    });

    window.addEventListener('mousedown', (e) => {
        if (e.button === 0 && gameState.isLocked && gameState.gameActive) {
            if (!gameState.startTime) gameState.startTime = performance.now();
            fireProjectileFunc();
        }
    });
}

let resetGameFunc = () => {};
let reloadWeaponFunc = () => {};
let fireProjectileFunc = () => {};

export function setPlayerCallbacks(resetCb, reloadCb, fireCb) {
    resetGameFunc = resetCb;
    reloadWeaponFunc = reloadCb;
    fireProjectileFunc = fireCb;
}

// Collision detection helper to prevent walking through boundaries or obstacles
function checkCollision(nextX, nextZ) {
    const WORLD_LIMIT = 170; // Matches your arena floor size bounds

    // 1. Check outer arena boundaries
    if (Math.abs(nextX) > WORLD_LIMIT || Math.abs(nextZ) > WORLD_LIMIT) {
        return true;
    }

    // 2. Check static obstacles or barriers stored in obstacleRegistry
    if (window.obstacleRegistry && window.obstacleRegistry.length > 0) {
        const playerRadius = 1.0; // Collision boundary thickness around the player
        for (const obs of window.obstacleRegistry) {
            const dx = nextX - obs.x;
            const dz = nextZ - obs.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < (obs.radius + playerRadius)) {
                return true;
            }
        }
    }

    return false;
}

export function updatePlayerMovement() {
    let forwardBackward = 0;
    let strafeLeftRight = 0;

    if (keys.w) forwardBackward -= 1;
    if (keys.s) forwardBackward += 1;
    if (keys.a) strafeLeftRight -= 1;
    if (keys.d) strafeLeftRight += 1;

    if (forwardBackward !== 0 || strafeLeftRight !== 0) {
        const sin = Math.sin(player.yaw);
        const cos = Math.cos(player.yaw);

        const moveX = forwardBackward * sin;
        const moveZ = forwardBackward * cos;
        const strafeX = strafeLeftRight * cos;
        const strafeZ = strafeLeftRight * -sin;

        const totalX = moveX + strafeX;
        const totalZ = moveZ + strafeZ;
        const len = Math.sqrt(totalX * totalX + totalZ * totalZ);

        if (len > 0) {
            const normX = totalX / len;
            const normZ = totalZ / len;
            const step = CONFIG.playerSpeed;

            // Test X and Z axes independently to allow smooth wall sliding
            const nextX = player.pos.x + normX * step;
            if (!checkCollision(nextX, player.pos.z)) {
                player.pos.x = nextX;
            }

            const nextZ = player.pos.z + normZ * step;
            if (!checkCollision(player.pos.x, nextZ)) {
                player.pos.z = nextZ;
            }
        }
    }

    const vp = document.getElementById('player-view');
    if (vp) {
        vp.setAttribute('position', `${player.pos.x} ${player.pos.y} ${player.pos.z}`);

        const cy = Math.cos(player.yaw / 2);
        const sy = Math.sin(player.yaw / 2);
        const cp = Math.cos(player.pitch / 2);
        const sp = Math.sin(player.pitch / 2);

        const qx = sp * cy;
        const qy = cp * sy;
        const qz = -sp * sy;
        const qw = cp * cy;

        vp.setAttribute('orientation', `${qx} ${qy} ${qz} ${2 * Math.acos(qw)}`);
    }
}
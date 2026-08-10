import { CONFIG, gameState, player, monsterRegistry } from '../config.js';

export function updateHUD() {
    const scoreEl = document.getElementById('score-display');
    const healthEl = document.getElementById('health-display');
    const ammoEl = document.getElementById('ammo-display');

    if (scoreEl) scoreEl.innerText = `ELIMINATED: ${gameState.score} / ${CONFIG.totalMonsters}`;
    if (healthEl) healthEl.innerText = `HEALTH: ${Math.max(0, gameState.health)}%`;
    if (ammoEl && !gameState.isReloading) {
        ammoEl.innerText = `AMMO: ${gameState.ammo} / ${CONFIG.maxAmmo}`;
    }
}

export function updateRadar() {
    const blipsContainer = document.getElementById('radar-blips');
    if (!blipsContainer) return;

    // Rotate the outer compass ring so N/E/S/W stay anchored to the world
    const compassRing = document.getElementById('radar-compass-ring');
    if (compassRing) {
        compassRing.style.transform = `rotate(${-player.yaw}rad)`;
    }

    // Clear old blips completely to ensure fresh rendering every frame
    blipsContainer.innerHTML = '';

    const radarRange = 70;
    // Updated radar radius & center coordinates to match the larger 48x48 Tailwind size (w-48 = 192px total, radius = 96px)
    const radarRadiusPx = 80;
    const centerPx = 96;

    const cosY = Math.cos(player.yaw);
    const sinY = Math.sin(player.yaw);

    monsterRegistry.forEach(m => {
        // Fallback check since m.active might be undefined on initial spawn entries
        if (m.active === false) return;

        const dx = m.x - player.pos.x;
        const dz = m.z - player.pos.z;

        const distSq = dx * dx + dz * dz;
        if (distSq <= radarRange * radarRange) {
            const localX = dx * cosY - dz * sinY;
            const localZ = dx * sinY + dz * cosY;

            const px = centerPx + (localX / radarRange) * radarRadiusPx;
            const pz = centerPx + (localZ / radarRange) * radarRadiusPx;

            const blip = document.createElement('div');
            blip.className = 'absolute w-2 h-2 -ml-1 -mt-1 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.9)] animate-pulse pointer-events-none';
            blip.style.left = `${px}px`;
            blip.style.top = `${pz}px`;
            blipsContainer.appendChild(blip);
        }
    });
}

export function reloadWeapon(onComplete) {
    if (gameState.ammo >= CONFIG.maxAmmo || gameState.isReloading) return;
    gameState.isReloading = true;

    const ammoEl = document.getElementById('ammo-display');
    if (ammoEl) ammoEl.innerText = `AMMO: RELOADING...`;

    setTimeout(() => {
        gameState.ammo = CONFIG.maxAmmo;
        gameState.isReloading = false;
        updateHUD();
        if (onComplete) onComplete();
    }, CONFIG.reloadTime);
}
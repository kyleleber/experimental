import { CONFIG, gameState, player, activeProjectiles, monsterRegistry } from '../config.js';
import { updateHUD } from './ui.js';
import { updateMonsters } from './monsters.js';

let resetGameFunc = () => {};

export function setCombatResetCallback(cb) {
    resetGameFunc = cb;
}

// Spits out a compact high-speed projectile instead of a long streak.
export function fireProjectile() {
    if (gameState.ammo <= 0 || gameState.isReloading) return;
    gameState.ammo--;
    updateHUD();

    const cp = Math.cos(player.pitch);
    const sp = Math.sin(player.pitch);
    const sy = Math.sin(player.yaw);
    const cy = Math.cos(player.yaw);

    const dirX = -cp * sy;
    const dirY = sp;
    const dirZ = -cp * cy;

    const scene = document.getElementById('scene-root');
    if (!scene) return;

    const projId = 'proj-' + Date.now();
    const trans = document.createElement('transform');
    trans.setAttribute('id', projId);
    trans.setAttribute('translation', `${player.pos.x} ${player.pos.y} ${player.pos.z}`);

    // Kept it tight and punchy—small glowing sphere instead of a stretched tracer bar.
    const shape = document.createElement('shape');
    const appearance = document.createElement('appearance');
    const material = document.createElement('material');
    material.setAttribute('diffuseColor', '1.0 0.9 0.4');
    material.setAttribute('emissiveColor', '0.9 0.8 0.3');
    appearance.appendChild(material);
    shape.appendChild(appearance);

    const sphere = document.createElement('sphere');
    sphere.setAttribute('radius', '0.12');
    shape.appendChild(sphere);
    trans.appendChild(shape);
    scene.appendChild(trans);

    activeProjectiles.push({
        id: projId,
        x: player.pos.x,
        y: player.pos.y,
        z: player.pos.z,
        vx: dirX * 5.0,
        vy: dirY * 5.0,
        vz: dirZ * 5.0,
        life: 140
    });
}

// Tick loop for handling projectile physics and hit detection, delegating mob AI to monsters.js.
export function updateMonstersAndProjectiles(timestamp) {
    // Delegate all enemy movement and AI tracking to the extracted monsters module
    updateMonsters(timestamp, resetGameFunc);

    // Advance projectiles and check hits. If we connect, drop the mob and trigger a death roll animation.
    for (let i = activeProjectiles.length - 1; i >= 0; i--) {
        const p = activeProjectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.life--;

        const pEl = document.getElementById(p.id);
        if (pEl) {
            pEl.setAttribute('translation', `${p.x} ${p.y} ${p.z}`);
        }

        let hit = false;
        for (let j = 0; j < monsterRegistry.length; j++) {
            const m = monsterRegistry[j];
            if (m.isDead) continue;

            const dist = Math.sqrt(
                Math.pow(p.x - m.x, 2) + Math.pow(p.y - (m.y + 1.5), 2) + Math.pow(p.z - m.z, 2)
            );
            if (dist < 2.2) {
                hit = true;
                m.isDead = true;
                gameState.score++;
                updateHUD();

                const mEl = document.getElementById(m.id);
                if (mEl) {
                    // Drop them down slightly to ground level and roll them over onto their side smoothly
                    m.y = 0.4;
                    mEl.setAttribute('translation', `${m.x} ${m.y} ${m.z}`);
                    mEl.setAttribute('rotation', `0 0 1 1.57`);
                }

                // Clean up the mob entry from the registry after a short delay so it stays as a corpse prop
                setTimeout(() => {
                    const targetEl = document.getElementById(m.id);
                    if (targetEl && targetEl.parentNode) {
                        targetEl.parentNode.removeChild(targetEl);
                    }
                    const index = monsterRegistry.indexOf(m);
                    if (index > -1) {
                        monsterRegistry.splice(index, 1);
                    }
                }, 5000);

                if (gameState.score >= CONFIG.totalMonsters && gameState.gameActive) {
                    gameState.gameActive = false;

                    // Release pointer lock so user can interact with the modal
                    if (document.pointerLockElement) {
                        document.exitPointerLock();
                    }

                    // Bring up the victory modal overlay experience immediately
                    const lockScreen = document.getElementById('lock-screen');
                    if (lockScreen) {
                        const lockCard = lockScreen.querySelector('.lock-card');
                        if (lockCard) {
                            lockCard.innerHTML = `
                                <div class="space-y-1">
                                    <h1 class="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">MISSION COMPLETE</h1>
                                    <p class="text-sm font-medium text-emerald-400/80 tracking-wide">ALL THREAT TARGETS ELIMINATED</p>
                                </div>
                                <div class="mission-briefing bg-slate-950/50 border border-emerald-900/50 rounded-xl p-4 text-left space-y-2">
                                    <h3 class="text-xs font-bold tracking-wider text-emerald-400 uppercase">Debriefing Summary</h3>
                                    <p class="text-sm text-slate-300 leading-relaxed">Outstanding work, operative. You successfully cleared the tactical grid. Total neutralized: <strong class="text-sky-400">${gameState.score} / ${CONFIG.totalMonsters}</strong>.</p>
                                </div>
                                <button id="restart-btn" class="w-full bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-sky-500 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer">
                                    RELOAD SIMULATION
                                </button>
                            `;
                            const restartBtn = document.getElementById('restart-btn');
                            if (restartBtn) {
                                restartBtn.addEventListener('click', (e) => {
                                    e.stopImmediatePropagation();
                                    e.stopPropagation();

                                    // Hard reload page to cleanly return to the default main loading state markup
                                    window.location.reload();
                                });
                            }
                        }

                        // Use capture-phase global event listeners attached to lockScreen to completely block
                        // any external UI/game click handlers from listening to clicks on the lock screen overlay.
                        const blockEvent = (e) => {
                            if (!e.target.closest('#restart-btn')) {
                                e.stopImmediatePropagation();
                                e.stopPropagation();
                            }
                        };

                        lockScreen.addEventListener('click', blockEvent, true);
                        lockScreen.addEventListener('mousedown', blockEvent, true);
                        lockScreen.addEventListener('mouseup', blockEvent, true);
                        lockScreen.addEventListener('pointerdown', blockEvent, true);

                        lockScreen.style.setProperty('display', 'flex', 'important');
                        lockScreen.classList.remove('hidden');
                    }
                }
                break;
            }
        }

        if (hit || p.life <= 0 || p.y < -5 || p.y > 100) {
            if (pEl && pEl.parentNode) {
                pEl.parentNode.removeChild(pEl);
            }
            activeProjectiles.splice(i, 1);
        }
    }
}
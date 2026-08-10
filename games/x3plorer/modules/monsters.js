import { gameState, player, monsterRegistry } from '../config.js';
import { updateHUD } from './ui.js';

// Spin up a batch of targets with procedural parts and offsets.
export function spawnMonsters(count, spawnAreaSize) {
    monsterRegistry.length = 0;
    const worldContainer = document.getElementById('procedural-world');
    if (!worldContainer) return;

    for (let i = 0; i < count; i++) {
        const monsterId = `monster-${i}-${Date.now()}`;
        const x = (Math.random() - 0.5) * spawnAreaSize;
        const z = (Math.random() - 0.5) * spawnAreaSize;
        const y = 1.0;

        const transform = document.createElement('transform');
        transform.setAttribute('id', monsterId);
        transform.setAttribute('translation', `${x} ${y} ${z}`);

        // Main body core
        const shape = document.createElement('shape');
        const appearance = document.createElement('appearance');
        const material = document.createElement('material');
        material.setAttribute('diffuseColor', '0.7 0.2 0.2');
        material.setAttribute('emissiveColor', '0.2 0.05 0.05');
        appearance.appendChild(material);
        shape.appendChild(appearance);

        const box = document.createElement('box');
        box.setAttribute('size', '1.2 2.0 1.2');
        shape.appendChild(box);
        transform.appendChild(shape);

        // Articulated head node
        const headTrans = document.createElement('transform');
        headTrans.setAttribute('id', `${monsterId}-head`);
        headTrans.setAttribute('translation', '0 1.3 0');
        const headShape = document.createElement('shape');
        const headApp = document.createElement('appearance');
        const headMat = document.createElement('material');
        headMat.setAttribute('diffuseColor', '0.9 0.3 0.3');
        headApp.appendChild(headMat);
        headShape.appendChild(headApp);
        const headBox = document.createElement('box');
        headBox.setAttribute('size', '0.8 0.8 0.8');
        headShape.appendChild(headBox);
        headTrans.appendChild(headShape);
        transform.appendChild(headTrans);

        // Articulated tail node
        const tailTrans = document.createElement('transform');
        tailTrans.setAttribute('id', `${monsterId}-tail`);
        tailTrans.setAttribute('translation', '0 -0.5 -0.8');
        const tailShape = document.createElement('shape');
        const tailApp = document.createElement('appearance');
        const tailMat = document.createElement('material');
        tailMat.setAttribute('diffuseColor', '0.5 0.1 0.1');
        tailApp.appendChild(tailMat);
        tailShape.appendChild(tailApp);
        const tailBox = document.createElement('box');
        tailBox.setAttribute('size', '0.4 0.4 1.2');
        tailShape.appendChild(tailBox);
        tailTrans.appendChild(tailShape);
        transform.appendChild(tailTrans);

        // Limbs for walking animation cycles
        const limbConfigs = [
            { id: 'f-near', pos: '-0.7 -0.8 0.6' },
            { id: 'f-far', pos: '0.7 -0.8 0.6' },
            { id: 'r-near', pos: '-0.7 -0.8 -0.6' },
            { id: 'r-far', pos: '0.7 -0.8 -0.6' }
        ];

        limbConfigs.forEach(l => {
            const lTrans = document.createElement('transform');
            lTrans.setAttribute('id', `${monsterId}-${l.id}`);
            lTrans.setAttribute('translation', l.pos);
            const lShape = document.createElement('shape');
            const lApp = document.createElement('appearance');
            const lMat = document.createElement('material');
            lMat.setAttribute('diffuseColor', '0.4 0.1 0.1');
            lApp.appendChild(lMat);
            lShape.appendChild(lApp);
            const lBox = document.createElement('box');
            lBox.setAttribute('size', '0.3 1.0 0.3');
            lShape.appendChild(lBox);
            lTrans.appendChild(lShape);
            transform.appendChild(lTrans);
        });

        worldContainer.appendChild(transform);

        monsterRegistry.push({
            id: monsterId,
            x: x,
            z: z,
            y: y,
            speed: 0.85 + Math.random() * 0.40,
            flankAngle: Math.random() * Math.PI * 2,
            flankTimer: Math.random() * 5,
            animOffset: Math.random() * Math.PI * 2,
            attackCooldown: 2,
            isDead: false
        });
    }
}

// Tick loop for handling mob AI, procedural limb animation, flanking behavior, and damage ticks.
export function updateMonsters(timestamp, resetGameFunc) {
    const timeSec = timestamp * 0.001;

    monsterRegistry.forEach((m, idx) => {
        const mEl = document.getElementById(m.id);
        if (mEl) {
            if (m.isDead) return;

            m.flankTimer += 0.015;
            if (m.flankTimer > 6.0) {
                m.flankAngle += (Math.random() - 0.5) * 1.8;
                m.flankTimer = 0;
            }

            // Check distance to player *before* calculating movement offset, so they aggressively rush close
            const distToPlayer = Math.sqrt(
                Math.pow(m.x - player.pos.x, 2) + Math.pow(m.z - player.pos.z, 2)
            );

            let targetX, targetZ;

            // If they are close, lunge directly at the player's exact coordinates instead of staying in a circle radius
            if (distToPlayer < 8.0) {
                targetX = player.pos.x;
                targetZ = player.pos.z;
            } else {
                const targetRadius = 6.5 + (idx % 3) * 2.5;
                targetX = player.pos.x + Math.cos(m.flankAngle) * targetRadius;
                targetZ = player.pos.z + Math.sin(m.flankAngle) * targetRadius;
            }

            const dx = targetX - m.x;
            const dz = targetZ - m.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.5) {
                // Increased closing speed when charging
                const moveSpeed = distToPlayer < 8.0 ? m.speed * 6.0 : m.speed * 4.0;
                m.x += (dx / dist) * moveSpeed;
                m.z += (dz / dist) * moveSpeed;
            }

            const angleToPlayer = Math.atan2(player.pos.x - m.x, player.pos.z - m.z) - Math.PI / 2;
            mEl.setAttribute('translation', `${m.x} ${m.y} ${m.z}`);
            mEl.setAttribute('rotation', `0 1 0 ${angleToPlayer}`);

            const headEl = document.getElementById(`${m.id}-head`);
            if (headEl) {
                const headBob = Math.sin(timeSec * 3 + m.animOffset) * 0.10;
                headEl.setAttribute('rotation', `0 0 1 ${-0.08 + headBob}`);
            }

            const tailEl = document.getElementById(`${m.id}-tail`);
            if (tailEl) {
                const tailWag = Math.sin(timeSec * 3.5 + m.animOffset) * 0.20;
                tailEl.setAttribute('rotation', `0 0 1 ${0.35 + tailWag}`);
            }

            const fNear = document.getElementById(`${m.id}-f-near`);
            const rFar = document.getElementById(`${m.id}-r-far`);
            if (fNear && rFar) {
                const legSwing = Math.sin(timeSec * 4.5 + m.animOffset) * 0.35;
                fNear.setAttribute('rotation', `0 0 1 ${legSwing}`);
                rFar.setAttribute('rotation', `0 0 1 ${-legSwing}`);
            }

            const fFar = document.getElementById(`${m.id}-f-far`);
            const rNear = document.getElementById(`${m.id}-r-near`);
            if (fFar && rNear) {
                const legSwingAlt = Math.sin(timeSec * 4.5 + m.animOffset + Math.PI) * 0.35;
                fFar.setAttribute('rotation', `0 0 1 ${legSwingAlt}`);
                rNear.setAttribute('rotation', `0 0 1 ${-legSwingAlt}`);
            }

            // Expanded attack range check so they reliably trigger hits when closing in
            if (distToPlayer < 4.0) {
                if (m.attackCooldown <= 0) {
                    gameState.health -= 15;
                    updateHUD();
                    m.attackCooldown = 45; // Reduced cooldown slightly for more active pressure
                    if (gameState.health <= 0 && gameState.gameActive) {
                        gameState.gameActive = false;

                        // Release pointer lock so user can interact with the modal
                        if (document.pointerLockElement) {
                            document.exitPointerLock();
                        }

                        // Bring up the game-over modal overlay experience
                        const lockScreen = document.getElementById('lock-screen');
                        if (lockScreen) {
                            const lockCard = lockScreen.querySelector('.lock-card');
                            if (lockCard) {
                                lockCard.innerHTML = `
                                    <div class="space-y-1">
                                        <h1 class="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">CRITICAL FAILURE</h1>
                                        <p class="text-sm font-medium text-red-400/80 tracking-wide">OPERATIVE LIFE SUPPORT TERMINATED</p>
                                    </div>
                                    <div class="mission-briefing bg-slate-950/50 border border-red-900/50 rounded-xl p-4 text-left space-y-2">
                                        <h3 class="text-xs font-bold tracking-wider text-red-400 uppercase">Mission Summary</h3>
                                        <p class="text-sm text-slate-300 leading-relaxed">You were overwhelmed by the hostile containment units. Total targets eliminated: <strong class="text-sky-400">${gameState.score}</strong>.</p>
                                    </div>
                                    <button id="restart-btn" class="w-full bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer">
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

                            // Prevent clicking anywhere outside the restart button from dismissing the modal
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

                            lockScreen.style.display = 'flex';
                            lockScreen.classList.remove('hidden');
                        }
                    }
                }
            }
            if (m.attackCooldown > 0) m.attackCooldown--;
        }
    });
}
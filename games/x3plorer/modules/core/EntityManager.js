/**
 * The EntityManager handles all non-player entities in the game.
 * This includes spawning and animating monsters, collectible targets, 
 * and ambient wildlife like birds and squirrels.
 */
export class EntityManager {
    constructor(config, state, player, monsterRegistry) {
        this.config = config;
        this.state = state;
        this.player = player;
        this.monsterRegistry = monsterRegistry;
        this.engine = null;
        this.ui = null;
    }

    setEngine(engine) {
        this.engine = engine;
    }

    setUI(ui) {
        this.ui = ui;
    }

    /**
     * Generates a set number of monsters in the arena.
     * Monsters are placed at a safe distance from the player's starting position.
     * @param {number} count - How many monsters to spawn
     * @param {number} spawnAreaSize - The radius of the arena to spawn within
     */
    spawnMonsters(count, spawnAreaSize) {
        this.monsterRegistry.length = 0;
        const worldContainer = document.getElementById('procedural-world');
        if (!worldContainer) return;

        for (let i = 0; i < count; i++) {
            const monsterId = `monster-${i}-${Date.now()}`;
            
            let x, z;
            let attempts = 0;
            const minPlayerDist = 30; // Safety zone around player
            const minPlayerDistSq = minPlayerDist * minPlayerDist;

            // Try to find a spawn location that isn't on top of the player
            do {
                x = (Math.random() - 0.5) * spawnAreaSize;
                z = (Math.random() - 0.5) * spawnAreaSize;
                
                const dx = x - this.player.pos.x;
                const dz = z - this.player.pos.z;
                const distSq = dx * dx + dz * dz;
                
                if (distSq > minPlayerDistSq) break;
                attempts++;
            } while (attempts < 50);

            const y = 1.0;

            const transform = document.createElement('transform');
            transform.setAttribute('id', monsterId);
            transform.setAttribute('translation', `${x} ${y} ${z}`);

            // Construct the visual model of the monster using X3D nodes
            // Body: Spiky and dark
            const bodyGroup = document.createElement('group');
            
            const shape = document.createElement('shape');
            const appearance = document.createElement('appearance');
            const material = document.createElement('material');
            material.setAttribute('diffuseColor', '0.05 0.05 0.05');
            material.setAttribute('emissiveColor', '0.1 0.0 0.0');
            appearance.appendChild(material);
            shape.appendChild(appearance);
            const box = document.createElement('box');
            box.setAttribute('size', '1.2 2.0 1.2');
            shape.appendChild(box);
            bodyGroup.appendChild(shape);

            // Add spikes to make it look menacing
            for(let s=0; s<6; s++) {
                const sTrans = document.createElement('transform');
                const angle = (s/6) * Math.PI * 2;
                sTrans.setAttribute('rotation', `0 1 0 ${angle}`);
                sTrans.setAttribute('translation', `${Math.cos(angle)*0.6} ${s*0.3 - 0.5} ${Math.sin(angle)*0.6}`);
                const sShape = document.createElement('shape');
                sShape.appendChild(appearance.cloneNode(true));
                const cone = document.createElement('cone');
                cone.setAttribute('bottomRadius', '0.1');
                cone.setAttribute('height', '0.8');
                sShape.appendChild(cone);
                sTrans.appendChild(sShape);
                bodyGroup.appendChild(sTrans);
            }
            transform.appendChild(bodyGroup);

            // Head: Twisted and scary
            const headTrans = document.createElement('transform');
            headTrans.setAttribute('id', `${monsterId}-head`);
            headTrans.setAttribute('translation', '0 1.4 0.2');
            const headShape = document.createElement('shape');
            const headApp = document.createElement('appearance');
            const headMat = document.createElement('material');
            headMat.setAttribute('diffuseColor', '0.1 0.0 0.0');
            headApp.appendChild(headMat);
            headShape.appendChild(headApp);
            const headSphere = document.createElement('sphere');
            headSphere.setAttribute('radius', '0.6');
            headShape.appendChild(headSphere);
            headTrans.appendChild(headShape);
            
            // Add horns
            [[-0.3, 0.4, 0], [0.3, 0.4, 0]].forEach((hPos, idx) => {
                const hTrans = document.createElement('transform');
                hTrans.setAttribute('translation', `${hPos[0]} ${hPos[1]} ${hPos[2]}`);
                hTrans.setAttribute('rotation', `0 0 1 ${idx === 0 ? 0.5 : -0.5}`);
                const hShape = document.createElement('shape');
                hShape.appendChild(headApp.cloneNode(true));
                const hCone = document.createElement('cone');
                hCone.setAttribute('bottomRadius', '0.1');
                hCone.setAttribute('height', '0.6');
                hShape.appendChild(hCone);
                hTrans.appendChild(hShape);
                headTrans.appendChild(hTrans);
            });

            // Glowing Red Eyes: Slitted and evil
            const eyeConfigs = [
                { id: 'eye-left', pos: '0.3 0.1 0.3' },
                { id: 'eye-right', pos: '0.3 0.1 -0.3' }
            ];

            eyeConfigs.forEach(e => {
                const eTrans = document.createElement('transform');
                eTrans.setAttribute('id', `${monsterId}-${e.id}`);
                eTrans.setAttribute('translation', e.pos);
                const eShape = document.createElement('shape');
                const eApp = document.createElement('appearance');
                const eMat = document.createElement('material');
                eMat.setAttribute('diffuseColor', '1.0 0.0 0.0');
                eMat.setAttribute('emissiveColor', '1.0 0.0 0.0');
                eApp.appendChild(eMat);
                eShape.appendChild(eApp);
                const eBox = document.createElement('box');
                eBox.setAttribute('size', '0.05 0.3 0.1');
                eShape.appendChild(eBox);
                eTrans.appendChild(eShape);
                headTrans.appendChild(eTrans);
            });
            transform.appendChild(headTrans);

            // Scythe-like Limbs for a terrifying look
            const limbConfigs = [
                { id: 'f-near', pos: '-0.6 -0.8 -0.7', rot: '0 0 1 0.5' },
                { id: 'f-far', pos: '-0.6 -0.8 0.7', rot: '0 0 1 0.5' },
                { id: 'r-near', pos: '0.6 -0.8 -0.7', rot: '0 0 1 -0.5' },
                { id: 'r-far', pos: '0.6 -0.8 0.7', rot: '0 0 1 -0.5' }
            ];

            limbConfigs.forEach(l => {
                const lTrans = document.createElement('transform');
                lTrans.setAttribute('id', `${monsterId}-${l.id}`);
                lTrans.setAttribute('translation', l.pos);
                lTrans.setAttribute('rotation', l.rot);
                const lShape = document.createElement('shape');
                lShape.appendChild(appearance.cloneNode(true));
                const lBox = document.createElement('box');
                lBox.setAttribute('size', '0.2 1.4 0.2');
                lShape.appendChild(lBox);
                lTrans.appendChild(lShape);
                transform.appendChild(lTrans);
            });

            worldContainer.appendChild(transform);

            this.monsterRegistry.push({
                id: monsterId,
                x: x,
                z: z,
                y: y,
                speed: (0.12 + Math.random() * 0.25),
                flankAngle: Math.random() * Math.PI * 2,
                flankTimer: Math.random() * 5,
                animOffset: Math.random() * Math.PI * 2,
                attackCooldown: 2,
                isDead: false
            });
        }
    }

    /**
     * Spawns collectible objectives across the map.
     */
    spawnTargets(count, spawnAreaSize) {
        if (!window.targetRegistry) window.targetRegistry = [];
        window.targetRegistry.length = 0;
        const worldContainer = document.getElementById('procedural-world');
        if (!worldContainer) return;

        for (let i = 0; i < count; i++) {
            const targetId = `target-${i}-${Date.now()}`;
            const x = (Math.random() - 0.5) * spawnAreaSize;
            const z = (Math.random() - 0.5) * spawnAreaSize;
            const y = 1.5;

            const transform = document.createElement('transform');
            transform.setAttribute('id', targetId);
            transform.setAttribute('translation', `${x} ${y} ${z}`);

            const shape = document.createElement('shape');
            const appearance = document.createElement('appearance');
            const material = document.createElement('material');
            material.setAttribute('diffuseColor', '0.0 0.8 1.0');
            material.setAttribute('emissiveColor', '0.0 0.4 0.8');
            material.setAttribute('specularColor', '1 1 1');
            appearance.appendChild(material);
            shape.appendChild(appearance);
            
            const box = document.createElement('box');
            box.setAttribute('size', '0.8 0.8 0.8');
            shape.appendChild(box);
            transform.appendChild(shape);

            worldContainer.appendChild(transform);

            window.targetRegistry.push({
                id: targetId,
                x: x,
                y: y,
                z: z,
                collected: false
            });
        }
    }

    /**
     * Main update loop for all entities.
     * Handles monster AI, collection logic, and procedural animations.
     */
    update(timestamp) {
        // deltaTime is available if we need framerate-independent physics later
        const timeSec = timestamp * 0.001;

        // Update Targets (bobbing animation and collection check)
        if (window.targetRegistry) {
            window.targetRegistry.forEach(t => {
                if (t.collected) return;
                const tEl = document.getElementById(t.id);
                if (!tEl) return;

                const bob = Math.sin(timeSec * 2 + t.x) * 0.2;
                tEl.setAttribute('translation', `${t.x} ${t.y + bob} ${t.z}`);
                tEl.setAttribute('rotation', `0 1 0 ${timeSec * 3}`);

                const dx = t.x - this.player.pos.x;
                const dz = t.z - this.player.pos.z;
                const distSq = dx * dx + dz * dz;
                if (distSq < 4.0) { 
                    t.collected = true;
                    this.state.targetsCollected++;
                    if (this.ui) this.ui.updateHUD();
                    tEl.setAttribute('render', 'false');
                }
            });
        }

        // Update Monster AI and movement
        this.monsterRegistry.forEach((m, idx) => {
            const mEl = document.getElementById(m.id);
            if (!mEl || m.isDead) return;

            // Simple AI: switch between flanking and direct pursuit
            m.flankTimer += 0.015;
            if (m.flankTimer > 6.0) {
                m.flankAngle += (Math.random() - 0.5) * 1.8;
                m.flankTimer = 0;
            }

            const distToPlayer = Math.sqrt(
                Math.pow(m.x - this.player.pos.x, 2) + Math.pow(m.z - this.player.pos.z, 2)
            );

            let targetX, targetZ;
            if (distToPlayer < 8.0) {
                // If close, charge directly at the player
                targetX = this.player.pos.x;
                targetZ = this.player.pos.z;
            } else {
                // If far, try to move to a flank position around the player
                const targetRadius = 6.5 + (idx % 3) * 2.5;
                targetX = this.player.pos.x + Math.cos(m.flankAngle) * targetRadius;
                targetZ = this.player.pos.z + Math.sin(m.flankAngle) * targetRadius;
            }

            const dx = targetX - m.x;
            const dz = targetZ - m.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.5) {
                const speedMultiplier = this.config.monsterSpeedMultiplier || 1.0;
                const baseMoveSpeed = distToPlayer < 8.0 ? 4.0 : 2.0;
                const moveSpeed = m.speed * baseMoveSpeed * speedMultiplier * 0.25;

                m.x += (dx / dist) * moveSpeed;
                m.z += (dz / dist) * moveSpeed;
            }

            const angleToPlayer = Math.atan2(this.player.pos.x - m.x, this.player.pos.z - m.z) - Math.PI / 2;
            mEl.setAttribute('translation', `${m.x} ${m.y} ${m.z}`);
            mEl.setAttribute('rotation', `0 1 0 ${angleToPlayer}`);

            // Procedural monster animations (bobbing head and swinging legs)
            const headEl = document.getElementById(`${m.id}-head`);
            if (headEl) {
                const headBob = Math.sin(timeSec * 3 + m.animOffset) * 0.10;
                headEl.setAttribute('rotation', `0 0 1 ${-0.08 + headBob}`);
            }

            const limbs = ['f-near', 'r-far', 'f-far', 'r-near'];
            limbs.forEach((l, i) => {
                const lEl = document.getElementById(`${m.id}-${l}`);
                if (lEl) {
                    const phase = (i < 2) ? 0 : Math.PI;
                    const legSwing = Math.sin(timeSec * 4.5 + m.animOffset + phase) * 0.35;
                    lEl.setAttribute('rotation', `0 0 1 ${(i % 2 === 0) ? legSwing : -legSwing}`);
                }
            });

            // Handle combat interaction (monster hits player)
            if (distToPlayer < 4.0) {
                if (m.attackCooldown <= 0) {
                    this.state.health -= 15;
                    if (this.ui) this.ui.updateHUD();
                    m.attackCooldown = 45;
                    if (this.state.health <= 0 && this.state.gameActive) {
                        this.state.gameActive = false;
                        if (document.pointerLockElement) {
                            document.exitPointerLock();
                        }
                        if (this.ui) this.ui.showFailureScreen();
                    }
                }
            }
            if (m.attackCooldown > 0) m.attackCooldown--;
        });
        
        this.updateBirds(timestamp);
        this.updateSquirrels(timestamp);
    }

    /**
     * Animates birds flying in circles at varying heights.
     */
    updateBirds(timestamp) {
        const time = timestamp * 0.003;
        for (let b = 0; b < 60; b++) {
            const bird = document.getElementById(`bird-${b}`);
            if (!bird) continue;

            const speed = parseFloat(bird.getAttribute('data-speed'));
            let angle = parseFloat(bird.getAttribute('data-angle'));
            const baseY = parseFloat(bird.getAttribute('data-base-y'));
            const phase = parseFloat(bird.getAttribute('data-phase'));

            angle += speed * 0.01;
            bird.setAttribute('data-angle', angle);

            const currentX = parseFloat(bird.getAttribute('translation')?.split(' ')[0] || 0) + Math.cos(angle) * speed;
            const currentZ = parseFloat(bird.getAttribute('translation')?.split(' ')[2] || 0) + Math.sin(angle) * speed;
            const currentY = baseY + Math.sin(time + phase) * 4;

            bird.setAttribute('translation', `${currentX} ${currentY} ${currentZ}`);
            bird.setAttribute('rotation', `0 1 0 ${-angle}`);

            // Flap wings
            const flap = Math.sin(time * 8 + phase) * 0.6;
            const lWing = document.getElementById(`bird-${b}-lwing`);
            const rWing = document.getElementById(`bird-${b}-rwing`);
            if (lWing && rWing) {
                lWing.setAttribute('rotation', `0 0 1 ${0.35 + flap}`);
                rWing.setAttribute('rotation', `0 0 1 ${-0.35 - flap}`);
            }
        }
    }

    /**
     * Animates squirrels roaming around on the ground.
     */
    updateSquirrels(timestamp) {
        if (!window.squirrelRegistry) return;
        const time = timestamp * 0.004;

        window.squirrelRegistry.forEach(sq => {
            const sqEl = document.getElementById(sq.id);
            if (!sqEl) return;

            // Roaming AI logic
            sq.stateTimer += 0.016;
            if (sq.stateTimer > 4) {
                sq.angle += (Math.random() - 0.5) * 1.5;
                sq.speed = 0.03 + Math.random() * 0.05;
                sq.stateTimer = 0;
            }

            sq.x += Math.cos(sq.angle) * sq.speed;
            sq.z += Math.sin(sq.angle) * sq.speed;

            // Stay within roaming radius
            if (Math.abs(sq.x - sq.baseX) > sq.roamRadius || Math.abs(sq.z - sq.baseZ) > sq.roamRadius) {
                sq.angle += Math.PI;
            }

            sqEl.setAttribute('translation', `${sq.x} 0.2 ${sq.z}`);
            sqEl.setAttribute('rotation', `0 1 0 ${-sq.angle + Math.PI / 2}`);

            // Leg and tail movement
            const runCycle = time * 12 + sq.animOffset;
            const fLeg0 = document.getElementById(`${sq.id}-fleg-0`);
            const fLeg1 = document.getElementById(`${sq.id}-fleg-1`);
            const rLeg0 = document.getElementById(`${sq.id}-rleg-0`);
            const rLeg1 = document.getElementById(`${sq.id}-rleg-1`);
            const tail = document.getElementById(`${sq.id}-tail`);

            if (fLeg0 && fLeg1 && rLeg0 && rLeg1) {
                fLeg0.setAttribute('rotation', `0 0 1 ${Math.sin(runCycle) * 0.5}`);
                fLeg1.setAttribute('rotation', `0 0 1 ${-Math.sin(runCycle) * 0.5}`);
                rLeg0.setAttribute('rotation', `0 0 1 ${-Math.sin(runCycle) * 0.5}`);
                rLeg1.setAttribute('rotation', `0 0 1 ${Math.sin(runCycle) * 0.5}`);
            }

            if (tail) {
                const tailWag = 0.78 + Math.sin(time * 6 + sq.animOffset) * 0.2;
                tail.setAttribute('rotation', `0 0 1 ${tailWag}`);
            }
        });
    }

    /**
     * Cleans up all managed entities from the DOM.
     */
    reset() {
        this.monsterRegistry.forEach(m => {
            const mEl = document.getElementById(m.id);
            if (mEl && mEl.parentNode) {
                mEl.parentNode.removeChild(mEl);
            }
        });
        this.monsterRegistry.length = 0;

        if (window.targetRegistry) {
            window.targetRegistry.forEach(t => {
                const tEl = document.getElementById(t.id);
                if (tEl && tEl.parentNode) {
                    tEl.parentNode.removeChild(tEl);
                }
            });
            window.targetRegistry.length = 0;
        }
    }
}

/**
 * The CombatSystem manages projectiles, hit detection, and scoring.
 * It translates player orientation into projectile trajectories and 
 * checks for collisions between bullets and monsters.
 */
export class CombatSystem {
    constructor(config, state, player, activeProjectiles, monsterRegistry) {
        this.config = config;
        this.state = state;
        this.player = player;
        this.activeProjectiles = activeProjectiles;
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
     * Spawns a new projectile at the player's position, moving in the 
     * direction the player is looking.
     */
    fireProjectile() {
        if (this.state.ammo <= 0 || this.state.isReloading) return;
        this.state.ammo--;
        if (this.ui) this.ui.updateHUD();

        // Calculate view direction vector from pitch and yaw
        const cp = Math.cos(this.player.pitch);
        const sp = Math.sin(this.player.pitch);
        const sy = Math.sin(this.player.yaw);
        const cy = Math.cos(this.player.yaw);

        const dirX = -cp * sy;
        const dirY = sp;
        const dirZ = -cp * cy;

        const scene = document.getElementById('scene-root');
        if (!scene) return;

        // Create the 3D bullet in the scene
        const projId = 'proj-' + Date.now();
        const trans = document.createElement('transform');
        trans.setAttribute('id', projId);
        trans.setAttribute('translation', `${this.player.pos.x} ${this.player.pos.y} ${this.player.pos.z}`);

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

        // Track the projectile for physics updates
        this.activeProjectiles.push({
            id: projId,
            x: this.player.pos.x,
            y: this.player.pos.y,
            z: this.player.pos.z,
            vx: dirX * 5.0,
            vy: dirY * 5.0,
            vz: dirZ * 5.0,
            life: 140 // Time-to-live in frames
        });
    }

    /**
     * Updates positions of all active projectiles and checks for hits.
     */
    update() {
        // Iterate backwards so we can safely remove items while looping
        for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
            const p = this.activeProjectiles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            p.life--;

            const pEl = document.getElementById(p.id);
            if (pEl) {
                pEl.setAttribute('translation', `${p.x} ${p.y} ${p.z}`);
            }

            let hit = false;
            // Check collisions against all living monsters
            for (let j = 0; j < this.monsterRegistry.length; j++) {
                const m = this.monsterRegistry[j];
                if (m.isDead) continue;

                const dist = Math.sqrt(
                    Math.pow(p.x - m.x, 2) + Math.pow(p.y - (m.y + 1.5), 2) + Math.pow(p.z - m.z, 2)
                );
                
                // If the projectile is close enough, it's a hit
                if (dist < 2.2) {
                    hit = true;
                    m.isDead = true;
                    this.state.score++;
                    if (this.ui) this.ui.updateHUD();

                    // Animate the monster falling over
                    const mEl = document.getElementById(m.id);
                    if (mEl) {
                        m.y = 0.4;
                        mEl.setAttribute('translation', `${m.x} ${m.y} ${m.z}`);
                        mEl.setAttribute('rotation', `0 0 1 1.57`);
                    }

                    // Remove the monster after a delay
                    setTimeout(() => {
                        const targetEl = document.getElementById(m.id);
                        if (targetEl && targetEl.parentNode) {
                            targetEl.parentNode.removeChild(targetEl);
                        }
                        const index = this.monsterRegistry.indexOf(m);
                        if (index > -1) {
                            this.monsterRegistry.splice(index, 1);
                        }
                    }, 5000);

                    // Check for victory condition
                    if (this.state.score >= this.config.totalMonsters && this.state.gameActive) {
                        this.state.gameActive = false;
                        if (document.pointerLockElement) {
                            document.exitPointerLock();
                        }
                        if (this.ui) this.ui.showVictoryScreen();
                    }
                    break;
                }
            }

            // Clean up projectile if it hit something or timed out
            if (hit || p.life <= 0 || p.y < -5 || p.y > 100) {
                if (pEl && pEl.parentNode) {
                    pEl.parentNode.removeChild(pEl);
                }
                this.activeProjectiles.splice(i, 1);
            }
        }
    }

    /**
     * Removes all projectiles from the scene.
     */
    reset() {
        this.activeProjectiles.forEach(p => {
            const pEl = document.getElementById(p.id);
            if (pEl && pEl.parentNode) {
                pEl.parentNode.removeChild(pEl);
            }
        });
        this.activeProjectiles.length = 0;
    }
}

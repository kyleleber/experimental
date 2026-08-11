/**
 * The UIManager handles all 2D interface elements, including the HUD, 
 * radar, and end-game modal screens.
 */
export class UIManager {
    constructor(config, state, player, monsterRegistry) {
        this.config = config;
        this.state = state;
        this.player = player;
        this.monsterRegistry = monsterRegistry;
        this.engine = null;
    }

    setEngine(engine) {
        this.engine = engine;
    }

    /**
     * Synchronizes the HTML HUD elements with the current game state.
     */
    updateHUD() {
        const scoreEl = document.getElementById('score-display');
        const healthEl = document.getElementById('health-display');
        const ammoEl = document.getElementById('ammo-display');
        const targetsEl = document.getElementById('targets-display');

        if (scoreEl) scoreEl.innerText = `ELIMINATED: ${this.state.score} / ${this.config.totalMonsters}`;
        if (healthEl) healthEl.innerText = `HEALTH: ${Math.max(0, this.state.health)}%`;
        if (targetsEl) targetsEl.innerText = `TARGETS: ${this.state.targetsCollected} / ${this.config.totalTargets}`;
        if (ammoEl && !this.state.isReloading) {
            ammoEl.innerText = `AMMO: ${this.state.ammo} / ${this.config.maxAmmo}`;
        }
    }

    /**
     * Updates the tactical radar display. 
     * Translates 3D world coordinates of monsters into 2D radar blip positions 
     * relative to the player's position and orientation.
     */
    updateRadar() {
        const blipsContainer = document.getElementById('radar-blips');
        if (!blipsContainer) return;

        // Rotate the compass ring based on player yaw
        const compassRing = document.getElementById('radar-compass-ring');
        if (compassRing) {
            compassRing.style.transform = `rotate(${-this.player.yaw}rad)`;
        }

        blipsContainer.innerHTML = '';

        const radarRange = 70;
        const radarRadiusPx = 80;
        const centerPx = 96;

        const cosY = Math.cos(this.player.yaw);
        const sinY = Math.sin(this.player.yaw);

        this.monsterRegistry.forEach(m => {
            if (m.isDead) return;

            const dx = m.x - this.player.pos.x;
            const dz = m.z - this.player.pos.z;

            // Only show monsters within radar range
            const distSq = dx * dx + dz * dz;
            if (distSq <= radarRange * radarRange) {
                // Convert world coords to local player-relative coords
                const localX = dx * cosY - dz * sinY;
                const localZ = dx * sinY + dz * cosY;

                // Map local coords to radar pixel positions
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

    /**
     * Triggers the weapon reload sequence and updates the HUD.
     * @param {Function} onComplete - Optional callback when reload finishes.
     */
    reloadWeapon(onComplete) {
        if (this.state.ammo >= this.config.maxAmmo || this.state.isReloading) return;
        this.state.isReloading = true;

        const ammoEl = document.getElementById('ammo-display');
        if (ammoEl) ammoEl.innerText = `AMMO: RELOADING...`;

        setTimeout(() => {
            this.state.ammo = this.config.maxAmmo;
            this.state.isReloading = false;
            this.updateHUD();
            if (onComplete) onComplete();
        }, this.config.reloadTime);
    }

    /**
     * Displays the victory screen when all monsters are defeated.
     */
    showVictoryScreen() {
        const lockScreen = document.getElementById('lock-screen');
        if (!lockScreen) return;
        
        const lockCard = lockScreen.querySelector('.lock-card');
        if (!lockCard) return;

        lockCard.innerHTML = `
            <div class="space-y-1">
                <h1 class="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">ALL CLEAR</h1>
                <p class="text-sm font-medium text-emerald-400/80 tracking-wide">Every enemy has been defeated.</p>
            </div>
            <div class="mission-briefing bg-slate-950/50 border border-emerald-900/50 rounded-xl p-4 text-left space-y-2">
                <h3 class="text-xs font-bold tracking-wider text-emerald-400 uppercase">Run Summary</h3>
                <p class="text-sm text-slate-300 leading-relaxed">Good run. You made it through the entire block without getting overwhelmed. Final count: <strong class="text-sky-400">${this.state.score} / ${this.config.totalMonsters}</strong> cleared.</p>
            </div>
            <button id="restart-btn" class="w-full bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-sky-500 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer">
                PLAY AGAIN
            </button>
        `;
        this._setupRestartButton();
        this._showModal(lockScreen);
    }

    /**
     * Displays the game over screen when the player's health reaches zero.
     */
    showFailureScreen() {
        const lockScreen = document.getElementById('lock-screen');
        if (!lockScreen) return;
        
        const lockCard = lockScreen.querySelector('.lock-card');
        if (!lockCard) return;

        lockCard.innerHTML = `
            <div class="space-y-1">
                <h1 class="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">CRITICAL FAILURE</h1>
                <p class="text-sm font-medium text-red-400/80 tracking-wide">OPERATIVE LIFE SUPPORT TERMINATED</p>
            </div>
            <div class="mission-briefing bg-slate-950/50 border border-red-900/50 rounded-xl p-4 text-left space-y-2">
                <h3 class="text-xs font-bold tracking-wider text-red-400 uppercase">Mission Summary</h3>
                <p class="text-sm text-slate-300 leading-relaxed">You were overwhelmed by the hostile containment units. Total targets eliminated: <strong class="text-sky-400">${this.state.score}</strong>.</p>
            </div>
            <button id="restart-btn" class="w-full bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer">
                RELOAD SIMULATION
            </button>
        `;
        this._setupRestartButton();
        this._showModal(lockScreen);
    }

    _setupRestartButton() {
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                window.location.reload();
            });
        }
    }

    /**
     * Prevents pointer lock from stealing focus when the modal is active.
     */
    _showModal(lockScreen) {
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

    update(timestamp) {
        if (this.state.gameActive && this.state.startTime && this.state.isLocked) {
            this.state.elapsedTime = (timestamp - this.state.startTime) / 1000;
            const timerEl = document.getElementById('timer-display');
            if (timerEl) timerEl.innerText = `TIME: ${this.state.elapsedTime.toFixed(1)}S`;
            this.updateRadar();
        }
    }
}

import { MazeGenerator } from './MazeGenerator.js';
import { Renderer } from './Renderer.js';
import { Player } from './Player.js';

/**
 * Game orchestrator. Manages the main game loop, UI synchronization,
 * timer modes (stopwatch / countdown), best score tracking via localStorage,
 * and JSON maze file import/export utility handlers.
 */
export class Game {
    constructor(options = {}) {
        this.tileSize = options.tileSize || 4;
        this.wallHeight = options.wallHeight || 4;
        this.width = options.width || 25;
        this.height = options.height || 25;

        // Timer tracking state
        this.timerMode = 'stopwatch';
        this.timerLimit = 60;
        this.currentTime = 0;
        this.timerActive = false;
        this.lastTimestamp = 0;

        // Core systems initialization
        this.renderer = new Renderer('procedural-world', this.tileSize, this.wallHeight);
        this.player = new Player('player-view', this.tileSize);
        this.player.setRendererReference(this.renderer);
        this.player.setCallbacks({
            reset: () => this.resetGame(),
            win: () => this.winGame()
        });

        this.initListeners();
        this.loadBestTimes();
        this.generate();
        this.startLoop();
    }

    /**
     * Binds DOM event listeners for the sidebar settings, timer modes,
     * regeneration triggers, and import/export file controls.
     */
    initListeners() {
        const timerModeSelect = document.getElementById('timer-mode');
        const countdownSettings = document.getElementById('countdown-settings');
        if (timerModeSelect) {
            timerModeSelect.addEventListener('change', (e) => {
                this.timerMode = e.target.value;
                if (this.timerMode === 'countdown') {
                    countdownSettings.classList.remove('hidden');
                } else {
                    countdownSettings.classList.add('hidden');
                }
            });
        }

        const regenerateBtn = document.getElementById('regenerate-btn');
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => {
                this.width = parseInt(document.getElementById('maze-width').value) || 25;
                this.height = parseInt(document.getElementById('maze-height').value) || 25;
                this.tileSize = parseFloat(document.getElementById('tile-size').value) || 4;
                this.wallHeight = parseFloat(document.getElementById('wall-height').value) || 4;
                this.playerSpeed = parseFloat(document.getElementById('player-speed').value) || 0.15;
                this.timerLimit = parseInt(document.getElementById('timer-limit').value) || 60;

                this.renderer.tileSize = this.tileSize;
                this.renderer.wallHeight = this.wallHeight;
                this.player.tileSize = this.tileSize;
                this.player.config.playerSpeed = this.playerSpeed;

                this.generate();
            });
        }

        const resetGameBtn = document.getElementById('reset-game-btn');
        if (resetGameBtn) {
            resetGameBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.resetGame();
            });
        }

        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportMaze());
        }

        const importInput = document.getElementById('import-input');
        if (importInput) {
            importInput.addEventListener('change', (e) => this.importMaze(e));
        }
    }

    /**
     * Generates a brand new procedural maze grid using the DFS algorithm.
     */
    generate() {
        const generator = new MazeGenerator(this.width, this.height);
        const mazeData = generator.generate();
        this.render(mazeData);
    }

    /**
     * Renders the maze matrix data onto the X3DOM scene and resets the player position/timers.
     */
    render(mazeData) {
        this.renderer.renderMaze(mazeData);
        this.resetGame();
    }

    /**
     * Resets the player state, timer clocks, and updates the UI lock screen overlays.
     */
    resetGame() {
        this.player.state.gameActive = true;
        this.player.reset();

        // Reset timer ticks
        this.currentTime = this.timerMode === 'countdown' ? this.timerLimit : 0;
        this.timerActive = true;
        this.lastTimestamp = performance.now();

        // UI overlay resets
        const lockScreen = document.getElementById('lock-screen');
        const lockStatus = document.getElementById('lock-status');
        const lockSubstatus = document.getElementById('lock-substatus');
        const resetBtn = document.getElementById('reset-game-btn');

        if (lockScreen) {
            lockScreen.style.display = 'flex';
            lockStatus.textContent = 'Click to start exploring';
            lockStatus.className = 'text-lg font-bold mb-2';
            lockSubstatus.textContent = 'W/S to move, Mouse to look';
            resetBtn.classList.add('hidden');
        }

        document.getElementById('timer-label').textContent = this.timerMode;
        this.updateTimerDisplay();
    }

    /**
     * Handles game completion conditions when the player reaches the target objective.
     */
    winGame() {
        this.timerActive = false;
        this.saveBestTime();

        const lockScreen = document.getElementById('lock-screen');
        const lockStatus = document.getElementById('lock-status');
        const lockSubstatus = document.getElementById('lock-substatus');
        const resetBtn = document.getElementById('reset-game-btn');

        document.exitPointerLock();

        if (lockScreen) {
            lockScreen.style.display = 'flex';
            lockStatus.textContent = 'YOU WIN!';
            lockStatus.className = 'text-4xl font-black mb-2 text-indigo-500';
            lockSubstatus.textContent = `Time: ${this.formatTime(this.timerMode === 'stopwatch' ? this.currentTime : this.timerLimit - this.currentTime)}`;
            resetBtn.classList.remove('hidden');
            resetBtn.textContent = 'Play Again';
        }
    }

    /**
     * Handles failure state when countdown timer expires before reaching the exit.
     */
    loseGame() {
        this.timerActive = false;
        this.player.state.gameActive = false;

        const lockScreen = document.getElementById('lock-screen');
        const lockStatus = document.getElementById('lock-status');
        const lockSubstatus = document.getElementById('lock-substatus');
        const resetBtn = document.getElementById('reset-game-btn');

        document.exitPointerLock();

        if (lockScreen) {
            lockScreen.style.display = 'flex';
            lockStatus.textContent = 'GAME OVER';
            lockStatus.className = 'text-4xl font-black mb-2 text-red-500';
            lockSubstatus.textContent = 'Time ran out!';
            resetBtn.classList.remove('hidden');
            resetBtn.textContent = 'Try Again';
        }
    }

    /**
     * Core animation & game loop. Manages time deltas, timers, and updates player coordinates.
     */
    startLoop() {
        const loop = (timestamp) => {
            if (this.timerActive && this.player.state.isLocked) {
                const dt = (timestamp - this.lastTimestamp) / 1000;
                this.lastTimestamp = timestamp;

                if (this.timerMode === 'stopwatch') {
                    this.currentTime += dt;
                } else {
                    this.currentTime -= dt;
                    if (this.currentTime <= 0) {
                        this.currentTime = 0;
                        this.loseGame();
                    }
                }
                this.updateTimerDisplay();
                this.updateMinimap();
            } else {
                this.lastTimestamp = timestamp;
            }

            this.player.update();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    /**
     * Updates the 2D top-down minimap canvas rendering player position and rotation angles.
     */
    updateMinimap() {
        const canvas = document.getElementById('minimap-canvas');
        if (!canvas || !this.renderer.mazeData) return;

        if (!this.player.keys.h || !this.player.state.isLocked) {
            return;
        }

        const ctx = canvas.getContext('2d');
        const mazeData = this.renderer.mazeData;
        const h = mazeData.length;
        const w = mazeData[0].length;

        // Match canvas dimensions to maze size for crisp grid rendering
        if (canvas.width !== w * 10) {
            canvas.width = w * 10;
            canvas.height = h * 10;
        }

        const scale = 10;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        mazeData.forEach((row, z) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    ctx.fillStyle = '#1e293b'; // Wall
                } else if (cell === 2) {
                    ctx.fillStyle = '#eab308'; // Target
                } else {
                    ctx.fillStyle = '#0f172a'; // Path
                }
                ctx.fillRect(x * scale, z * scale, scale, scale);
            });
        });

        // Map player coordinates
        const { tileSize } = this.renderer;
        const offsetX = (w * tileSize) / 2;
        const offsetZ = (h * tileSize) / 2;

        const px = (this.player.data.pos.x + offsetX + tileSize / 2) / tileSize;
        const pz = (this.player.data.pos.z + offsetZ + tileSize / 2) / tileSize;

        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(px * scale, pz * scale, scale * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Player look direction indicator
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px * scale, pz * scale);
        ctx.lineTo(
            px * scale + Math.sin(this.player.data.yaw) * scale,
            pz * scale + Math.cos(this.player.data.yaw) * scale
        );
        ctx.stroke();
    }

    /**
     * Refreshes the on-screen HUD timer text with warning highlights if countdown is low.
     */
    updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = this.formatTime(this.currentTime);
            if (this.timerMode === 'countdown' && this.currentTime < 10) {
                display.classList.add('text-red-500');
            } else {
                display.classList.remove('text-red-500');
            }
        }
    }

    /**
     * Formats raw seconds into a padded MM:SS.S string format.
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
    }

    /**
     * Evaluates and saves the best completion time to browser local storage.
     */
    saveBestTime() {
        const key = `maze_best_${this.timerMode}`;
        const timeSpent = this.timerMode === 'stopwatch' ? this.currentTime : this.timerLimit - this.currentTime;
        const saved = localStorage.getItem(key);

        if (!saved || timeSpent < parseFloat(saved)) {
            localStorage.setItem(key, timeSpent.toString());
            this.loadBestTimes();
        }
    }

    /**
     * Loads saved record scores from local storage into the UI sidebar stats.
     */
    loadBestTimes() {
        const sw = localStorage.getItem('maze_best_stopwatch');
        const cd = localStorage.getItem('maze_best_countdown');

        if (sw) document.getElementById('best-stopwatch').textContent = this.formatTime(parseFloat(sw));
        if (cd) document.getElementById('best-countdown').textContent = this.formatTime(parseFloat(cd));
    }

    /**
     * Serializes the current maze grid and configuration properties into a downloadable JSON file.
     */
    exportMaze() {
        const data = {
            width: this.width,
            height: this.height,
            tileSize: this.tileSize,
            wallHeight: this.wallHeight,
            playerSpeed: this.player.config.playerSpeed,
            timerMode: this.timerMode,
            timerLimit: this.timerLimit,
            mazeData: this.renderer.mazeData
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `maze_${this.width}x${this.height}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Parses an uploaded JSON file to restore custom maze dimensions, rules, and layouts.
     */
    importMaze(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.width = data.width;
                this.height = data.height;
                this.tileSize = data.tileSize;
                this.wallHeight = data.wallHeight;
                this.playerSpeed = data.playerSpeed || 0.15;
                this.timerMode = data.timerMode || 'stopwatch';
                this.timerLimit = data.timerLimit || 60;

                document.getElementById('maze-width').value = this.width;
                document.getElementById('maze-height').value = this.height;
                document.getElementById('tile-size').value = this.tileSize;
                document.getElementById('wall-height').value = this.wallHeight;
                document.getElementById('player-speed').value = this.playerSpeed;
                document.getElementById('timer-mode').value = this.timerMode;
                document.getElementById('timer-limit').value = this.timerLimit;

                if (this.timerMode === 'countdown') {
                    document.getElementById('countdown-settings').classList.remove('hidden');
                } else {
                    document.getElementById('countdown-settings').classList.add('hidden');
                }

                this.renderer.tileSize = this.tileSize;
                this.renderer.wallHeight = this.wallHeight;
                this.player.tileSize = this.tileSize;
                this.player.config.playerSpeed = this.playerSpeed;

                this.render(data.mazeData);
            } catch (err) {
                console.error("Failed to import maze:", err);
                alert("Invalid maze JSON file");
            }
        };
        reader.readAsText(file);
    }
}
/**
 * The Player class handles everything related to the user's avatar.
 * This includes movement, looking around (mouse look), collision detection,
 * and handling input events.
 */
export class Player {
    constructor(config, state, playerData, keys) {
        this.config = config;
        this.state = state;
        this.data = playerData;
        this.keys = keys;
        this.engine = null;
        
        // These callbacks are wired to the CombatSystem or Game logic
        this.resetGameCb = null;
        this.reloadWeaponCb = null;
        this.fireProjectileCb = null;
    }

    setEngine(engine) {
        this.engine = engine;
    }

    /**
     * Connects game-level actions to player inputs.
     */
    setCallbacks({ reset, reload, fire }) {
        this.resetGameCb = reset;
        this.reloadWeaponCb = reload;
        this.fireProjectileCb = fire;
    }

    /**
     * Sets up event listeners for keyboard, mouse, and pointer lock.
     * Pointer lock is what makes the mouse stay hidden and control the camera.
     */
    init() {
        const x3dElement = document.getElementById('x3d-element');
        const lockScreen = document.getElementById('lock-screen');

        if (lockScreen) {
            lockScreen.addEventListener('click', () => {
                if (x3dElement) x3dElement.requestPointerLock();
            });
        }

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === x3dElement) {
                this.state.isLocked = true;
                if (lockScreen) lockScreen.style.display = 'none';
                if (!this.state.startTime && this.state.gameActive) {
                    this.state.startTime = performance.now();
                }
            } else {
                this.state.isLocked = false;
                if (this.state.gameActive && lockScreen) {
                    lockScreen.style.display = 'flex';
                }
            }
        });

        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            // Prevent browser scrolling with movement keys
            if (['w', 'a', 's', 'd', 'r'].includes(key)) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (key === 'w') this.keys.w = true;
            if (key === 'a') this.keys.a = true;
            if (key === 's') this.keys.s = true;
            if (key === 'd') this.keys.d = true;
            if (key === 'r') this.resetGameCb && this.resetGameCb();
            if (key === 'q' && !this.state.isReloading) this.reloadWeaponCb && this.reloadWeaponCb();
        }, true);

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (key === 'w') this.keys.w = false;
            if (key === 'a') this.keys.a = false;
            if (key === 's') this.keys.s = false;
            if (key === 'd') this.keys.d = false;
        }, true);

        window.addEventListener('mousemove', (e) => {
            if (this.state.isLocked && this.state.gameActive) {
                this.data.yaw -= e.movementX * this.config.mouseSensitivity;
                this.data.pitch -= e.movementY * this.config.mouseSensitivity;

                // Clamp pitch so the player can't look all the way upside down
                const maxPitch = Math.PI / 2 - 0.05;
                this.data.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.data.pitch));
            }
        });

        window.addEventListener('mousedown', (e) => {
            if (e.button === 0 && this.state.isLocked && this.state.gameActive) {
                if (!this.state.startTime) this.state.startTime = performance.now();
                this.fireProjectileCb && this.fireProjectileCb();
            }
        });
    }

    /**
     * Checks if a target coordinate hits the map edge or any registered obstacles.
     * @param {number} nextX - Planned X position
     * @param {number} nextZ - Planned Z position
     * @returns {boolean} True if there's a collision
     */
    checkCollision(nextX, nextZ) {
        const WORLD_LIMIT = 450;
        if (Math.abs(nextX) > WORLD_LIMIT || Math.abs(nextZ) > WORLD_LIMIT) return true;

        if (window.obstacleRegistry && window.obstacleRegistry.length > 0) {
            const playerRadius = 1.0;
            for (const obs of window.obstacleRegistry) {
                const dx = nextX - obs.x;
                const dz = nextZ - obs.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist < (obs.radius + playerRadius)) return true;
            }
        }
        return false;
    }

    /**
     * Updates player position and camera orientation based on current input and state.
     */
    update() {
        let forwardBackward = 0;
        let strafeLeftRight = 0;

        if (this.keys.w) forwardBackward -= 1;
        if (this.keys.s) forwardBackward += 1;
        if (this.keys.a) strafeLeftRight -= 1;
        if (this.keys.d) strafeLeftRight += 1;

        if (forwardBackward !== 0 || strafeLeftRight !== 0) {
            const sin = Math.sin(this.data.yaw);
            const cos = Math.cos(this.data.yaw);

            // Calculate movement vectors relative to player orientation
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
                const step = this.config.playerSpeed;

                // Move X and Z separately to allow sliding along walls
                const nextX = this.data.pos.x + normX * step;
                if (!this.checkCollision(nextX, this.data.pos.z)) {
                    this.data.pos.x = nextX;
                }

                const nextZ = this.data.pos.z + normZ * step;
                if (!this.checkCollision(this.data.pos.x, nextZ)) {
                    this.data.pos.z = nextZ;
                }
            }
        }

        // Sync X3D viewpoint with player data
        const vp = document.getElementById('player-view');
        if (vp) {
            vp.setAttribute('position', `${this.data.pos.x} ${this.data.pos.y} ${this.data.pos.z}`);

            // Convert Euler angles to Quaternion for X3D orientation
            const cy = Math.cos(this.data.yaw / 2);
            const sy = Math.sin(this.data.yaw / 2);
            const cp = Math.cos(this.data.pitch / 2);
            const sp = Math.sin(this.data.pitch / 2);

            const qx = sp * cy;
            const qy = cp * sy;
            const qz = -sp * sy;
            const qw = cp * cy;

            vp.setAttribute('orientation', `${qx} ${qy} ${qz} ${2 * Math.acos(qw)}`);
        }
    }

    reset() {
        this.data.pos = { x: 0, y: 2, z: 30 };
        this.data.yaw = 0;
        this.data.pitch = 0;
    }
}

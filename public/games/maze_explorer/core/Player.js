/**
 * Class responsible for managing player state, input handling, collision detection, and movement within the 3D maze.
 */
export class Player {

    /**
     * Initializes the player instance, configuration parameters, state flags, and event bindings.
     *
     * @param {string} viewpointId - The DOM ID of the X3DOM Viewpoint element.
     * @param {number} [tileSize=4] - The world-space size of a single maze tile.
     */
    constructor(viewpointId, tileSize = 4) {
        this.viewpoint = document.getElementById(viewpointId);
        this.tileSize = tileSize;

        this.config = {
            mouseSensitivity: 0.003,
            playerSpeed: 0.15,
            playerRadius: 0
        };

        this.state = {
            isLocked: false,
            gameActive: true
        };

        this.data = {
            pos: { x: 0, y: 1.6, z: 0 },
            yaw: Math.PI,
            pitch: 0
        };

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            h: false
        };

        this.rendererRef = null;
        this.resetGameCb = null;

        // Automatically initialize event listeners on instantiation
        this.init();
    }

    /**
     * Attaches a reference to the maze renderer for grid and collision lookup.
     *
     * @param {Object} renderer - The renderer instance containing maze data and configuration.
     */
    setRendererReference(renderer) {
        this.rendererRef = renderer;
    }

    /**
     * Sets game control and outcome callbacks.
     *
     * @param {Object} callbacks - Object containing callback functions.
     * @param {Function} callbacks.reset - Callback triggered when resetting the game.
     * @param {Function} callbacks.win - Callback triggered when the win condition is met.
     */
    setCallbacks({ reset, win }) {
        this.resetGameCb = reset;
        this.winGameCb = win;
    }

    /**
     * Sets up pointer lock event listeners, keyboard handlers, and mouse movement look controls.
     *
     * @private
     */
    init() {
        const x3dElement = document.getElementById('x3d-element');
        const lockScreen = document.getElementById('lock-screen');
        const minimapContainer = document.getElementById('minimap-container');

        if (lockScreen) {
            lockScreen.addEventListener('click', () => {
                if (x3dElement) x3dElement.requestPointerLock();
            });
        }

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === x3dElement) {
                this.state.isLocked = true;
                if (lockScreen) lockScreen.style.display = 'none';
            } else {
                this.state.isLocked = false;
                if (this.state.gameActive && lockScreen) {
                    lockScreen.style.display = 'flex';
                }

                // Clear keys when unlocking
                this.keys.w = false;
                this.keys.a = false;
                this.keys.s = false;
                this.keys.d = false;
                this.keys.h = false;
                if (minimapContainer) minimapContainer.classList.add('hidden');
            }
        });

        window.addEventListener('keydown', (e) => {
            if (['w', 'a', 's', 'd', 'r', 'h'].includes(e.key.toLowerCase())) {
                const key = e.key.toLowerCase();
                if (key === 'w') this.keys.w = true;
                if (key === 'a') this.keys.a = true;
                if (key === 's') this.keys.s = true;
                if (key === 'd') this.keys.d = true;
                if (key === 'h') {
                    this.keys.h = true;
                    if (this.state.isLocked && minimapContainer) minimapContainer.classList.toggle('hidden');
                }
                if (key === 'r') this.resetGameCb && this.resetGameCb();

                if (this.state.isLocked) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, true);

        window.addEventListener('keyup', (e) => {
            if (['w', 'a', 's', 'd', 'h'].includes(e.key.toLowerCase())) {
                const key = e.key.toLowerCase();
                if (key === 'w') this.keys.w = false;
                if (key === 'a') this.keys.a = false;
                if (key === 's') this.keys.s = false;
                if (key === 'd') this.keys.d = false;

                if (this.state.isLocked) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, true);

        window.addEventListener('mousemove', (e) => {
            if (this.state.isLocked && this.state.gameActive) {
                this.data.yaw -= e.movementX * this.config.mouseSensitivity;
            }
        });
    }

    /**
     * Checks whether a prospective coordinate hits any walls within the maze grid.
     *
     * @param {number} nextX - Prospective world X coordinate.
     * @param {number} nextZ - Prospective world Z coordinate.
     * @returns {boolean} True if a collision occurs, false otherwise.
     */
    checkCollision(nextX, nextZ) {
        if (!this.rendererRef || !this.rendererRef.mazeData) return false;

        const { mazeData, tileSize } = this.rendererRef;
        const height = mazeData.length;
        const width = mazeData[0].length;

        const offsetX = (width * tileSize) / 2;
        const offsetZ = (height * tileSize) / 2;

        const radius = this.config.playerRadius;
        const collisionBuffer = 0.2;
        const checkRadius = radius + collisionBuffer;

        // Find range of tiles to check
        const minGx = Math.floor((nextX + offsetX - checkRadius + tileSize / 2) / tileSize);
        const maxGx = Math.floor((nextX + offsetX + checkRadius + tileSize / 2) / tileSize);
        const minGz = Math.floor((nextZ + offsetZ - checkRadius + tileSize / 2) / tileSize);
        const maxGz = Math.floor((nextZ + offsetZ + checkRadius + tileSize / 2) / tileSize);

        for (let gz = minGz; gz <= maxGz; gz++) {
            for (let gx = minGx; gx <= maxGx; gx++) {
                // Out of bounds is treated as a wall
                if (gx < 0 || gx >= width || gz < 0 || gz >= height) {
                    if (this.circleIntersectsTile(nextX, nextZ, checkRadius, gx, gz, tileSize, offsetX, offsetZ)) {
                        return true;
                    }
                    continue;
                }

                if (mazeData[gz][gx] === 1) {
                    if (this.circleIntersectsTile(nextX, nextZ, checkRadius, gx, gz, tileSize, offsetX, offsetZ)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Helper function checking intersection between a circular player bounding box and an axis-aligned bounding box (AABB) tile.
     *
     * @private
     * @param {number} cx - Circle center X coordinate.
     * @param {number} cz - Circle center Z coordinate.
     * @param {number} cr - Circle radius.
     * @param {number} gx - Grid X index of the tile.
     * @param {number} gz - Grid Z index of the tile.
     * @param {number} tileSize - Size of a single tile.
     * @param {number} offsetX - X offset for centering the maze world.
     * @param {number} offsetZ - Z offset for centering the maze world.
     * @returns {boolean} True if the circle intersects the tile bounds.
     */
    circleIntersectsTile(cx, cz, cr, gx, gz, tileSize, offsetX, offsetZ) {
        const xMin = gx * tileSize - offsetX - tileSize / 2;
        const xMax = gx * tileSize - offsetX + tileSize / 2;
        const zMin = gz * tileSize - offsetZ - tileSize / 2;
        const zMax = gz * tileSize - offsetZ + tileSize / 2;

        const closestX = Math.max(xMin, Math.min(cx, xMax));
        const closestZ = Math.max(zMin, Math.min(cz, zMax));

        const dx = cx - closestX;
        const dz = cz - closestZ;
        const distanceSquared = dx * dx + dz * dz;

        return distanceSquared < (cr * cr);
    }

    /**
     * Checks if the player has reached the maze exit tile and triggers the win callback.
     */
    checkWinCondition() {
        if (!this.rendererRef || !this.rendererRef.mazeData || !this.winGameCb || !this.state.gameActive) return;

        const { mazeData, tileSize } = this.rendererRef;
        const height = mazeData.length;
        const width = mazeData[0].length;
        const offsetX = (width * tileSize) / 2;
        const offsetZ = (height * tileSize) / 2;

        const gx = Math.floor((this.data.pos.x + offsetX + tileSize / 2) / tileSize);
        const gz = Math.floor((this.data.pos.z + offsetZ + tileSize / 2) / tileSize);

        if (gx >= 0 && gx < width && gz >= 0 && gz < height) {
            if (mazeData[gz][gx] === 2) {
                this.state.gameActive = false;
                this.winGameCb();
            }
        }
    }

    /**
     * Updates player position based on active movement keys, performs sliding collision checks, and syncs the viewpoint.
     */
    update() {
        let forwardBackward = 0;

        if (this.keys.w) forwardBackward -= 1;
        if (this.keys.s) forwardBackward += 1;

        if (forwardBackward !== 0) {
            const sin = Math.sin(this.data.yaw);
            const cos = Math.cos(this.data.yaw);

            const totalX = forwardBackward * sin;
            const totalZ = forwardBackward * cos;
            const len = Math.sqrt(totalX * totalX + totalZ * totalZ);

            if (len > 0) {
                const normX = totalX / len;
                const normZ = totalZ / len;
                const step = this.config.playerSpeed;

                const nextX = this.data.pos.x + normX * step;
                const nextZ = this.data.pos.z + normZ * step;

                // Combined collision check first for smooth corners
                if (!this.checkCollision(nextX, nextZ)) {
                    this.data.pos.x = nextX;
                    this.data.pos.z = nextZ;
                } else {
                    // Try X movement alone
                    if (!this.checkCollision(nextX, this.data.pos.z)) {
                        this.data.pos.x = nextX;
                    }
                    // Try Z movement alone
                    if (!this.checkCollision(this.data.pos.x, nextZ)) {
                        this.data.pos.z = nextZ;
                    }
                }

                this.checkWinCondition();
            }
        }

        if (this.viewpoint) {
            this.viewpoint.setAttribute('position', `${this.data.pos.x} ${this.data.pos.y} ${this.data.pos.z}`);
            this.viewpoint.setAttribute('orientation', `0 1 0 ${this.data.yaw}`);
        }
    }

    /**
     * Spawns the player at the starting location (1, 1) within the grid.
     *
     * @param {number} gridWidth - Total width of the maze grid.
     * @param {number} gridHeight - Total height of the maze grid.
     */
    spawn(gridWidth, gridHeight) {
        const offsetX = (gridWidth * this.tileSize) / 2;
        const offsetZ = (gridHeight * this.tileSize) / 2;

        this.data.pos.x = (1 * this.tileSize) - offsetX;
        this.data.pos.y = 1.6;
        this.data.pos.z = (1 * this.tileSize) - offsetZ;
        this.data.yaw = Math.PI;
        this.data.pitch = 0;

        if (this.viewpoint) {
            this.viewpoint.setAttribute('position', `${this.data.pos.x} ${this.data.pos.y} ${this.data.pos.z}`);
            this.viewpoint.setAttribute('orientation', `0 1 0 ${this.data.yaw}`);
        }
    }

    /**
     * Resets player position based on current maze dimensions.
     */
    reset() {
        if (this.rendererRef && this.rendererRef.mazeData) {
            const h = this.rendererRef.mazeData.length;
            const w = this.rendererRef.mazeData[0].length;
            this.spawn(w, h);
        } else {
            this.spawn(25, 25);
        }
    }
}
/**
 * Class responsible for generating 3D X3DOM scene geometry for the maze,
 * including walls and animated exit target objects, and running the animation render loop.
 */
export class Renderer {

    /**
     * Initializes the renderer, stores container references, and starts the animation frame loop.
     *
     * @param {string} worldGroupId - The DOM ID of the X3DOM group element acting as the world root.
     * @param {number} [tileSize=4] - The world-space size of a single maze tile.
     * @param {number} [wallHeight=4] - The height of the maze walls.
     */
    constructor(worldGroupId, tileSize = 4, wallHeight = 4) {
        this.worldGroup = document.getElementById(worldGroupId);
        this.tileSize = tileSize;
        this.wallHeight = wallHeight;
        this.animationFrameId = null;
        this.startTime = performance.now();
        this.targetElements = [];
        this.startAnimationLoop();
    }

    /**
     * Renders the maze grid by creating X3DOM nodes for walls and target objects.
     *
     * @param {number[][]} mazeData - 2D array representation of the maze grid (0: floor, 1: wall, 2: exit).
     */
    renderMaze(mazeData) {
        this.mazeData = mazeData;
        this.worldGroup.innerHTML = '';
        this.targetElements = [];

        const offsetX = (mazeData[0].length * this.tileSize) / 2;
        const offsetZ = (mazeData.length * this.tileSize) / 2;

        mazeData.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1 || cell === 2) {
                    const posX = (x * this.tileSize) - offsetX;
                    const posZ = (y * this.tileSize) - offsetZ;

                    const transform = document.createElement('transform');

                    if (cell === 1) {
                        transform.setAttribute('translation', `${posX} ${this.wallHeight / 2} ${posZ}`);
                        const shape = document.createElement('shape');
                        const appearance = document.createElement('appearance');
                        const material = document.createElement('material');
                        material.setAttribute('diffuseColor', '0.25 0.28 0.32');
                        appearance.appendChild(material);
                        shape.appendChild(appearance);
                        const box = document.createElement('box');
                        box.setAttribute('size', `${this.tileSize} ${this.wallHeight} ${this.tileSize}`);
                        shape.appendChild(box);
                        transform.appendChild(shape);
                    }
                    else if (cell === 2) {
                        const baseY = 1;
                        transform.setAttribute('translation', `${posX} ${baseY} ${posZ}`);

                        const shape = document.createElement('shape');
                        const appearance = document.createElement('appearance');
                        const material = document.createElement('material');
                        material.setAttribute('diffuseColor', '1 0.84 0');
                        material.setAttribute('emissiveColor', '0.4 0.3 0');
                        appearance.appendChild(material);
                        shape.appendChild(appearance);

                        const sphere = document.createElement('sphere');
                        sphere.setAttribute('radius', (this.tileSize * 0.1).toString());
                        shape.appendChild(sphere);
                        transform.appendChild(shape);

                        // Add a light to the target
                        const light = document.createElement('pointLight');
                        light.setAttribute('color', '1 0.9 0');
                        light.setAttribute('intensity', '0.2');
                        light.setAttribute('radius', (this.tileSize * 2).toString());
                        transform.appendChild(light);

                        // Store reference for animation
                        this.targetElements.push({
                            transform,
                            material,
                            baseX: posX,
                            baseY: baseY,
                            baseZ: posZ
                        });
                    }

                    this.worldGroup.appendChild(transform);
                }
            });
        });
    }

    /**
     * Starts the requestAnimationFrame loop to animate the bounce and strobe effects of target exit items.
     *
     * @private
     */
    startAnimationLoop() {
        const animate = (currentTime) => {
            const elapsed = (currentTime - this.startTime) / 1000;

            if (this.targetElements.length > 0) {
                // Subtle bounce using a sine wave (frequency ~3 rad/s, amplitude ~0.15 units)
                // Thanks for the semi-complex math help, AI & google!
                const bounceOffset = Math.sin(elapsed * 4) * 0.15;

                // Strobing/flashing emissive intensity using cosine
                const strobeFactor = 0.3 + (Math.cos(elapsed * 6) + 1) * 0.35; // ranges between 0.3 and 1.0

                this.targetElements.forEach(item => {
                    // Update bounce position
                    const currentY = item.baseY + bounceOffset;
                    item.transform.setAttribute('translation', `${item.baseX} ${currentY} ${item.baseZ}`);

                    // Update emissive strobe effect
                    const r = (0.5 * strobeFactor).toFixed(2);
                    const g = (0.4 * strobeFactor).toFixed(2);
                    const b = (0.0 * strobeFactor).toFixed(2);
                    item.material.setAttribute('emissiveColor', `${r} ${g} ${b}`);
                });
            }

            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }
}

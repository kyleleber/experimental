/**
 * Class responsible for generating 2D grid-based mazes using a randomized depth-first search algorithm.
 */
export class MazeGenerator {

    /**
     * Initializes the maze generator with specified grid dimensions.
     *
     * @param {number} [width=25] - The width of the maze grid (must be an odd number).
     * @param {number} [height=25] - The height of the maze grid (must be an odd number).
     */
    constructor(width = 25, height = 25) {
        this.width = width;
        this.height = height;
    }

    /**
     * Generates a 2D grid representing the maze layout.
     *
     * Grid value meanings:
     * - `0`: Open path / floor
     * - `1`: Wall
     * - `2`: Exit / Target location
     *
     * @returns {number[][]} A 2D array of numbers representing the generated maze grid.
     */
    generate() {
        let grid = Array(this.height).fill().map(() => Array(this.width).fill(1));

        /**
         * Recursive helper function that carves pathways through the grid using a randomized DFS approach.
         *
         * @private
         * @param {number} x - The current grid X coordinate.
         * @param {number} y - The current grid Y coordinate.
         */
        const carve = (x, y) => {
            grid[y][x] = 0;
            const directions = [[0, -2], [0, 2], [-2, 0], [2, 0]].sort(() => Math.random() - 0.5);

            for (let [dx, dy] of directions) {
                let nx = x + dx, ny = y + dy;
                if (nx > 0 && nx < this.width - 1 && ny > 0 && ny < this.height - 1 && grid[ny][nx] === 1) {
                    grid[y + dy / 2][x + dx / 2] = 0;
                    carve(nx, ny);
                }
            }
        };

        carve(1, 1);

        // Ensure entrance is open
        grid[1][1] = 0;

        // Set up the destination coordinates near the bottom-right corner
        let exitX = this.width - 2;
        let exitY = this.height - 2;

        // Mark the exit
        grid[exitY][exitX] = 2; // 2 = Exit/Target

        return grid;
    }
}
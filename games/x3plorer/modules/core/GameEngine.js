/**
 * The GameEngine is the heart of the simulation. 
 * It manages the main animation loop and orchestrates all sub-systems like 
 * movement, AI, and combat.
 */
export class GameEngine {
    constructor(config, state) {
        this.config = config;
        this.state = state;
        this.systems = [];
        this.gameInitialized = false;
        this.lastTimestamp = 0;
        // Bind update so requestAnimationFrame doesn't lose 'this' context
        this.update = this.update.bind(this);
    }

    /**
     * Registers a system (like Player or EntityManager) to be managed by the engine.
     * @param {Object} system - A class instance with optional init/update/reset methods.
     */
    addSystem(system) {
        this.systems.push(system);
        if (typeof system.setEngine === 'function') {
            system.setEngine(this);
        }
    }

    /**
     * Sets up all registered systems and kicks off the animation loop.
     */
    init() {
        this.systems.forEach(system => {
            if (typeof system.init === 'function') {
                system.init();
            }
        });
        this.gameInitialized = true;
        requestAnimationFrame(this.update);
    }

    /**
     * The main loop called by the browser. 
     * It triggers updates on all systems as long as the game is active.
     */
    update(timestamp, deltaTime) {
        this.lastTimestamp = timestamp;

        if (this.gameInitialized && this.state.gameActive) {
            this.systems.forEach(system => {
                if (typeof system.update === 'function') {
                    system.update(timestamp, deltaTime);
                }
            });
        }

        requestAnimationFrame(this.update);
    }

    /**
     * Resets all managed systems to their starting state.
     */
    reset() {
        this.systems.forEach(system => {
            if (typeof system.reset === 'function') {
                system.reset();
            }
        });
    }
}

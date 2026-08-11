/**
 * Main entry point for X3PLORER.
 * This file bootstraps the game by initializing all core systems, wiring them 
 * together, and setting up the main menu event listeners.
 */
import { gameState, CONFIG, player, keys, activeProjectiles, monsterRegistry } from './config.js';
import { GameEngine } from './modules/core/GameEngine.js';
import { Player } from './modules/core/Player.js';
import { EntityManager } from './modules/core/EntityManager.js';
import { CombatSystem } from './modules/core/CombatSystem.js';
import { UIManager } from './modules/core/UIManager.js';
import { initProceduralWorld } from './modules/world.js';

let engine;
let uiManager;
let playerSystem;
let entityManager;
let combatSystem;

/**
 * Resets the current simulation and regenerates the world.
 */
function resetGame() {
    if (!engine || !engine.gameInitialized) return;
    initProceduralWorld(() => {
        const lockScreen = document.getElementById('lock-screen');
        if (lockScreen) {
            lockScreen.style.display = gameState.isLocked ? 'none' : 'flex';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize core systems
    // We pass shared configuration and state objects to ensure all systems stay in sync.
    engine = new GameEngine(CONFIG, gameState);
    uiManager = new UIManager(CONFIG, gameState, player, monsterRegistry);
    playerSystem = new Player(CONFIG, gameState, player, keys);
    entityManager = new EntityManager(CONFIG, gameState, player, monsterRegistry);
    combatSystem = new CombatSystem(CONFIG, gameState, player, activeProjectiles, monsterRegistry);

    // 2. Setup cross-system references (Dependency Injection)
    playerSystem.setCallbacks({
        reset: resetGame,
        reload: () => uiManager.reloadWeapon(),
        fire: () => combatSystem.fireProjectile()
    });
    entityManager.setUI(uiManager);
    combatSystem.setUI(uiManager);

    // 3. Register systems with engine
    // The engine will call .update() on these systems every frame.
    engine.addSystem(uiManager);
    engine.addSystem(playerSystem);
    engine.addSystem(entityManager);
    engine.addSystem(combatSystem);

    // 4. Global access for legacy modules or debugging
    window.gameEngine = engine;
    window.entityManager = entityManager;
    window.uiManager = uiManager;

    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen) {
        lockScreen.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Main Menu: Difficulty and Monster Count setup
    const difficultySelect = document.getElementById('difficulty-select');
    const spawnSlider = document.getElementById('spawn-count-slider');
    const spawnValDisplay = document.getElementById('spawn-count-val');

    if (spawnSlider && spawnValDisplay) {
        spawnSlider.addEventListener('input', (e) => {
            spawnValDisplay.innerText = e.target.value;
            CONFIG.totalMonsters = parseInt(e.target.value, 10);
            uiManager.updateHUD();
        });
    }

    // Engagement: Starts the actual game loop
    const engageBtn = document.getElementById('engage-btn');
    const x3dElement = document.getElementById('x3d-element');

    if (engageBtn && x3dElement) {
        engageBtn.addEventListener('click', () => {
            if (difficultySelect) {
                const diff = difficultySelect.value;
                CONFIG.monsterSpeedMultiplier = (diff === 'easy') ? 0.7 : (diff === 'hard' ? 1.4 : 1.0);
            }

            // Fire up the engine and generate the world
            engine.init();
            initProceduralWorld();
            entityManager.spawnTargets(CONFIG.totalTargets, 800);

            if (lockScreen) lockScreen.style.display = 'none';
            gameState.isLocked = true;
            if (!gameState.startTime) gameState.startTime = performance.now();
            
            // Try to set focus to the X3D viewport for immediate input control
            try {
                if (x3dElement.runtime && typeof x3dElement.runtime.noFrameRate === 'function') {
                    x3dElement.focus();
                }
            } catch (err) {
                console.warn('Runtime focus fallback:', err);
            }
        });
    }
});
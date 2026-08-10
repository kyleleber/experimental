import { gameState, CONFIG } from './config.js';
import { initPlayerSystem, setPlayerCallbacks, updatePlayerMovement } from './modules/player.js';
import { updateRadar, reloadWeapon } from './modules/ui.js';
import { initProceduralWorld, setWorldLockScreen } from './modules/world.js';
import { fireProjectile, updateMonstersAndProjectiles, setCombatResetCallback } from './modules/combat.js';

let lockScreen;
let gameInitialized = false;

function resetGame() {
    if (!gameInitialized) return;
    initProceduralWorld(() => {
        if (lockScreen) {
            lockScreen.style.display = gameState.isLocked ? 'none' : 'flex';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    lockScreen = document.getElementById('lock-screen');
    setWorldLockScreen(lockScreen);

    setPlayerCallbacks(
        resetGame,
        () => reloadWeapon(),
        fireProjectile
    );
    setCombatResetCallback(resetGame);

    // Prevent the lock screen from capturing general document click-to-lock behavior
    if (lockScreen) {
        lockScreen.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Hook up dynamic input settings handlers before starting
    const difficultySelect = document.getElementById('difficulty-select');
    const spawnSlider = document.getElementById('spawn-count-slider');
    const spawnValDisplay = document.getElementById('spawn-count-val');

    if (spawnSlider && spawnValDisplay) {
        spawnSlider.addEventListener('input', (e) => {
            spawnValDisplay.innerText = e.target.value;
            CONFIG.totalMonsters = parseInt(e.target.value, 10);
            const scoreDisplay = document.getElementById('score-display');
            if (scoreDisplay) {
                scoreDisplay.innerText = `ELIMINATED: ${gameState.score} / ${CONFIG.totalMonsters}`;
            }
        });
    }

    // Explicitly hook up the engage button to initialize and start the game
    const engageBtn = document.getElementById('engage-btn');
    const x3dElement = document.getElementById('x3d-element');

    if (engageBtn && x3dElement) {
        engageBtn.addEventListener('click', () => {
            // Read difficulty settings
            if (difficultySelect) {
                const diff = difficultySelect.value;
                if (diff === 'easy') {
                    CONFIG.monsterSpeedMultiplier = 0.7;
                } else if (diff === 'hard') {
                    CONFIG.monsterSpeedMultiplier = 1.4;
                } else {
                    CONFIG.monsterSpeedMultiplier = 1.0;
                }
            }

            gameInitialized = true;

            // Initialize systems now that the button was clicked
            initPlayerSystem();
            initProceduralWorld();

            if (lockScreen) {
                lockScreen.style.display = 'none';
            }
            gameState.isLocked = true;
            if (!gameState.startTime) {
                gameState.startTime = performance.now();
            }
            try {
                if (x3dElement.runtime && typeof x3dElement.runtime.noFrameRate === 'function') {
                    x3dElement.focus();
                }
            } catch (err) {
                console.warn('Runtime focus fallback:', err);
            }
        });
    }

    requestAnimationFrame(updateGame);
});

function updateGame(timestamp) {
    if (gameInitialized) {
        if (gameState.gameActive && gameState.startTime && gameState.isLocked) {
            gameState.elapsedTime = (timestamp - gameState.startTime) / 1000;
            const timerEl = document.getElementById('timer-display');
            if (timerEl) timerEl.innerText = `TIME: ${gameState.elapsedTime.toFixed(1)}S`;
            updateRadar();
        }

        updatePlayerMovement();
        updateMonstersAndProjectiles(timestamp);
        updateBirds(timestamp);
        updateSquirrels(timestamp);
    }

    requestAnimationFrame(updateGame);
}

function updateBirds(timestamp) {
    const time = timestamp * 0.003; // Controls overall animation speed

    for (let b = 0; b < 60; b++) {
        const bird = document.getElementById(`bird-${b}`);
        if (!bird) continue;

        const speed = parseFloat(bird.getAttribute('data-speed'));
        let angle = parseFloat(bird.getAttribute('data-angle'));
        const baseY = parseFloat(bird.getAttribute('data-base-y'));
        const phase = parseFloat(bird.getAttribute('data-phase'));

        // Move position across X and Z coordinates in a wide circle/wandering pattern
        angle += speed * 0.01;
        bird.setAttribute('data-angle', angle);

        const currentX = parseFloat(bird.getAttribute('translation')?.split(' ')[0] || 0) + Math.cos(angle) * speed;
        const currentZ = parseFloat(bird.getAttribute('translation')?.split(' ')[2] || 0) + Math.sin(angle) * speed;

        // Vary elevation smoothly using sine waves
        const currentY = baseY + Math.sin(time + phase) * 4;

        bird.setAttribute('translation', `${currentX} ${currentY} ${currentZ}`);

        // Rotate the bird element to face its movement direction
        bird.setAttribute('rotation', `0 1 0 ${-angle}`);

        // Flap wings dynamically
        const flap = Math.sin(time * 8 + phase) * 0.6; // Flapping speed and intensity

        const lWing = document.getElementById(`bird-${b}-lwing`);
        const rWing = document.getElementById(`bird-${b}-rwing`);

        if (lWing && rWing) {
            lWing.setAttribute('rotation', `0 0 1 ${0.35 + flap}`);
            rWing.setAttribute('rotation', `0 0 1 ${-0.35 - flap}`);
        }
    }
}

function updateSquirrels(timestamp) {
    if (!window.squirrelRegistry) return;
    const time = timestamp * 0.004;

    window.squirrelRegistry.forEach((sq, idx) => {
        const sqEl = document.getElementById(sq.id);
        if (!sqEl) return;

        sq.stateTimer += 0.016;
        if (sq.stateTimer > 4) {
            sq.angle += (Math.random() - 0.5) * 1.5;
            sq.speed = 0.03 + Math.random() * 0.05;
            sq.stateTimer = 0;
        }

        sq.x += Math.cos(sq.angle) * sq.speed;
        sq.z += Math.sin(sq.angle) * sq.speed;

        // Keep within bounds
        const maxDist = 700;
        if (Math.abs(sq.x - sq.baseX) > sq.roamRadius || Math.abs(sq.z - sq.baseZ) > sq.roamRadius) {
            sq.angle += Math.PI;
        }

        sqEl.setAttribute('translation', `${sq.x} 0.2 ${sq.z}`);
        sqEl.setAttribute('rotation', `0 1 0 ${-sq.angle + Math.PI / 2}`);

        // Animate legs and tail scurrying
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
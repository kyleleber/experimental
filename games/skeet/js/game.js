let score = 0;
let misses = 0;

let posX = 0;
let posY = -10;
let posZ = 0;

let velX = 0;
let velY = 0;
let velZ = 0;

let selectedChoke = 'modified';
let selectedSpeed = 'standard';
let active = false;
let currentMode = 'trap';
let isExploding = false;

window.startGame = function(mode) {
    currentMode = mode;
    selectedChoke = document.getElementById('chokeSelect').value;
    selectedSpeed = document.getElementById('speedSelect').value;

    document.getElementById('gameModeTitle').innerText = mode.toUpperCase() + ' Shooting';
    document.getElementById('configModal').style.display = 'none';
    document.body.classList.add('game-active');

    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('wheel', preventDefault, { passive: false });

    score = 0;
    misses = 0;
    updateHUD();
    resetTarget();
}

function preventDefault(e) {
    if (active || isExploding) {
        e.preventDefault();
    }
}

function resetTarget() {
    isExploding = false;
    window.projActive = false;
    window.pellets.forEach(p => {
        p.active = false;
        p.y = -100;
    });
    document.getElementById('projectileGroup').setAttribute('translation', '0 -100 0');

    const targetSwitch = document.getElementById('targetSwitch');
    if (targetSwitch) targetSwitch.setAttribute('whichChoice', '0');

    const speedMultiplier = selectedSpeed === 'hyper' ? 1.35 : 1.0;

    if (currentMode === 'trap') {
        posX = (Math.random() - 0.5) * 6;
        posY = 0.5;
        posZ = -15;

        velX = (Math.random() - 0.5) * 0.15 * speedMultiplier;
        velY = (0.1 + Math.random() * 0.08) * speedMultiplier;
        velZ = (0.15 + Math.random() * 0.1) * speedMultiplier;
    } else {
        const fromLeft = Math.random() < 0.5;
        posX = fromLeft ? -10 : 10;
        posY = 2.0;
        posZ = -12;

        velX = (fromLeft ? (0.15 + Math.random() * 0.08) : -(0.15 + Math.random() * 0.08)) * speedMultiplier;
        velY = (Math.random() - 0.5) * 0.04 * speedMultiplier;
        velZ = 0.02 * speedMultiplier;
    }

    active = true;
}

function updateHUD() {
    document.getElementById('hudScore').innerText = score.toString().padStart(3, '0');
    document.getElementById('hudMisses').innerText = misses.toString().padStart(2, '0');
}

    // Cache DOM elements
    const targetTransform = document.getElementById('targetTransform');
    const targetSwitch = document.getElementById('targetSwitch');
    const projectileGroup = document.getElementById('projectileGroup');
    const pelletElements = window.pellets.map((_, i) => document.getElementById(`pellet${i}`));

    function update() {
        if (!active && !isExploding && !window.projActive) {
            requestAnimationFrame(update);
            return;
        }

        if (active || isExploding) {
            posX += velX / 3;
            posY += velY / 3;
            posZ += velZ / 3;

            if (isExploding) {
                velY -= 0.015; 
            } else if (currentMode === 'trap') {
                velY -= 0.003;
            }

            if (!isExploding && (posY < 0 || posZ > 0 || Math.abs(posX) > 18)) {
                misses++;
                updateHUD();
                resetTarget();
            }

            if (isExploding && (posY < -5 || posZ > 5 || Math.abs(posX) > 25)) {
                resetTarget();
            }

            if (targetTransform) {
                targetTransform.setAttribute('translation', `${posX.toFixed(3)} ${posY.toFixed(3)} ${posZ.toFixed(3)}`);
            }
        }

        if (window.projActive) {
            let anyActive = false;
            window.pellets.forEach((p, i) => {
                if (!p.active) return;

                p.x += p.vx / 3;
                p.y += p.vy / 3;
                p.z += p.vz / 3;

                if (active && !isExploding) {
                    const dist = Math.hypot(posX - p.x, posY - p.y, posZ - p.z);
                    if (dist < 0.75) {
                        score++;
                        active = false;
                        isExploding = true;
                        updateHUD();

                        if (targetSwitch) targetSwitch.setAttribute('whichChoice', '1');

                        velY += 0.08;
                        velX *= 1.5;

                        setTimeout(() => {
                            if (isExploding) resetTarget();
                        }, 1000);
                    }
                }

                if (p.z < -60 || Math.abs(p.x) > 40 || p.y < -10) {
                    p.active = false;
                    p.y = -100;
                } else {
                    anyActive = true;
                }

                const pelletEl = pelletElements[i];
                if (pelletEl) {
                    pelletEl.setAttribute('translation', `${p.x.toFixed(3)} ${p.y.toFixed(3)} ${p.z.toFixed(3)}`);
                }
            });

            if (!anyActive) {
                window.projActive = false;
                if (projectileGroup) projectileGroup.setAttribute('translation', '0 -50 0');
            }
        }
        
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

window.addEventListener('DOMContentLoaded', () => {
    const x3dElement = document.querySelector('x3d');
    if (x3dElement) {
        x3dElement.addEventListener('contextmenu', e => e.preventDefault());
        x3dElement.addEventListener('dragstart', e => e.preventDefault());
    }

    window.addEventListener('mousedown', (e) => {
        if (!document.body.classList.contains('game-active')) return;
        if (e.target.closest('x3d')) {
            window.fireProjectile(e, selectedChoke);
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
});
let score = 0;
let misses = 0;

let ammoPerRound = 0;
let pigeonsPerRound = 0;
let totalRounds = 0;
let currentRound = 1;
let pigeonsThrownInRound = 0;
let hitsInRound = 0;
let missesInRound = 0;

// Expose these to ballistics.js
window.ammoCount = 0;
window.shotsTaken = 0;

let targets = [
    {
        active: false,
        isExploding: false,
        posX: 0, posY: -10, posZ: 0,
        velX: 0, velY: 0, velZ: 0,
        transformId: 'targetTransform',
        switchId: 'targetSwitch'
    },
    {
        active: false,
        isExploding: false,
        posX: 0, posY: -10, posZ: 0,
        velX: 0, velY: 0, velZ: 0,
        transformId: 'targetTransform2',
        switchId: 'targetSwitch2'
    }
];

let selectedChoke = 'modified';
let selectedSpeed = 'standard';
let currentMode = 'trap';

window.startGame = function(mode) {
    currentMode = mode;
    selectedChoke = document.getElementById('chokeSelect').value;
    selectedSpeed = document.getElementById('speedSelect').value;
    ammoPerRound = parseInt(document.getElementById('ammoConfig').value) || 25;
    pigeonsPerRound = parseInt(document.getElementById('pigeonsConfig').value) || 25;
    totalRounds = parseInt(document.getElementById('roundsConfig').value) || 1;

    document.getElementById('gameModeTitle').innerText = mode.toUpperCase() + ' Shooting';
    document.getElementById('configModal').style.display = 'none';
    document.body.classList.add('game-active');

    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('wheel', preventDefault, { passive: false });

    score = 0;
    misses = 0;
    currentRound = 1;
    startRound();
}

function startRound() {
    pigeonsThrownInRound = 0;
    hitsInRound = 0;
    missesInRound = 0;
    window.shotsTaken = 0;
    window.ammoCount = ammoPerRound;
    
    document.getElementById('summaryModal').classList.add('hidden');
    document.getElementById('summaryModal').classList.remove('flex');
    
    updateHUD();
    resetTargets();
}

window.nextRound = function() {
    if (currentRound < totalRounds) {
        currentRound++;
        startRound();
    } else {
        // Game Over - Return to main screen
        location.reload();
    }
}

function preventDefault(e) {
    if (targets.some(t => t.active || t.isExploding)) {
        e.preventDefault();
    }
}

function resetTargets() {
    targets.forEach(t => {
        t.active = false;
        t.isExploding = false;
        const targetSwitch = document.getElementById(t.switchId);
        if (targetSwitch) targetSwitch.setAttribute('whichChoice', '0');
    });

    window.projActive = false;
    window.pellets.forEach(p => {
        p.active = false;
        p.y = -100;
    });
    document.getElementById('projectileGroup').setAttribute('translation', '0 -100 0');

    if (pigeonsThrownInRound >= pigeonsPerRound) {
        showSummary();
        return;
    }

    const speedMultiplier = selectedSpeed === 'hyper' ? 1.35 : 1.0;

    // Determine how many pigeons to throw
    let numToThrow = 1;
    if (currentMode === 'skeet' && (pigeonsPerRound - pigeonsThrownInRound) >= 2) {
        // Randomly throw 2 pigeons in skeet mode if possible
        if (Math.random() < 0.3) {
            numToThrow = 2;
        }
    }

    for (let i = 0; i < numToThrow; i++) {
        const t = targets[i];
        if (currentMode === 'trap') {
            t.posX = (Math.random() - 0.5) * 6;
            t.posY = 0.5;
            t.posZ = -15;
            t.velX = (Math.random() - 0.5) * 0.15 * speedMultiplier;
            t.velY = (0.1 + Math.random() * 0.08) * speedMultiplier;
            t.velZ = (0.15 + Math.random() * 0.1) * speedMultiplier;
        } else {
            // Skeet
            const fromLeft = (i === 0) ? (Math.random() < 0.5) : !targets[0].fromLeft;
            t.fromLeft = fromLeft;
            t.posX = fromLeft ? -10 : 10;
            t.posY = 2.0;
            t.posZ = -12;
            t.velX = (fromLeft ? (0.15 + Math.random() * 0.08) : -(0.15 + Math.random() * 0.08)) * speedMultiplier;
            t.velY = (Math.random() - 0.5) * 0.04 * speedMultiplier;
            t.velZ = 0.02 * speedMultiplier;
        }
        t.active = true;
        pigeonsThrownInRound++;
    }
}

function showSummary() {
    document.getElementById('summaryRoundInfo').innerText = `Round ${currentRound} of ${totalRounds} complete`;
    document.getElementById('summaryShots').innerText = window.shotsTaken;
    document.getElementById('summaryAmmo').innerText = ammoPerRound - window.ammoCount;
    document.getElementById('summaryHits').innerText = hitsInRound;
    document.getElementById('summaryMisses').innerText = missesInRound;
    
    const nextBtn = document.getElementById('nextRoundBtn');
    if (currentRound < totalRounds) {
        nextBtn.innerText = "Next Round";
    } else {
        nextBtn.innerText = "Finish Game";
    }

    document.getElementById('summaryModal').classList.remove('hidden');
    document.getElementById('summaryModal').classList.add('flex');
}

function updateHUD() {
    document.getElementById('hudScore').innerText = score.toString().padStart(3, '0');
    document.getElementById('hudMisses').innerText = misses.toString().padStart(2, '0');
    document.getElementById('hudAmmo').innerText = window.ammoCount.toString().padStart(2, '0');
}

window.updateHUD = updateHUD;

// Cache DOM elements
const projectileGroup = document.getElementById('projectileGroup');
const pelletElements = window.pellets.map((_, i) => document.getElementById(`pellet${i}`));

function update() {
    const anyActiveTarget = targets.some(t => t.active || t.isExploding);
    
    if (!anyActiveTarget && !window.projActive) {
        requestAnimationFrame(update);
        return;
    }

    targets.forEach(t => {
        if (t.active || t.isExploding) {
            t.posX += t.velX / 3;
            t.posY += t.velY / 3;
            t.posZ += t.velZ / 3;

            if (t.isExploding) {
                t.velY -= 0.015; 
            } else if (currentMode === 'trap') {
                t.velY -= 0.003;
            }

            if (!t.isExploding && (t.posY < 0 || t.posZ > 0 || Math.abs(t.posX) > 18)) {
                misses++;
                missesInRound++;
                t.active = false;
                updateHUD();
                
                // If all targets are now inactive, reset
                if (!targets.some(tar => tar.active || tar.isExploding)) {
                    resetTargets();
                }
            }

            if (t.isExploding && (t.posY < -5 || t.posZ > 5 || Math.abs(t.posX) > 25)) {
                t.isExploding = false;
                if (!targets.some(tar => tar.active || tar.isExploding)) {
                    resetTargets();
                }
            }

            const el = document.getElementById(t.transformId);
            if (el) {
                el.setAttribute('translation', `${t.posX.toFixed(3)} ${t.posY.toFixed(3)} ${t.posZ.toFixed(3)}`);
            }
        }
    });

    if (window.projActive) {
        let anyPelletActive = false;
        window.pellets.forEach((p, i) => {
            if (!p.active) return;

            p.x += p.vx / 3;
            p.y += p.vy / 3;
            p.z += p.vz / 3;

            targets.forEach(t => {
                if (t.active && !t.isExploding) {
                    const dist = Math.hypot(t.posX - p.x, t.posY - p.y, t.posZ - p.z);
                    if (dist < 0.75) {
                        score++;
                        hitsInRound++;
                        t.active = false;
                        t.isExploding = true;
                        updateHUD();

                        const tSwitch = document.getElementById(t.switchId);
                        if (tSwitch) tSwitch.setAttribute('whichChoice', '1');

                        t.velY += 0.08;
                        t.velX *= 1.5;

                        setTimeout(() => {
                            if (t.isExploding) {
                                t.isExploding = false;
                                if (!targets.some(tar => tar.active || tar.isExploding)) {
                                    resetTargets();
                                }
                            }
                        }, 1000);
                    }
                }
            });

            if (p.z < -60 || Math.abs(p.x) > 40 || p.y < -10) {
                p.active = false;
                p.y = -100;
            } else {
                anyPelletActive = true;
            }

            const pelletEl = pelletElements[i];
            if (pelletEl) {
                pelletEl.setAttribute('translation', `${p.x.toFixed(3)} ${p.y.toFixed(3)} ${p.z.toFixed(3)}`);
            }
        });

        if (!anyPelletActive) {
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

window.NUM_PELLETS = 12;
window.pellets = Array.from({ length: window.NUM_PELLETS }, () => ({
    active: false,
    x: 0, y: -100, z: 0,
    vx: 0, vy: 0, vz: 0
}));

window.projActive = false;

window.fireProjectile = function(event, selectedChoke) {
    if (window.projActive) return;

    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-white/25 pointer-events-none z-50';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 50);

    const x3dEl = document.querySelector('x3d');
    const rect = x3dEl.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = (event.clientY - rect.top) + 90; // Vertical compensation offset

    const ndcX = (clickX / rect.width) * 2 - 1;
    const ndcY = -((clickY / rect.height) * 2 - 1);

    const fov = 0.785398; // 45 degrees in radians
    const aspect = rect.width / rect.height;
    const scaleY = Math.tan(fov / 2);
    const scaleX = scaleY * aspect;

    const dirX = ndcX * scaleX;
    const dirY = ndcY * scaleY;
    const dirZ = -1.0;

    const length = Math.hypot(dirX, dirY, dirZ);
    const speed = 2.4;
    const baseVx = (dirX / length) * speed;
    const baseVy = (dirY / length) * speed;
    const baseVz = (dirZ / length) * speed;

    let spreadFactor = 0.05;
    if (selectedChoke === 'cylinder') spreadFactor = 0.09;
    if (selectedChoke === 'full') spreadFactor = 0.025;

    window.pellets.forEach((p) => {
        p.active = true;
        p.x = 0;
        p.y = 1.6;
        p.z = 8;

        p.vx = baseVx + (Math.random() - 0.5) * spreadFactor * 2;
        p.vy = baseVy + (Math.random() - 0.5) * spreadFactor * 2;
        p.vz = baseVz + (Math.random() - 0.5) * spreadFactor;
    });

    document.getElementById('projectileGroup').setAttribute('translation', '0 0 0');
    window.projActive = true;
}
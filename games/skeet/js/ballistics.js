// ==========================================
// CONFIGURATION & INITIALIZATION
// ==========================================

// Define the total number of pellets fired in a single shot
window.NUM_PELLETS = 12;

// Initialize the pellets array with default inactive states and starting positions
window.pellets = Array.from({ length: window.NUM_PELLETS }, () => ({
    active: false,
    x: 0, y: -100, z: 0,
    vx: 0, vy: 0, vz: 0
}));

// Tracks whether a projectile/shot is currently active in the scene
window.projActive = false;


/**
 * Fires a spread of pellets based on click coordinates and the selected shotgun choke.
 *
 * @param {MouseEvent} event - The click event that triggered the shot.
 * @param {string} selectedChoke - The choke type ('cylinder', 'full', or default).
 */
window.fireProjectile = function(event, selectedChoke) {
    // Check if user has ammunition
    if (window.ammoCount <= 0) {
        return;
    }
    
    // Decrement ammunition
    window.ammoCount--;
    window.shotsTaken++;
    if (window.updateHUD) window.updateHUD();

    // Create a brief visual muzzle flash effect on the screen
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-white/25 pointer-events-none z-50';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 50);

    // Get the bounding dimensions of the X3D viewport element
    const x3dEl = document.querySelector('x3d');
    const rect = x3dEl.getBoundingClientRect();

    // Calculate click position relative to the X3D element
    const clickX = event.clientX - rect.left;
    const clickY = (event.clientY - rect.top) + 115;

    // Convert pixel coordinates to Normalized Device Coordinates (NDC) ranging from -1 to 1
    const ndcX = (clickX / rect.width) * 2 - 1;
    const ndcY = -((clickY / rect.height) * 2 - 1);

    // Camera field of view (FOV) configuration (45 degrees converted to radians)
    const fov = 0.785398;
    const aspect = rect.width / rect.height;
    const scaleY = Math.tan(fov / 2);
    const scaleX = scaleY * aspect;

    // Calculate initial 3D direction vectors from the screen coordinates
    const dirX = ndcX * scaleX;
    const dirY = ndcY * scaleY;
    const dirZ = -1.0;

    // Normalize direction and apply projectile speed
    const length = Math.hypot(dirX, dirY, dirZ);
    const speed = 2.4;
    const baseVx = (dirX / length) * speed;
    const baseVy = (dirY / length) * speed;
    const baseVz = (dirZ / length) * speed;

    // Determine pellet spread tightness based on the selected choke type
    let spreadFactor = 0.05; // Default/Modified choke
    if (selectedChoke === 'cylinder') spreadFactor = 0.09;  // Wider spread
    if (selectedChoke === 'full') spreadFactor = 0.025;     // Tighter spread

    // Activate and set initial physics vectors for each pellet in the shot
    window.pellets.forEach((p) => {
        p.active = true;
        p.x = 0;
        p.y = 1.6;
        p.z = 8;

        // Apply random variance to velocity to simulate pellet scatter
        p.vx = baseVx + (Math.random() - 0.5) * spreadFactor * 2;
        p.vy = baseVy + (Math.random() - 0.5) * spreadFactor * 2;
        p.vz = baseVz + (Math.random() - 0.5) * spreadFactor;
    });

    // Reset the X3D projectile group translation and flag the shot as active
    document.getElementById('projectileGroup').setAttribute('translation', '0 0 0');
    window.projActive = true;
}

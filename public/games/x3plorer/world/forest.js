/**
 * Populates the world with trees using an external X3D model.
 * It also registers each tree in the global obstacle registry for collision detection.
 * @param {HTMLElement} worldGroup - The X3D group to append trees to.
 */
export function buildForest(worldGroup) {
    if (!window.obstacleRegistry) {
        window.obstacleRegistry = [];
    }

    for (let i = 0; i < 120; i++) {
        // Random placement within map bounds
        const x = (Math.random() - 0.5) * 850;
        const z = (Math.random() - 0.5) * 850;
        
        // Keep a clear area around the starting spawn point
        if (Math.abs(x) < 20 && Math.abs(z) < 20) continue;

        // Register the tree trunk's position and bounding radius for collision detection
        window.obstacleRegistry.push({
            x: x,
            z: z,
            radius: 1.5
        });

        // Randomize scale and rotation for a more natural look
        const scale = .5 + Math.random() * 1.5;
        const rotationY = Math.random() * Math.PI * 2;
        
        const trans = document.createElement('transform');
        trans.setAttribute('translation', `${x} 0 ${z}`);
        trans.setAttribute('scale', `${scale} ${scale} ${scale}`);
        trans.setAttribute('rotation', `0 1 0 ${rotationY}`);

        // Use the external tree model
        const inline = document.createElement('inline');
        inline.setAttribute('url', '"models/tree.x3d"');
        trans.appendChild(inline);
        
        worldGroup.appendChild(trans);
    }
}
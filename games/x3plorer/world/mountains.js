/**
 * Creates a circular mountain range surrounding the playable arena.
 * These act as the world's boundary.
 * @param {HTMLElement} worldGroup - The X3D group to append mountains to.
 */
export function buildMountains(worldGroup) {
    if (!window.obstacleRegistry) {
        window.obstacleRegistry = [];
    }

    const mountainCount = 45;
    const mountainRadius = 1400; // Distance from the center of the map
    
    for (let i = 0; i < mountainCount; i++) {
        // Distribute mountains in a circle with some random variance
        const angle = (i / mountainCount) * Math.PI * 2 + (Math.random() * 0.1);
        const distVariance = mountainRadius + (Math.random() - 0.5) * 150;
        const mx = Math.cos(angle) * distVariance;
        const mz = Math.sin(angle) * distVariance;
        const mHeight = 250 + Math.random() * 150;
        const mWidth = 350 + Math.random() * 180;

        // Register the mountain base position and radius for collision boundaries
        window.obstacleRegistry.push({
            x: mx,
            z: mz,
            radius: mWidth * 0.45 // Proportional collision size based on mountain width
        });

        const mTrans = document.createElement('transform');
        // Offset height so the base of the cone is buried in the ground
        mTrans.setAttribute('translation', `${mx} ${mHeight / 2 - 20} ${mz}`);
        mTrans.setAttribute('scale', `${mWidth} ${mHeight} ${mWidth * 0.8}`);

        const mShape = document.createElement('shape');
        const mApp = document.createElement('appearance');
        const mMat = document.createElement('material');
        mMat.setAttribute('diffuseColor', '0.14 0.18 0.22');
        mMat.setAttribute('specularColor', '0.05 0.05 0.05');
        mApp.appendChild(mMat);
        mShape.appendChild(mApp);
        
        // Using a cone as the base geometry for mountains
        mShape.appendChild(document.createElement('cone'));
        mTrans.appendChild(mShape);
        worldGroup.appendChild(mTrans);
    }
}
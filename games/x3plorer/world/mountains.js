export function buildMountains(worldGroup) {
    if (!window.obstacleRegistry) {
        window.obstacleRegistry = [];
    }

    const mountainCount = 45;
    const mountainRadius = 1200;
    for (let i = 0; i < mountainCount; i++) {
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
        mTrans.setAttribute('translation', `${mx} ${mHeight / 2 - 20} ${mz}`);
        mTrans.setAttribute('scale', `${mWidth} ${mHeight} ${mWidth * 0.8}`);

        const mShape = document.createElement('shape');
        const mApp = document.createElement('appearance');
        const mMat = document.createElement('material');
        mMat.setAttribute('diffuseColor', '0.14 0.18 0.22');
        mMat.setAttribute('specularColor', '0.05 0.05 0.05');
        mApp.appendChild(mMat);
        mShape.appendChild(mApp);
        mShape.appendChild(document.createElement('cone'));
        mTrans.appendChild(mShape);
        worldGroup.appendChild(mTrans);
    }
}
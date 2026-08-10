export function buildForest(worldGroup) {
    if (!window.obstacleRegistry) {
        window.obstacleRegistry = [];
    }

    for (let i = 0; i < 55; i++) {
        const x = (Math.random() - 0.5) * 320;
        const z = (Math.random() - 0.5) * 320;
        if (Math.abs(x) < 20 && Math.abs(z) < 20) continue;

        // Register the tree trunk's position and bounding radius for collision detection
        window.obstacleRegistry.push({
            x: x,
            z: z,
            radius: 1.5 // Adjust this value to match the tree trunk thickness/collision size
        });

        const treeHeight = 16 + Math.random() * 12;
        const treeGroup = document.createElement('group');
        const trans = document.createElement('transform');
        trans.setAttribute('translation', `${x} ${treeHeight / 2} ${z}`);

        const trunkShape = document.createElement('shape');
        const trunkApp = document.createElement('appearance');
        const trunkMat = document.createElement('material');
        trunkMat.setAttribute('diffuseColor', '0.24 0.18 0.13');
        trunkMat.setAttribute('specularColor', '0.04 0.04 0.04');
        trunkApp.appendChild(trunkMat);
        trunkShape.appendChild(trunkApp);

        const trunkGeom = document.createElement('cylinder');
        trunkGeom.setAttribute('radius', `${0.9 + Math.random() * 0.5}`);
        trunkGeom.setAttribute('height', `${treeHeight}`);
        trunkShape.appendChild(trunkGeom);
        treeGroup.appendChild(trunkShape);

        const clusterCount = 5 + Math.floor(Math.random() * 4);
        for (let cl = 0; cl < clusterCount; cl++) {
            const angle = (cl / clusterCount) * Math.PI * 2 + Math.random();
            const distFromCenter = 1.0 + Math.random() * 2.2;
            const clx = Math.cos(angle) * distFromCenter;
            const clz = Math.sin(angle) * distFromCenter;
            const cly = (treeHeight * 0.3) + (cl * (treeHeight * 0.12));
            const clScale = 2.5 + Math.random() * 2.0;

            const clTrans = document.createElement('transform');
            clTrans.setAttribute('translation', `${clx} ${cly - (treeHeight / 2)} ${clz}`);
            clTrans.setAttribute('scale', `${clScale} ${clScale * 0.85} ${clScale}`);

            const clShape = document.createElement('shape');
            const clApp = document.createElement('appearance');
            const clMat = document.createElement('material');
            const greenShade = 0.18 + (Math.random() * 0.12);
            clMat.setAttribute('diffuseColor', `0.12 ${greenShade} 0.15`);
            clMat.setAttribute('specularColor', '0.1 0.2 0.1');
            clMat.setAttribute('shininess', '0.3');
            clApp.appendChild(clMat);
            clShape.appendChild(clApp);
            clShape.appendChild(document.createElement('sphere'));
            clTrans.appendChild(clShape);
            treeGroup.appendChild(clTrans);
        }

        trans.appendChild(treeGroup);
        worldGroup.appendChild(trans);
    }
}
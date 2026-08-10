export function buildBoulders(worldGroup) {
    if (!window.obstacleRegistry) {
        window.obstacleRegistry = [];
    }

    for (let c = 0; c < 12; c++) {
        const cx = (Math.random() - 0.5) * 280;
        const cz = (Math.random() - 0.5) * 280;
        if (Math.abs(cx) < 22 && Math.abs(cz) < 22) continue;

        // Register the boulder's position and bounding radius for collision detection
        window.obstacleRegistry.push({
            x: cx,
            z: cz,
            radius: 3.5 // Adjust this value to match the physical size of your boulders
        });

        const bGroup = document.createElement('group');
        const bTrans = document.createElement('transform');
        bTrans.setAttribute('translation', `${cx} 1.2 ${cz}`);
        bTrans.setAttribute('scale', `${2 + Math.random() * 4} ${2 + Math.random() * 3} ${2 + Math.random() * 4}`);
        bTrans.setAttribute('rotation', `${Math.random()} ${Math.random()} ${Math.random()} ${Math.random() * 3.14}`);

        const bShape = document.createElement('shape');
        const bApp = document.createElement('appearance');
        const bMat = document.createElement('material');
        bMat.setAttribute('diffuseColor', '0.22 0.25 0.28');
        bMat.setAttribute('specularColor', '0.1 0.1 0.1');
        bMat.setAttribute('shininess', '0.2');
        bApp.appendChild(bMat);
        bShape.appendChild(bApp);
        bShape.appendChild(document.createElement('sphere'));
        bTrans.appendChild(bShape);
        bGroup.appendChild(bTrans);
        worldGroup.appendChild(bGroup);
    }
}
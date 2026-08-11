/**
 * Populates the sky with birds that fly in procedural circles.
 * Their flight parameters are stored as DOM attributes for the EntityManager to update.
 * @param {HTMLElement} worldGroup - The X3D group to append birds to.
 */
export function buildWildlifeBirds(worldGroup) {
    for (let b = 0; b < 100; b++) {
        // Random starting position in the sky
        const bx = (Math.random() - 0.5) * 1200;
        const bz = (Math.random() - 0.5) * 1200;
        const by = 40 + Math.random() * 80;

        const birdTrans = document.createElement('transform');
        birdTrans.setAttribute('id', `bird-${b}`);
        birdTrans.setAttribute('translation', `${bx} ${by} ${bz}`);
        birdTrans.setAttribute('scale', '0.8 0.8 0.8');

        // Flight path and speed parameters stored as attributes for the engine to read
        birdTrans.setAttribute('data-speed', `${0.15 + Math.random() * 0.25}`);
        birdTrans.setAttribute('data-angle', `${Math.random() * Math.PI * 2}`);
        birdTrans.setAttribute('data-base-y', `${by}`);
        birdTrans.setAttribute('data-phase', `${Math.random() * Math.PI * 2}`);

        const birdGroup = document.createElement('group');

        const birdApp = document.createElement('appearance');
        const birdMat = document.createElement('material');
        birdMat.setAttribute('diffuseColor', '0.05 0.05 0.05');
        birdMat.setAttribute('specularColor', '0.2 0.2 0.2');
        birdApp.appendChild(birdMat);

        // Central body - a flattened sphere
        const bodyTrans = document.createElement('transform');
        bodyTrans.setAttribute('scale', '0.2 0.15 0.8');
        const bodyShape = document.createElement('shape');
        bodyShape.appendChild(birdApp.cloneNode(true));
        bodyShape.appendChild(document.createElement('sphere'));
        bodyTrans.appendChild(bodyShape);
        birdGroup.appendChild(bodyTrans);

        // Left wing (with ID for flapping animation)
        const leftWing = document.createElement('transform');
        leftWing.setAttribute('id', `bird-${b}-lwing`);
        leftWing.setAttribute('translation', '0.5 0.1 0');
        leftWing.setAttribute('rotation', '0 0 1 0.35');
        leftWing.setAttribute('scale', '0.9 0.05 0.3');
        const leftShape = document.createElement('shape');
        leftShape.appendChild(birdApp.cloneNode(true));
        leftShape.appendChild(document.createElement('box'));
        leftWing.appendChild(leftShape);
        birdGroup.appendChild(leftWing);

        // Right wing (with ID for flapping animation)
        const rightWing = document.createElement('transform');
        rightWing.setAttribute('id', `bird-${b}-rwing`);
        rightWing.setAttribute('translation', '-0.5 0.1 0');
        rightWing.setAttribute('rotation', '0 0 1 -0.35');
        rightWing.setAttribute('scale', '0.9 0.05 0.3');
        const rightShape = document.createElement('shape');
        rightShape.appendChild(birdApp.cloneNode(true));
        rightShape.appendChild(document.createElement('box'));
        rightWing.appendChild(rightShape);
        birdGroup.appendChild(rightWing);
        birdTrans.appendChild(birdGroup);
        worldGroup.appendChild(birdTrans);
    }
}

/**
 * Populates the ground with squirrels that roam around procedurally.
 * Squirrel data is registered in window.squirrelRegistry for the EntityManager.
 * @param {HTMLElement} worldGroup - The X3D group to append squirrels to.
 */
export function buildWildlifeSquirrels(worldGroup) {
    if (!window.squirrelRegistry) {
        window.squirrelRegistry = [];
    }

    for (let s = 0; s < 60; s++) {
        const sx = (Math.random() - 0.5) * 900;
        const sz = (Math.random() - 0.5) * 900;
        const sy = 0.2;

        const squirrelId = `squirrel-${s}`;
        const squirrelTrans = document.createElement('transform');
        squirrelTrans.setAttribute('id', squirrelId);
        squirrelTrans.setAttribute('translation', `${sx} ${sy} ${sz}`);
        squirrelTrans.setAttribute('scale', '0.6 0.6 0.6');

        const squirrelGroup = document.createElement('group');

        // Brown fur materials
        const furApp = document.createElement('appearance');
        const furMat = document.createElement('material');
        furMat.setAttribute('diffuseColor', '0.45 0.30 0.18');
        furMat.setAttribute('specularColor', '0.05 0.05 0.05');
        furMat.setAttribute('shininess', '0.1');
        furApp.appendChild(furMat);

        const underApp = document.createElement('appearance');
        const underMat = document.createElement('material');
        underMat.setAttribute('diffuseColor', '0.65 0.55 0.42');
        underMat.setAttribute('specularColor', '0.05 0.05 0.05');
        underMat.setAttribute('shininess', '0.1');
        underApp.appendChild(underMat);

        // Body
        const body = document.createElement('transform');
        body.setAttribute('translation', '0 0.5 0');
        body.setAttribute('scale', '0.5 0.38 0.7');
        const bodyShape = document.createElement('shape');
        bodyShape.appendChild(furApp.cloneNode(true));
        bodyShape.appendChild(document.createElement('sphere'));
        body.appendChild(bodyShape);
        squirrelGroup.appendChild(body);

        // Head
        const head = document.createElement('transform');
        head.setAttribute('translation', '0.55 0.65 0');
        head.setAttribute('scale', '0.3 0.28 0.28');
        const headShape = document.createElement('shape');
        headShape.appendChild(furApp.cloneNode(true));
        headShape.appendChild(document.createElement('sphere'));
        head.appendChild(headShape);
        
        // Eyes
        [[-0.2, 0.1, 0.2], [-0.2, 0.1, -0.2]].forEach(ePos => {
            const eyeTrans = document.createElement('transform');
            eyeTrans.setAttribute('translation', `${ePos[0]} ${ePos[1]} ${ePos[2]}`);
            const eyeShape = document.createElement('shape');
            const eyeApp = document.createElement('appearance');
            const eyeMat = document.createElement('material');
            eyeMat.setAttribute('diffuseColor', '0 0 0');
            eyeApp.appendChild(eyeMat);
            eyeShape.appendChild(eyeApp);
            const eyeSph = document.createElement('sphere');
            eyeSph.setAttribute('radius', '0.2');
            eyeShape.appendChild(eyeSph);
            eyeTrans.appendChild(eyeShape);
            head.appendChild(eyeTrans);
        });
        squirrelGroup.appendChild(head);

        // Bushy arched tail (with ID for wagging animation)
        const tailBase = document.createElement('transform');
        tailBase.setAttribute('id', `${squirrelId}-tail`);
        tailBase.setAttribute('translation', '-0.55 0.65 0');
        tailBase.setAttribute('rotation', '0 0 1 0.78');
        tailBase.setAttribute('scale', '0.4 0.6 0.35');
        
        const tailShape = document.createElement('shape');
        tailShape.appendChild(furApp.cloneNode(true));
        tailShape.appendChild(document.createElement('sphere'));
        tailBase.appendChild(tailShape);

        // Tail Tip
        const tailTip = document.createElement('transform');
        tailTip.setAttribute('translation', '-0.2 0.5 0');
        tailTip.setAttribute('scale', '0.8 0.8 0.8');
        const tipShape = document.createElement('shape');
        tipShape.appendChild(furApp.cloneNode(true));
        tipShape.appendChild(document.createElement('sphere'));
        tailTip.appendChild(tipShape);
        tailBase.appendChild(tailTip);
        
        squirrelGroup.appendChild(tailBase);

        // Legs (front and rear)
        ['0.35', '-0.35'].forEach((zOff, idx) => {
            const frontLeg = document.createElement('transform');
            frontLeg.setAttribute('id', `${squirrelId}-fleg-${idx}`);
            frontLeg.setAttribute('translation', `0.35 0.25 ${zOff}`);
            frontLeg.setAttribute('scale', '0.12 0.3 0.12');
            const legShape = document.createElement('shape');
            legShape.appendChild(furApp.cloneNode(true));
            const cyl = document.createElement('cylinder');
            cyl.setAttribute('height', '1.0');
            cyl.setAttribute('radius', '0.5');
            legShape.appendChild(cyl);
            frontLeg.appendChild(legShape);
            squirrelGroup.appendChild(frontLeg);

            const rearLeg = document.createElement('transform');
            rearLeg.setAttribute('id', `${squirrelId}-rleg-${idx}`);
            rearLeg.setAttribute('translation', `-0.35 0.25 ${zOff}`);
            rearLeg.setAttribute('scale', '0.14 0.32 0.14');
            const rLegShape = document.createElement('shape');
            rLegShape.appendChild(furApp.cloneNode(true));
            const rCyl = document.createElement('cylinder');
            rCyl.setAttribute('height', '1.0');
            rCyl.setAttribute('radius', '0.5');
            rLegShape.appendChild(rCyl);
            rearLeg.appendChild(rLegShape);
            squirrelGroup.appendChild(rearLeg);
        });

        squirrelTrans.appendChild(squirrelGroup);
        worldGroup.appendChild(squirrelTrans);

        // Register squirrel for animation in the EntityManager loop
        window.squirrelRegistry.push({
            id: squirrelId,
            x: sx,
            z: sz,
            baseX: sx,
            baseZ: sz,
            speed: 0.04 + Math.random() * 0.06,
            angle: Math.random() * Math.PI * 2,
            roamRadius: 20 + Math.random() * 30,
            animOffset: Math.random() * Math.PI * 2,
            stateTimer: Math.random() * 100
        });
    }
}
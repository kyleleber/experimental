export function buildSkyAndSun(worldGroup) {
    const skyGroup = document.createElement('group');

    // 1. Radiant Yellow Sun positioned closer and directly visible in the sky view
    const sunTrans = document.createElement('transform');
    sunTrans.setAttribute('translation', '0 350 -400');

    // Sun Core
    const sunShape = document.createElement('shape');
    const sunApp = document.createElement('appearance');
    const sunMat = document.createElement('material');
    sunMat.setAttribute('emissiveColor', '1.0 0.9 0.0'); // Bright vibrant yellow
    sunApp.appendChild(sunMat);
    sunShape.appendChild(sunApp);

    const sunSphere = document.createElement('sphere');
    sunSphere.setAttribute('radius', '60'); // Larger visible size
    sunShape.appendChild(sunSphere);
    sunTrans.appendChild(sunShape);

    // Volumetric Sun Rays (Intersecting starburst corona)
    const rayGroup = document.createElement('group');
    const rayCount = 8;
    for (let r = 0; r < rayCount; r++) {
        const rayRotTrans = document.createElement('transform');
        const angle = (r / rayCount) * Math.PI;
        rayRotTrans.setAttribute('rotation', `0 0 1 ${angle}`);

        const rayShape = document.createElement('shape');
        const rayApp = document.createElement('appearance');
        const rayMat = document.createElement('material');
        rayMat.setAttribute('emissiveColor', '1.0 0.95 0.3');
        rayMat.setAttribute('transparency', '0.3');
        rayApp.appendChild(rayMat);
        rayShape.appendChild(rayApp);

        const rayBox = document.createElement('box');
        rayBox.setAttribute('size', '180 6 1');
        rayShape.appendChild(rayBox);
        rayRotTrans.appendChild(rayShape);
        rayGroup.appendChild(rayRotTrans);
    }
    sunTrans.appendChild(rayGroup);

    // Animation Nodes for Sun Pulsing & Corona Scaling
    const sunTimer = document.createElement('TimeSensor');
    sunTimer.setAttribute('ID', 'sun-anim-timer');
    sunTimer.setAttribute('cycleInterval', '4.0');
    sunTimer.setAttribute('loop', 'true');
    sunTrans.appendChild(sunTimer);

    const sunScaleInterp = document.createElement('ScalarInterpolator');
    sunScaleInterp.setAttribute('ID', 'sun-scale-interpolator');
    sunScaleInterp.setAttribute('key', '0 0.25 0.5 0.75 1');
    sunScaleInterp.setAttribute('keyValue', '1.0 1.12 0.94 1.15 1.0');
    sunTrans.appendChild(sunScaleInterp);

    const route1 = document.createElement('ROUTE');
    route1.setAttribute('fromNode', 'sun-anim-timer');
    route1.setAttribute('fromField', 'fraction_changed');
    route1.setAttribute('toNode', 'sun-scale-interpolator');
    route1.setAttribute('toField', 'set_fraction');
    sunTrans.appendChild(route1);

    const sunScaleTrans = document.createElement('transform');
    sunScaleTrans.setAttribute('ID', 'sun-pulse-transform');
    sunScaleTrans.setAttribute('scale', '1 1 1');
    sunScaleTrans.appendChild(sunTrans);

    const route2 = document.createElement('ROUTE');
    route2.setAttribute('fromNode', 'sun-scale-interpolator');
    route2.setAttribute('fromField', 'value_changed');
    route2.setAttribute('toNode', 'sun-pulse-transform');
    route2.setAttribute('toField', 'scale');
    skyGroup.appendChild(sunScaleTrans);

    // 2. Floating procedural clouds kept at safe heights so they don't occlude the sun
    const cloudCount = 6;
    for (let c = 0; c < cloudCount; c++) {
        const startX = (Math.random() - 0.5) * 600;
        const startZ = -100 - Math.random() * 400; // Offset forward/sideways so clouds don't block the sun at (0, 350, -400)
        const startY = 320 + Math.random() * 60;

        const cloudTrans = document.createElement('transform');
        cloudTrans.setAttribute('ID', `cloud-trans-${c}`);
        cloudTrans.setAttribute('translation', `${startX} ${startY} ${startZ}`);

        const cloudGroup = document.createElement('group');
        const puffCount = 4 + Math.floor(Math.random() * 3);
        for (let p = 0; p < puffCount; p++) {
            const puffTrans = document.createElement('transform');
            const px = (Math.random() - 0.5) * 30;
            const py = (Math.random() - 0.5) * 6;
            const pz = (Math.random() - 0.5) * 15;
            const pScale = 12 + Math.random() * 10;

            puffTrans.setAttribute('translation', `${px} ${py} ${pz}`);
            puffTrans.setAttribute('scale', `${pScale} ${pScale * 0.5} ${pScale}`);

            const puffShape = document.createElement('shape');
            const puffApp = document.createElement('appearance');
            const puffMat = document.createElement('material');
            puffMat.setAttribute('emissiveColor', '0.98 0.98 0.98');
            puffApp.appendChild(puffMat);
            puffShape.appendChild(puffApp);
            puffShape.appendChild(document.createElement('sphere'));
            puffTrans.appendChild(puffShape);
            cloudGroup.appendChild(puffTrans);
        }
        cloudTrans.appendChild(cloudGroup);

        const cloudTimer = document.createElement('TimeSensor');
        cloudTimer.setAttribute('ID', `cloud-timer-${c}`);
        cloudTimer.setAttribute('cycleInterval', `${70 + c * 20}`);
        cloudTimer.setAttribute('loop', 'true');
        cloudTrans.appendChild(cloudTimer);

        const cloudPosInterp = document.createElement('PositionInterpolator');
        cloudPosInterp.setAttribute('ID', `cloud-pos-${c}`);
        cloudPosInterp.setAttribute('key', '0 0.5 1');
        cloudPosInterp.setAttribute('keyValue', `${startX} ${startY} ${startZ}  ${startX + 200} ${startY} ${startZ + 100}  ${startX} ${startY} ${startZ}`);
        cloudTrans.appendChild(cloudPosInterp);

        const routeA = document.createElement('ROUTE');
        routeA.setAttribute('fromNode', `cloud-timer-${c}`);
        routeA.setAttribute('fromField', 'fraction_changed');
        routeA.setAttribute('toNode', `cloud-pos-${c}`);
        routeA.setAttribute('toField', 'set_fraction');
        cloudTrans.appendChild(routeA);

        const routeB = document.createElement('ROUTE');
        routeB.setAttribute('fromNode', `cloud-pos-${c}`);
        routeB.setAttribute('fromField', 'value_changed');
        routeB.setAttribute('toNode', `cloud-trans-${c}`);
        routeB.setAttribute('toField', 'translation');
        cloudTrans.appendChild(routeB);

        skyGroup.appendChild(cloudTrans);
    }

    worldGroup.appendChild(skyGroup);
}
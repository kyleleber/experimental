export function buildWaterBodies(worldGroup) {
    // Organic cluster of irregular, overlapping water pools and winding wetland ribbons
    // lying completely flat on the ground plane.

    const waterZones = [
        // Main Central Lake / Lagoon Cluster
        { x: -45, z: -50, rx: 28, rz: 24, height: 0.02, color: '0.10 0.30 0.45' },
        { x: -32, z: -42, rx: 18, rz: 16, height: 0.025, color: '0.12 0.35 0.50' },
        { x: -55, z: -60, rx: 20, rz: 18, height: 0.018, color: '0.09 0.28 0.42' },

        // Secondary Marsh Basin (East)
        { x: 25, z: 20, rx: 22, rz: 15, height: 0.02, color: '0.11 0.32 0.48' },
        { x: 38, z: 32, rx: 14, rz: 12, height: 0.025, color: '0.13 0.38 0.52' },

        // Southern Delta Pool
        { x: 5, z: 55, rx: 25, rz: 18, height: 0.02, color: '0.10 0.31 0.46' }
    ];

    waterZones.forEach((pool) => {
        const poolTrans = document.createElement('transform');
        poolTrans.setAttribute('translation', `${pool.x} ${pool.height} ${pool.z}`);

        const poolShape = document.createElement('shape');
        const poolApp = document.createElement('appearance');
        const poolMat = document.createElement('material');
        poolMat.setAttribute('diffuseColor', pool.color);
        poolMat.setAttribute('specularColor', '0.75 0.85 0.95');
        poolMat.setAttribute('shininess', '0.95');
        poolMat.setAttribute('transparency', '0.2');
        poolApp.appendChild(poolMat);
        poolShape.appendChild(poolApp);

        const poolBox = document.createElement('box');
        poolBox.setAttribute('size', `${pool.rx * 2} 0.02 ${pool.rz * 2}`);
        poolShape.appendChild(poolBox);
        poolTrans.appendChild(poolShape);
        worldGroup.appendChild(poolTrans);

        const coreTrans = document.createElement('transform');
        coreTrans.setAttribute('translation', '0 0.005 0');
        const coreShape = document.createElement('shape');
        const coreApp = document.createElement('appearance');
        const coreMat = document.createElement('material');
        coreMat.setAttribute('diffuseColor', '0.20 0.48 0.68');
        coreMat.setAttribute('specularColor', '0.9 0.95 1.0');
        coreMat.setAttribute('shininess', '1.0');
        coreMat.setAttribute('transparency', '0.35');
        coreApp.appendChild(coreMat);
        coreShape.appendChild(coreApp);

        const coreBox = document.createElement('box');
        coreBox.setAttribute('size', `${pool.rx * 1.4} 0.025 ${pool.rz * 1.4}`);
        coreShape.appendChild(coreBox);
        coreTrans.appendChild(coreShape);
        poolTrans.appendChild(coreTrans);
    });

    // Natural meandering river networks laid flat across the ground
    const organicRivers = [
        [
            { x: -30, z: -35 }, { x: -18, z: -25 }, { x: -5, z: -30 }, { x: 8, z: -18 }, { x: 22, z: -10 }, { x: 35, z: 2 }, { x: 48, z: 18 }
        ],
        [
            { x: -15, z: -20 }, { x: -22, z: -2 }, { x: -12, z: 15 }, { x: 0, z: 30 }, { x: 12, z: 45 }, { x: 25, z: 58 }
        ]
    ];

    organicRivers.forEach((pathPoints) => {
        for (let i = 0; i < pathPoints.length - 1; i++) {
            const p1 = pathPoints[i];
            const p2 = pathPoints[i + 1];

            const midX = (p1.x + p2.x) / 2;
            const midZ = (p1.z + p2.z) / 2;
            const dx = p2.x - p1.x;
            const dz = p2.z - p1.z;
            const length = Math.sqrt(dx * dx + dz * dz);
            const angle = Math.atan2(dz, dx);

            const segTrans = document.createElement('transform');
            segTrans.setAttribute('translation', `${midX} 0.022 ${midZ}`);
            segTrans.setAttribute('rotation', `0 1 0 ${-angle}`);

            const segShape = document.createElement('shape');
            const segApp = document.createElement('appearance');
            const segMat = document.createElement('material');
            segMat.setAttribute('diffuseColor', '0.14 0.38 0.54');
            segMat.setAttribute('specularColor', '0.7 0.8 0.9');
            segMat.setAttribute('shininess', '0.9');
            segMat.setAttribute('transparency', '0.18');
            segApp.appendChild(segMat);
            segShape.appendChild(segApp);

            // Box dimensions: width, height (thickness), length along the rotated Z axis
            const riverBed = document.createElement('box');
            riverBed.setAttribute('size', `7.5 0.02 ${length * 1.04}`);
            segShape.appendChild(riverBed);
            segTrans.appendChild(segShape);

            const flowTrans = document.createElement('transform');
            flowTrans.setAttribute('translation', '0 0.004 0');
            const flowShape = document.createElement('shape');
            const flowApp = document.createElement('appearance');
            const flowMat = document.createElement('material');
            flowMat.setAttribute('diffuseColor', '0.24 0.55 0.75');
            flowMat.setAttribute('specularColor', '0.9 0.95 1.0');
            flowMat.setAttribute('shininess', '1.0');
            flowMat.setAttribute('transparency', '0.3');
            flowApp.appendChild(flowMat);
            flowShape.appendChild(flowApp);

            const flowBox = document.createElement('box');
            flowBox.setAttribute('size', `3.5 0.025 ${length * 1.02}`);
            flowShape.appendChild(flowBox);
            flowTrans.appendChild(flowShape);
            segTrans.appendChild(flowTrans);

            worldGroup.appendChild(segTrans);
        }
    });
}
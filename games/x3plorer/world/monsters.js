import { CONFIG, monsterRegistry } from '../config.js';

export function buildMonsters(worldGroup) {
    for (let i = 1; i <= CONFIG.totalMonsters; i++) {
        const angle = (i / CONFIG.totalMonsters) * Math.PI * 2 + (Math.random() * 0.8);
        const dist = 45 + Math.random() * 70;
        const mx = Math.cos(angle) * dist;
        const mz = Math.sin(angle) * dist;
        const my = 0.15;

        const mId = `creature-${i}`;
        const trans = document.createElement('transform');
        trans.setAttribute('id', mId);
        trans.setAttribute('translation', `${mx} ${my} ${mz}`);
        trans.setAttribute('scale', '0.85 0.85 0.85');
        trans.setAttribute('data-radius', '2.2');

        const wolfGroup = document.createElement('group');

        const furApp = document.createElement('appearance');
        const furMat = document.createElement('material');
        furMat.setAttribute('diffuseColor', '0.35 0.36 0.35');
        furMat.setAttribute('specularColor', '0.10 0.10 0.10');
        furMat.setAttribute('shininess', '0.10');
        furApp.appendChild(furMat);

        const darkFurApp = document.createElement('appearance');
        const darkFurMat = document.createElement('material');
        darkFurMat.setAttribute('diffuseColor', '0.22 0.23 0.23');
        darkFurMat.setAttribute('specularColor', '0.05 0.05 0.05');
        darkFurMat.setAttribute('shininess', '0.08');
        darkFurApp.appendChild(darkFurMat);

        const undercoatApp = document.createElement('appearance');
        const undercoatMat = document.createElement('material');
        undercoatMat.setAttribute('diffuseColor', '0.45 0.45 0.44');
        undercoatMat.setAttribute('specularColor', '0.06 0.06 0.06');
        undercoatMat.setAttribute('shininess', '0.08');
        undercoatApp.appendChild(undercoatMat);

        const chestFurApp = document.createElement('appearance');
        const chestFurMat = document.createElement('material');
        chestFurMat.setAttribute('diffuseColor', '0.55 0.55 0.53');
        chestFurMat.setAttribute('specularColor', '0.08 0.08 0.08');
        chestFurMat.setAttribute('shininess', '0.08');
        chestFurApp.appendChild(chestFurMat);

        const noseApp = document.createElement('appearance');
        const noseMat = document.createElement('material');
        noseMat.setAttribute('diffuseColor', '0.12 0.12 0.12');
        noseMat.setAttribute('specularColor', '0.15 0.15 0.15');
        noseMat.setAttribute('shininess', '0.40');
        noseApp.appendChild(noseMat);

        const eyeApp = document.createElement('appearance');
        const eyeMat = document.createElement('material');
        eyeMat.setAttribute('diffuseColor', '0.15 0.15 0.12');
        eyeMat.setAttribute('specularColor', '0.40 0.40 0.35');
        eyeMat.setAttribute('shininess', '0.6');
        eyeApp.appendChild(eyeMat);

        const pelvis = document.createElement('transform');
        pelvis.setAttribute('translation', '-0.55 1.42 0');
        pelvis.setAttribute('scale', '1.18 0.78 0.60');
        const pelvisShape = document.createElement('shape');
        pelvisShape.appendChild(furApp.cloneNode(true));
        pelvisShape.appendChild(document.createElement('sphere'));
        pelvis.appendChild(pelvisShape);
        wolfGroup.appendChild(pelvis);

        const ribCage = document.createElement('transform');
        ribCage.setAttribute('translation', '0.42 1.53 0');
        ribCage.setAttribute('scale', '1.38 0.86 0.66');
        const ribShape = document.createElement('shape');
        ribShape.appendChild(furApp.cloneNode(true));
        ribShape.appendChild(document.createElement('sphere'));
        ribCage.appendChild(ribShape);
        wolfGroup.appendChild(ribCage);

        const shoulder = document.createElement('transform');
        shoulder.setAttribute('translation', '0.83 1.62 0');
        shoulder.setAttribute('scale', '0.68 0.80 0.66');
        const shShape = document.createElement('shape');
        shShape.appendChild(darkFurApp.cloneNode(true));
        shShape.appendChild(document.createElement('sphere'));
        shoulder.appendChild(shShape);
        wolfGroup.appendChild(shoulder);

        const neck = document.createElement('transform');
        neck.setAttribute('translation', '1.18 2.02 0');
        neck.setAttribute('rotation', '0 0 1 -0.22');
        neck.setAttribute('scale', '0.52 0.86 0.50');
        const neckShape = document.createElement('shape');
        neckShape.appendChild(furApp.cloneNode(true));
        neckShape.appendChild(document.createElement('sphere'));
        neck.appendChild(neckShape);
        wolfGroup.appendChild(neck);

        const head = document.createElement('transform');
        head.setAttribute('id', `${mId}-head`);
        head.setAttribute('translation', '1.57 2.52 0');
        head.setAttribute('rotation', '0 0 1 -0.08');
        head.setAttribute('scale', '0.72 0.60 0.52');
        const headShape = document.createElement('shape');
        headShape.appendChild(furApp.cloneNode(true));
        headShape.appendChild(document.createElement('sphere'));
        head.appendChild(headShape);
        wolfGroup.appendChild(head);

        const brow = document.createElement('transform');
        brow.setAttribute('translation', '1.85 2.35 0');
        brow.setAttribute('scale', '0.52 0.40 0.48');
        const browShape = document.createElement('shape');
        browShape.appendChild(darkFurApp.cloneNode(true));
        browShape.appendChild(document.createElement('sphere'));
        brow.appendChild(browShape);
        wolfGroup.appendChild(brow);

        const muzzle = document.createElement('transform');
        muzzle.setAttribute('translation', '2.12 2.39 0');
        muzzle.setAttribute('scale', '0.68 0.34 0.34');
        const muzShape = document.createElement('shape');
        muzShape.appendChild(undercoatApp.cloneNode(true));
        muzShape.appendChild(document.createElement('sphere'));
        muzzle.appendChild(muzShape);
        wolfGroup.appendChild(muzzle);

        const nose = document.createElement('transform');
        nose.setAttribute('translation', '2.67 2.40 0');
        nose.setAttribute('scale', '0.19 0.15 0.19');
        const noseShape = document.createElement('shape');
        noseShape.appendChild(noseApp.cloneNode(true));
        noseShape.appendChild(document.createElement('sphere'));
        nose.appendChild(noseShape);
        wolfGroup.appendChild(nose);

        const jaw = document.createElement('transform');
        jaw.setAttribute('translation', '2.18 2.23 0');
        jaw.setAttribute('scale', '0.53 0.15 0.30');
        const jawShape = document.createElement('shape');
        jawShape.appendChild(darkFurApp.cloneNode(true));
        jawShape.appendChild(document.createElement('sphere'));
        jaw.appendChild(jawShape);
        wolfGroup.appendChild(jaw);

        ['0.32', '-0.32'].forEach(zOffset => {
            const ear = document.createElement('transform');
            ear.setAttribute('translation', `1.35 2.98 ${zOffset}`);
            ear.setAttribute('rotation', '0 0 1 -0.16');
            ear.setAttribute('scale', '0.27 0.55 0.20');
            const earShape = document.createElement('shape');
            earShape.appendChild(darkFurApp.cloneNode(true));
            const cone = document.createElement('cone');
            cone.setAttribute('height', '1.0');
            cone.setAttribute('bottomRadius', '0.55');
            earShape.appendChild(cone);
            ear.appendChild(earShape);
            wolfGroup.appendChild(ear);
        });

        ['0.43', '-0.43'].forEach(zOffset => {
            const eye = document.createElement('transform');
            eye.setAttribute('translation', `1.88 2.58 ${zOffset}`);
            eye.setAttribute('scale', '0.075 0.075 0.045');
            const eyeShape = document.createElement('shape');
            eyeShape.appendChild(eyeApp.cloneNode(true));
            eyeShape.appendChild(document.createElement('sphere'));
            eye.appendChild(eyeShape);
            wolfGroup.appendChild(eye);
        });

        const chest = document.createElement('transform');
        chest.setAttribute('translation', '1.12 1.78 0');
        chest.setAttribute('scale', '0.46 0.74 0.55');
        const chestShape = document.createElement('shape');
        chestShape.appendChild(chestFurApp.cloneNode(true));
        chestShape.appendChild(document.createElement('sphere'));
        chest.appendChild(chestShape);
        wolfGroup.appendChild(chest);

        const frontNear = document.createElement('transform');
        frontNear.setAttribute('id', `${mId}-f-near`);
        frontNear.setAttribute('translation', '0.88 1.25 0.46');
        const fUpperNear = document.createElement('transform');
        fUpperNear.setAttribute('rotation', '0 0 1 0.10');
        const fTransNear = document.createElement('transform');
        fTransNear.setAttribute('translation', '0 -0.55 0');
        fTransNear.setAttribute('scale', '0.25 0.62 0.23');
        const fShapeNear = document.createElement('shape');
        fShapeNear.appendChild(furApp.cloneNode(true));
        const fCyl1 = document.createElement('cylinder');
        fCyl1.setAttribute('height', '1.0');
        fCyl1.setAttribute('radius', '0.72');
        fShapeNear.appendChild(fCyl1);
        fTransNear.appendChild(fShapeNear);
        fUpperNear.appendChild(fTransNear);

        const fLowerNear = document.createElement('transform');
        fLowerNear.setAttribute('translation', '0 -1.05 0');
        const fScaleLowerN = document.createElement('transform');
        fScaleLowerN.setAttribute('scale', '0.20 0.62 0.19');
        const fShapeLowerN = document.createElement('shape');
        fShapeLowerN.appendChild(darkFurApp.cloneNode(true));
        const fCyl2 = document.createElement('cylinder');
        fCyl2.setAttribute('height', '1.0');
        fCyl2.setAttribute('radius', '0.70');
        fShapeLowerN.appendChild(fCyl2);
        fScaleLowerN.appendChild(fShapeLowerN);
        fLowerNear.appendChild(fScaleLowerN);

        const fPawNear = document.createElement('transform');
        fPawNear.setAttribute('translation', '0 -0.70 0');
        fPawNear.setAttribute('scale', '0.30 0.16 0.34');
        const fPawNShape = document.createElement('shape');
        fPawNShape.appendChild(darkFurApp.cloneNode(true));
        fPawNShape.appendChild(document.createElement('sphere'));
        fPawNear.appendChild(fPawNShape);
        fLowerNear.appendChild(fPawNear);
        fUpperNear.appendChild(fLowerNear);
        frontNear.appendChild(fUpperNear);
        wolfGroup.appendChild(frontNear);

        const frontFar = document.createElement('transform');
        frontFar.setAttribute('id', `${mId}-f-far`);
        frontFar.setAttribute('translation', '0.88 1.25 -0.46');
        const fUpperFar = document.createElement('transform');
        fUpperFar.setAttribute('rotation', '0 0 1 -0.10');
        const fTransFar = document.createElement('transform');
        fTransFar.setAttribute('translation', '0 -0.55 0');
        fTransFar.setAttribute('scale', '0.25 0.62 0.23');
        const fShapeFar = document.createElement('shape');
        fShapeFar.appendChild(darkFurApp.cloneNode(true));
        const fCyl3 = document.createElement('cylinder');
        fCyl3.setAttribute('height', '1.0');
        fCyl3.setAttribute('radius', '0.72');
        fShapeFar.appendChild(fCyl3);
        fTransFar.appendChild(fShapeFar);
        fUpperFar.appendChild(fTransFar);

        const fLowerFar = document.createElement('transform');
        fLowerFar.setAttribute('translation', '0 -1.05 0');
        const fScaleLowerF = document.createElement('transform');
        fScaleLowerF.setAttribute('scale', '0.20 0.62 0.19');
        const fShapeLowerF = document.createElement('shape');
        fShapeLowerF.appendChild(darkFurApp.cloneNode(true));
        const fCyl4 = document.createElement('cylinder');
        fCyl4.setAttribute('height', '1.0');
        fCyl4.setAttribute('radius', '0.70');
        fShapeLowerF.appendChild(fCyl4);
        fScaleLowerF.appendChild(fShapeLowerF);
        fLowerFar.appendChild(fScaleLowerF);

        const fPawFar = document.createElement('transform');
        fPawFar.setAttribute('translation', '0 -0.70 0');
        fPawFar.setAttribute('scale', '0.30 0.16 0.34');
        const fPawFShape = document.createElement('shape');
        fPawFShape.appendChild(darkFurApp.cloneNode(true));
        fPawFShape.appendChild(document.createElement('sphere'));
        fPawFar.appendChild(fPawFShape);
        fLowerFar.appendChild(fPawFar);
        fUpperFar.appendChild(fLowerFar);
        frontFar.appendChild(fUpperFar);
        wolfGroup.appendChild(frontFar);

        const rearNear = document.createElement('transform');
        rearNear.setAttribute('id', `${mId}-r-near`);
        rearNear.setAttribute('translation', '-0.78 1.25 0.47');
        const rUpperNear = document.createElement('transform');
        rUpperNear.setAttribute('rotation', '0 0 1 -0.38');
        const rTransNear = document.createElement('transform');
        rTransNear.setAttribute('translation', '0 -0.52 0');
        rTransNear.setAttribute('scale', '0.31 0.66 0.28');
        const rShapeNear = document.createElement('shape');
        rShapeNear.appendChild(furApp.cloneNode(true));
        const rCyl1 = document.createElement('cylinder');
        rCyl1.setAttribute('height', '1.0');
        rCyl1.setAttribute('radius', '0.72');
        rShapeNear.appendChild(rCyl1);
        rTransNear.appendChild(rShapeNear);
        rUpperNear.appendChild(rTransNear);

        const rLowerNear = document.createElement('transform');
        rLowerNear.setAttribute('translation', '0 -1.02 0');
        rLowerNear.setAttribute('rotation', '0 0 1 0.28');
        const rScaleLowerN = document.createElement('transform');
        rScaleLowerN.setAttribute('scale', '0.23 0.62 0.21');
        const rShapeLowerN = document.createElement('shape');
        rShapeLowerN.appendChild(darkFurApp.cloneNode(true));
        const rCyl2 = document.createElement('cylinder');
        rCyl2.setAttribute('height', '1.0');
        rCyl2.setAttribute('radius', '0.68');
        rShapeLowerN.appendChild(rCyl2);
        rScaleLowerN.appendChild(rShapeLowerN);
        rLowerNear.appendChild(rScaleLowerN);

        const rPawNear = document.createElement('transform');
        rPawNear.setAttribute('translation', '0 -0.68 0');
        rPawNear.setAttribute('scale', '0.34 0.17 0.38');
        const rPawNShape = document.createElement('shape');
        rPawNShape.appendChild(darkFurApp.cloneNode(true));
        rPawNShape.appendChild(document.createElement('sphere'));
        rPawNear.appendChild(rPawNShape);
        rLowerNear.appendChild(rPawNear);
        rUpperNear.appendChild(rLowerNear);
        rearNear.appendChild(rUpperNear);
        wolfGroup.appendChild(rearNear);

        const rearFar = document.createElement('transform');
        rearFar.setAttribute('id', `${mId}-r-far`);
        rearFar.setAttribute('translation', '-0.78 1.25 -0.47');
        const rUpperFar = document.createElement('transform');
        rUpperFar.setAttribute('rotation', '0 0 1 -0.38');
        const rTransFar = document.createElement('transform');
        rTransFar.setAttribute('translation', '0 -0.52 0');
        rTransFar.setAttribute('scale', '0.31 0.66 0.28');
        const rShapeFar = document.createElement('shape');
        rShapeFar.appendChild(darkFurApp.cloneNode(true));
        const rCyl3 = document.createElement('cylinder');
        rCyl3.setAttribute('height', '1.0');
        rCyl3.setAttribute('radius', '0.72');
        rShapeFar.appendChild(rCyl3);
        rTransFar.appendChild(rShapeFar);
        rUpperFar.appendChild(rTransFar);

        const rLowerFar = document.createElement('transform');
        rLowerFar.setAttribute('translation', '0 -1.02 0');
        rLowerFar.setAttribute('rotation', '0 0 1 0.28');
        const rScaleLowerF = document.createElement('transform');
        rScaleLowerF.setAttribute('scale', '0.23 0.62 0.21');
        const rShapeLowerF = document.createElement('shape');
        rShapeLowerF.appendChild(darkFurApp.cloneNode(true));
        const rCyl4 = document.createElement('cylinder');
        rCyl4.setAttribute('height', '1.0');
        rCyl4.setAttribute('radius', '0.68');
        rShapeLowerF.appendChild(rCyl4);
        rScaleLowerF.appendChild(rShapeLowerF);
        rLowerFar.appendChild(rScaleLowerF);

        const rPawFar = document.createElement('transform');
        rPawFar.setAttribute('translation', '0 -0.68 0');
        rPawFar.setAttribute('scale', '0.34 0.17 0.38');
        const rPawFShape = document.createElement('shape');
        rPawFShape.appendChild(darkFurApp.cloneNode(true));
        rPawFShape.appendChild(document.createElement('sphere'));
        rPawFar.appendChild(rPawFShape);
        rLowerFar.appendChild(rPawFar);
        rUpperFar.appendChild(rLowerFar);
        rearFar.appendChild(rUpperFar);
        wolfGroup.appendChild(rearFar);

        const tailBase = document.createElement('transform');
        tailBase.setAttribute('translation', '-1.55 1.65 0');
        tailBase.setAttribute('rotation', '0 0 1 0.35');
        const tBaseTrans = document.createElement('transform');
        tBaseTrans.setAttribute('translation', '0 -0.48 0');
        tBaseTrans.setAttribute('scale', '0.34 0.58 0.32');
        const tBaseShape = document.createElement('shape');
        tBaseShape.appendChild(furApp.cloneNode(true));
        const tCyl1 = document.createElement('cylinder');
        tCyl1.setAttribute('height', '1.0');
        tCyl1.setAttribute('radius', '0.75');
        tBaseShape.appendChild(tCyl1);
        tBaseTrans.appendChild(tBaseShape);
        tailBase.appendChild(tBaseTrans);

        const tailMid = document.createElement('transform');
        tailMid.setAttribute('id', `${mId}-tail`);
        tailMid.setAttribute('translation', '0 -0.92 0');
        tailMid.setAttribute('rotation', '0 0 1 0.35');
        const tMidTrans = document.createElement('transform');
        tMidTrans.setAttribute('translation', '0 -0.42 0');
        tMidTrans.setAttribute('scale', '0.27 0.52 0.25');
        const tMidShape = document.createElement('shape');
        tMidShape.appendChild(darkFurApp.cloneNode(true));
        const tCyl2 = document.createElement('cylinder');
        tCyl2.setAttribute('height', '0.9');
        tCyl2.setAttribute('radius', '0.72');
        tMidShape.appendChild(tCyl2);
        tMidTrans.appendChild(tMidShape);
        tailMid.appendChild(tMidTrans);

        const tailTip = document.createElement('transform');
        tailTip.setAttribute('translation', '0 -0.30 0');
        tailTip.setAttribute('rotation', '0 0 1 0.28');
        const tTipTrans = document.createElement('transform');
        tTipTrans.setAttribute('translation', '0 -0.30 0');
        tTipTrans.setAttribute('scale', '0.20 0.40 0.20');
        const tTipShape = document.createElement('shape');
        tTipShape.appendChild(darkFurApp.cloneNode(true));
        const tCone = document.createElement('cone');
        tCone.setAttribute('height', '0.8');
        tCone.setAttribute('bottomRadius', '0.75');
        tTipShape.appendChild(tCone);
        tTipTrans.appendChild(tTipShape);
        tailTip.appendChild(tTipTrans);

        tailMid.appendChild(tailTip);
        tailBase.appendChild(tailMid);
        wolfGroup.appendChild(tailBase);

        trans.appendChild(wolfGroup);
        worldGroup.appendChild(trans);

        monsterRegistry.push({
            id: mId,
            x: mx,
            y: my,
            z: mz,
            speed: 0.065 + Math.random() * 0.015,
            animOffset: Math.random() * Math.PI * 2,
            flankAngle: (i / CONFIG.totalMonsters) * Math.PI * 2,
            flankTimer: Math.random() * 100,
            attackCooldown: 0
        });
    }
}
const W = window.innerWidth;
const H = window.innerHeight;
const container = document.createElement('div');
document.body.appendChild(container);

const paramSettings = {
    camera: {
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
    },
    scene: {
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
    }
};

const clock = new THREE.Clock();

const gui = new dat.GUI();
gui.add(paramSettings.scene, 'positionX').min(-5).max(5).step(0.1);
gui.add(paramSettings.scene, 'positionY').min(-5).max(5).step(0.1);
gui.add(paramSettings.scene, 'positionZ').min(-5).max(5).step(0.1);
gui.add(paramSettings.scene, 'rotationX').min(-0.1).max(0.1).step(0.0001);
gui.add(paramSettings.scene, 'rotationY').min(-0.1).max(0.1).step(0.0001);
gui.add(paramSettings.scene, 'rotationZ').min(-0.1).max(0.1).step(0.0001);

const camera = new THREE.PerspectiveCamera(30, W / H, 1, 10000);
// camera.position.set(1000, 50, 1500);
camera.position.set(0, 0, 1000);
const scene = new THREE.Scene();

// temp rotation
// scene.rotation.y = -0.7464999999999921;
// scene.rotation.z = -0.09929999999999703;
// scene.position.z = -296.50000000000125;

scene.add(new THREE.AmbientLight(0x666666));

const poleGeo = new THREE.BoxBufferGeometry(5, 375, 5);
const poleMat = new THREE.MeshNormalMaterial({ wareframe: true });


const poleLeft = new THREE.Mesh(poleGeo, poleMat);
poleLeft.position.x = -300;
poleLeft.position.y = 0;
poleLeft.receiveShadow = true;
poleLeft.castShadow = true;
scene.add(poleLeft);


const poleRight = new THREE.Mesh(poleGeo, poleMat);
poleRight.position.x = 300;
poleRight.position.y = 0;
poleRight.receiveShadow = true;
poleRight.castShadow = true;
scene.add(poleRight);

const poleBottom = new THREE.Mesh(new THREE.BoxBufferGeometry(600, 5, 5), poleMat);
poleBottom.position.x = 0;
poleBottom.position.y = -170;
poleBottom.receiveShadow = true;
poleBottom.castShadow = true;

const poleStand1 = new THREE.Mesh(new THREE.BoxBufferGeometry(5, 5, 90), poleMat);
poleStand1.position.x = 250;
poleStand1.position.y = -166;
poleStand1.position.z = 35;
poleStand1.receiveShadow = true;
poleStand1.castShadow = true;

const poleStand2 = new THREE.Mesh(new THREE.BoxBufferGeometry(5, 5, 90), poleMat);
poleStand2.position.x = 290;
poleStand2.position.y = -166;
poleStand2.position.z = 35;
poleStand2.receiveShadow = true;
poleStand2.castShadow = true;

const poleGroup = new THREE.Group();
poleGroup.add(poleStand1);
poleGroup.add(poleStand2);

const moveGroup = new THREE.Group();
moveGroup.add(poleBottom);
moveGroup.add(poleGroup);
scene.add(moveGroup);

const getWarehouseBox = () => {
    let linePositionX = -290;
    let shelfPositionY = -170;
    for (let i = 0; i < 5; i++) {
        const lineForward = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 350, 2), poleMat);
        const lineBackward = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 350, 2), poleMat);

        lineForward.position.x = lineBackward.position.x = linePositionX;
        lineForward.position.y = lineBackward.position.y = 0;
        lineForward.position.z = -15, lineBackward.position.z = -75;
        lineForward.receiveShadow = lineBackward.receiveShadow = true;
        lineForward.castShadow = lineBackward.castShadow = true;
        scene.add(lineForward);
        scene.add(lineBackward);

        linePositionX += 145;
    }

    for (let i = 0; i < 7; i++) {
        const shelf = new THREE.Mesh(new THREE.BoxBufferGeometry(600, 2, 60), poleMat)

        shelf.position.y = shelfPositionY;
        shelf.position.z = -45;
        scene.add(shelf);

        shelfPositionY += 50;
    }
};

getWarehouseBox();

let mixer = null, box;

// пока устанавливается фиксированное время, но надо рассчитывать исходя из row and column
const goAction = ({ col, row }, takeoff) => {
    // главные параметры которые считаем
    const positionY = (row * 50) - 55;
    const positionX = (col * (145 / 3)) - ((145 / 3) - 5);
    const maxTime = 5; // sec
    const maxDistance = ((12 * (145 / 3)) - ((145 / 3) - 5)) + ((7 * 50) - 55);
    const distance = positionX + positionY;
    const factor = maxTime / maxDistance;
    const time = Math.abs(distance * factor) + 1;
    const halfTime = time / 2;

    const getBox = () => {
        // temp in global scope
        // const box = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 50, 50), poleMat);
        const box = new THREE.Mesh(new THREE.BoxBufferGeometry(40, 40, 40), poleMat);
        const groupBox = new THREE.Group();
        groupBox.name = col + '-' + row;

        box.position.x = 270;
        box.position.y = -144;
        box.position.z = 35;
        box.receiveShadow = true;
        box.castShadow = true;
        groupBox.add(box);

        return groupBox;
    };

    const getAndDletedBox = () => {
        const box = takeoff
            ? scene.getChildByName(col + '-' + row)
            : getBox();
        !takeoff && poleGroup.add(box);
        takeoff && setTimeout(() => {
            box.position.x = 0;
            box.position.y = 0;
            box.position.z = 0;
            poleGroup.add(box);
        }, halfTime * 1000);

        const forvard = () => {

        };

        setTimeout(() => {
            poleGroup.remove(box);
            box.position.x = -positionX;
            box.position.y = positionY;
            box.position.z = -80;
            !takeoff && scene.add(box);
        }, !takeoff ? halfTime * 1000 : time * 1000 + 3000);
    };
    
    getAndDletedBox();

    if (mixer && mixer._actions.some(action => action.isRunning())) return;

    const track = new THREE.NumberKeyframeTrack('.position[y]', [0, halfTime - .5, halfTime + .5, time], [0, positionY, positionY, 0]);
    const clip = new THREE.AnimationClip('Clip', time, [track]);

    const track1 = new THREE.NumberKeyframeTrack('.position[x]', [0, halfTime - .5, halfTime + .5, time], [0, -positionX, -positionX, 0]);
    const clip1 = new THREE.AnimationClip('Clip1', time, [track1]);

    const track2 = new THREE.NumberKeyframeTrack('.position[z]', [0, halfTime - .5, halfTime, halfTime + 0.5, time], [0, 0, -80, 0, 0]);
    const clip2 = new THREE.AnimationClip('Clip2', time, [track2]);

    mixer = new THREE.AnimationMixer(moveGroup);
    const action = mixer.clipAction(clip);
    const action1 = mixer.clipAction(clip1, poleGroup);
    const action2 = mixer.clipAction(clip2, poleGroup);
    action.repetitions = 1;
    action1.repetitions = 1;
    action2.repetitions = 1;
    action.play();
    action1.play();
    action2.play();

    // setInterval(() => {
    //     if(mixer && !mixer._actions.some(action => action.isRunning())) mixer = null;
    // }, 20);
};
// test
// document.body.onclick = event => goAction(3, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(W, H);
const controls = new THREE.OrbitControls(scene, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 100;
controls.maxDistance = 500;
container.appendChild(renderer.domElement);

init();
animate();

function init() {

}
function animate() {
    requestAnimationFrame(animate);

    render();
}

/* const rotationScene = event => {
    paramSettings.scene.rotationX += event.movementY * 0.0001;
    paramSettings.scene.rotationY += event.movementX * 0.0001;
};

document.addEventListener('mousedown', event => {
    document.addEventListener('mousemove', rotationScene)
});

document.addEventListener('mouseup', event => {
    paramSettings.scene.rotationX = 0;
    paramSettings.scene.rotationY = 0;
    paramSettings.scene.rotationZ = 0;
    document.removeEventListener('mousemove', rotationScene);
}); */

function render() {
    scene.position.z += paramSettings.scene.positionX;
    scene.position.y += paramSettings.scene.positionY;
    scene.position.z += paramSettings.scene.positionZ;
    scene.rotation.z += paramSettings.scene.rotationX;
    scene.rotation.y += paramSettings.scene.rotationY;
    scene.rotation.z += paramSettings.scene.rotationZ;

    const delta = clock.getDelta();

    if ( mixer ) {
        mixer.update( delta );
    }

    renderer.render(scene, camera);
}

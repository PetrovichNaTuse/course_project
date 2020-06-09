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
scene.add(new THREE.AmbientLight(0x666666));

const poleGeo = new THREE.BoxBufferGeometry(5, 375, 5);
const poleMat = new THREE.MeshLambertMaterial();

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
poleBottom.position.y = -185;
poleBottom.receiveShadow = true;
poleBottom.castShadow = true;
scene.add(poleBottom);

const poleStand1 = new THREE.Mesh(new THREE.BoxBufferGeometry(5, 5, 60), poleMat);
poleStand1.position.x = 250;
poleStand1.position.y = -180;
poleStand1.position.z = 26;
poleStand1.receiveShadow = true;
poleStand1.castShadow = true;
scene.add(poleStand1);

const poleStand2 = new THREE.Mesh(new THREE.BoxBufferGeometry(5, 5, 60), poleMat);
poleStand2.position.x = 290;
poleStand2.position.y = -180;
poleStand2.position.z = 26;
poleStand2.receiveShadow = true;
poleStand2.castShadow = true;
scene.add(poleStand2);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(W, H);
container.appendChild(renderer.domElement);

init();
animate();

function init() {

}

function animate() {
    requestAnimationFrame(animate);
    render();
}




const rotationScene = event => {
    paramSettings.scene.rotationX += event.movementX * 0.0001;
    paramSettings.scene.rotationY += event.movementY * 0.0001;
};

document.addEventListener('mousedown', event => {
    document.addEventListener('mousemove', rotationScene)
});

// TODO: на прокрутку настроить бы
document.addEventListener('mousewheel', event => {
    // console.log(event.deltaY);
});
document.addEventListener('mouseup', event => {
    paramSettings.scene.rotationX = 0;
    paramSettings.scene.rotationY = 0;
    paramSettings.scene.rotationZ = 0;
    document.removeEventListener('mousemove', rotationScene);
});

function render() {
    scene.position.z += paramSettings.scene.positionX;
    scene.position.y += paramSettings.scene.positionY;
    scene.position.z += paramSettings.scene.positionZ;
    scene.rotation.z += paramSettings.scene.rotationX;
    scene.rotation.y += paramSettings.scene.rotationY;
    scene.rotation.z += paramSettings.scene.rotationZ;
    

    renderer.render(scene, camera);
}

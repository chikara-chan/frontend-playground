import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import ele from './ele';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);
const renderer = new THREE.WebGLRenderer();
const loader = new THREE.JSONLoader();
const ambientLight = new THREE.AmbientLight();
const pointLight = new THREE.PointLight();
const axesHelper = new THREE.AxesHelper(100);

scene.add(axesHelper);
camera.up.set(0, 0, 1);
camera.position.x = 10;
scene.add(ambientLight);
scene.add(pointLight);
pointLight.position.set(0, 0, 100);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xcccccc);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera);

const { geometry, materials } = loader.parse(ele, './');
console.log(materials);
const mesh = new THREE.Mesh(geometry, materials);

mesh.rotation.x = 90 * Math.PI / 180;
scene.add(mesh);

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();

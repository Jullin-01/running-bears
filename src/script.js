import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './styles.css';


import {Launcher} from './launcher.js'

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new Launcher();
});









function switchScreen(screenId) {
    document.getElementById(currentScreen).style.display = 'none';
    document.getElementById(screenId).style.display = 'block';
    currentScreen = screenId;
    if (screenId == 'choiceColorScreen') 
    {   
        resizeRender(); 

        bearModel.traverse(function (object) {
            if (object.material && object.material.name == 'Mat.base') {
                object.material.color.setStyle(colorBear);
            }
        })
        
    } 
}


// Active color
document.addEventListener('DOMContentLoaded', function() {
    let colorBlocks = document.querySelectorAll('.colorBlock');

    colorBlocks.forEach(function(block) {
        block.addEventListener('click', function() {
            toggleActiveClass(block);
            changeDynamicBlockColor(block);
        });
    });

    function toggleActiveClass(clickedBlock) {
        colorBlocks.forEach(function(block) {
            block.classList.remove('active');
        });

        clickedBlock.classList.add('active');
    }

    function changeDynamicBlockColor(clickedBlock) {
        let activeColor = getComputedStyle(clickedBlock).backgroundColor;
        bearModel.traverse(function (object) {
            if (object.material && object.material.name == 'Mat.base') {
                object.material.color.setStyle(activeColor);
            }
        })
    }
});



// Scene
const scene = new THREE.Scene();

// Object
const loader = new GLTFLoader();

let bearModel = null;

let mixer = null;
// get default bear color 
const color1Element = document.querySelector('.color1');
const color1BackgroundColor = window.getComputedStyle(color1Element).getPropertyValue('background-color');
const colorBear = color1BackgroundColor;

    loader.load(
        './static/bear.glb',
        (glb) => {
            bearModel = glb.scene;
            scene.add(glb.scene);
            mixer = new THREE.AnimationMixer(glb.scene);
            mixer.clipAction(THREE.AnimationClip.findByName(glb.animations, 'happy-idle')).play();

        },
    );

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
scene.add(camera);


    const canvas = document.getElementById("canvasColor");

    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setClearColor(0xA3A3A3, 0);

    window.addEventListener('resize', (e) => { 
        resizeRender();
        }); 
        
    function resizeRender() { 
    const divCanvasBear = document.getElementById("divCanvasBear");
    // update camera
    camera.aspect = divCanvasBear.clientWidth / divCanvasBear.clientHeight;
    camera.updateProjectionMatrix();

    // update canvas size
    canvas.width = divCanvasBear.clientWidth;
    canvas.height = divCanvasBear.clientHeight;

    // update renderer
    renderer.setSize(divCanvasBear.clientWidth, divCanvasBear.clientHeight); 
    renderer.setPixelRatio = divCanvasBear.clientWidth / divCanvasBear.clientHeight;
}

    const controls = new OrbitControls( camera, renderer.domElement );

    const ambientLight = new THREE.AmbientLight(0xEDEDED, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    scene.add(directionalLight);
    directionalLight.position.set(10, 11, 7);

    camera.position.z = 1

    const clock = new THREE.Clock();

    function animate() {

        if (mixer) {
            mixer.update(clock.getDelta());
        }

        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }
    animate()

    

  
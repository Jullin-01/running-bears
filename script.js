import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let playerName = document.getElementById("playerName").value;
let currentScreen = 'registration';

// Display main menu initially
document.getElementById(currentScreen).style.display = 'block';

const fullscreenButton = document.getElementById('fullscreen-button');
const gameContainer = document.getElementById('game-container');
const gameTitle = document.querySelector('h1');


fullscreenButton.addEventListener('click', toggleFullScreen);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen()
            .catch(err => {
                alert(`Error when switching to full screen mode: ${err.message}`);
            });
        gameTitle.classList.add('large');
    } else {
        document.exitFullscreen();
        gameTitle.classList.remove('large');
    }
}

// Full screen status change handler
document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
        gameTitle.classList.remove('large');
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            gameTitle.classList.remove('large');
        }
    }
});

const buttonChoiceColor = document.getElementById('choice-color');
buttonChoiceColor.addEventListener('click', choiceColor)
function choiceColor() {
    switchScreen('choiceColorScreen');
}

const buttonStart = document.getElementById('button-start');
buttonStart.addEventListener('click', start)
function start() {
    switchScreen('mainMenuScreen');
}

const buttonMainMenu = document.getElementById('main-menu');
buttonMainMenu.addEventListener('click', mainMenu)
function mainMenu() {
    switchScreen('mainMenuScreen');
}

const buttonStartGame = document.getElementById('start-game');
buttonStartGame.addEventListener('click', startGame)
function startGame() {
    switchScreen('gameplayScreen');
}

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
        'bear.glb',
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

    

  
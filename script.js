import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
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


function choiceColor() {
    switchScreen('choiceColorScreen');
}

const start = document.getElementsByClassName('.start')
start.addEventListener('click', start())
function start() {
    switchScreen('mainMenuScreen');
}

function mainMenu() {
    switchScreen('mainMenuScreen');
}

function startGame() {
    switchScreen('gameplayScreen');
}

function switchScreen(screenId) {
    document.getElementById(currentScreen).style.display = 'none';
    document.getElementById(screenId).style.display = 'block';
    currentScreen = screenId;
}


// Active color
document.addEventListener('DOMContentLoaded', function() {
    let colorBlocks = document.querySelectorAll('.colorBlock');
    let dynamicBlock = document.getElementById('dynamicBlock');

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
        dynamicBlock.style.backgroundColor = activeColor;
    }
});



// Scene
const scene = new THREE.Scene();

// Object
const loader = new GLTFLoader();

    loader.load(
        'bear.glb',
        (glb) => {
            console.log('success');
            console.log(glb);
            scene.add(glb.scene);
        },
    );

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const canvas = document.querySelector('.canvasColor');

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0xA3A3A3);

    const controls = new OrbitControls(camera, renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xEDEDED, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    scene.add(directionalLight);
    directionalLight.position.set(10, 11, 7);

    camera.position.z = 2

    function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }
    animate()
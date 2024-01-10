import { FiniteStateMachine, State } from './finiteStateMachine.js';
import { Viewport } from './viewport.js';
import { PlayerPreviewScene } from './playerPreviewScene.js';

let playerName = 'Bear';
let viewport = null;
let playerPreviewScene = null;

const color1Element = document.querySelector('.color1');
let colorBear = window.getComputedStyle(color1Element).getPropertyValue('background-color');

function rendererResize() {
    const divCanvasBear = document.getElementById("divCanvasBear");
    viewport.Resize(divCanvasBear.clientWidth, divCanvasBear.clientHeight);
    playerPreviewScene.UpdateCamera(divCanvasBear.clientWidth / divCanvasBear.clientHeight);
}

export class Launcher {
    constructor() {
        console.log('Launcher constructor');
        this._Init();
    }

    _Init() {
        console.log('Launcher init');
        this._FSM = new LauncherFSM();
        this._FSM.SetState('loginWin');

        const buttonLogin = document.getElementById('button-start');
        buttonLogin.addEventListener('click', (event) => { this._FSM.SetState('mainWin'); });

        const buttonWardrobe = document.getElementById('choice-color');
        buttonWardrobe.addEventListener('click', (event) => { this._FSM.SetState('wardrobeWin'); });

        const buttonHome = document.getElementById('main-menu');
        buttonHome.addEventListener('click', (event) => { this._FSM.SetState('mainWin'); });

        const buttonPlay = document.getElementById('start-game');
        buttonPlay.addEventListener('click', (event) => { this._FSM.SetState('gameWin'); });

        // Color Blocks Listener
        const colorBlocks = document.querySelectorAll('.colorBlock');
        colorBlocks.forEach(function (block) {
            block.addEventListener('click', function () {
                toggleActiveClass(block);
                changeDynamicBlockColor(block);
            });
        });

        function toggleActiveClass(clickedBlock) {
            colorBlocks.forEach(function (block) {
                block.classList.remove('active');
            });

            clickedBlock.classList.add('active');
        }

        function changeDynamicBlockColor(clickedBlock) {
            let activeColor = getComputedStyle(clickedBlock).backgroundColor;
            colorBear = activeColor;
            playerPreviewScene.UpdateBearColor(colorBear);
        }

        // Fullscreen init
        const buttonFullscreen = document.getElementById('fullscreen-button');
        const gameContainer = document.getElementById('game-container');
        const gameTitle = document.querySelector('h1');
        buttonFullscreen.addEventListener('click', () => {
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
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                gameTitle.classList.remove('large');
            }
        });

        const canvas = document.getElementById("canvasColor");
        viewport = new Viewport(canvas);

        playerPreviewScene = new PlayerPreviewScene(viewport.GetRenderer());

        window.addEventListener('resize', (e) => {
            rendererResize();
        });

        playerPreviewScene.Animate();
    }

    GetPlayerName() {
        return playerName;
    }
};

class LauncherFSM extends FiniteStateMachine {
    constructor() {
        super();
        this._Init();
    }

    _Init() {
        this._AddState('loginWin', LoginWinState);
        this._AddState('mainWin', MainWinState);
        this._AddState('wardrobeWin', WardrobeWinState);
        this._AddState('gameWin', GameWinState);
    }
};

class LoginWinState extends State {
    constructor(parent) {
        super(parent, 'loginWin');
    }

    Enter() {
        console.log('LoginWinState Enter()');
        document.getElementById('divCanvasBear').style.display = 'none';
        document.getElementById('registration').style.display = 'block';
    }

    Exit() {
        console.log('LoginWinState Exit()')
        playerName = document.getElementById("playerName").value;

        console.log(playerName);
        document.getElementById('registration').style.display = 'none';
    }

    Update() {
        console.log('LoginWinState Update()')
    }
};

class MainWinState extends State {
    constructor(parent) {
        super(parent, 'mainWin');
    }

    Enter() {
        console.log('MainWinState Enter()')
        document.getElementById('mainMenuScreen').style.display = 'block';
        document.getElementById('divCanvasBear').style.display = 'block';
        rendererResize();
        playerPreviewScene.UpdateBearColor(colorBear);
    }

    Exit() {
        console.log('MainWinState Exit()')
        document.getElementById('mainMenuScreen').style.display = 'none';
    }

    Update() {
        console.log('MainWinState Update()')
    }
};

class WardrobeWinState extends State {
    constructor(parent) {
        super(parent, 'wardrobeWin');
    }

    Enter() {
        console.log('WardrobeWinState Enter()')
        document.getElementById('choiceColorScreen').style.display = 'block';
        document.getElementById('divCanvasBear').style.display = 'block';
        rendererResize();
        playerPreviewScene.UpdateBearColor(colorBear);
    }

    Exit() {
        console.log('WardrobeWinState Exit()')
        document.getElementById('choiceColorScreen').style.display = 'none';
    }

    Update() {
        console.log('WardrobeWinState Update()')
    }
};

class GameWinState extends State {
    constructor(parent) {
        super(parent, 'gameWin');
    }

    Enter() {
        console.log('GameWinState Enter()')
        document.getElementById('gameplayScreen').style.display = 'block';
        document.getElementById('divCanvasBear').style.display = 'block';
        rendererResize();
        // TODO запуск игры
    }

    Exit() {
        console.log('GameWinState Exit()')
        document.getElementById('gameplayScreen').style.display = 'none';
    }

    Update() {
        console.log('GameWinState Update()')
        // TODO обновление состояния игры
    }
};


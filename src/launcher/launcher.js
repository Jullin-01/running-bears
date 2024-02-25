import { FiniteStateMachine, State } from '../common/finiteStateMachine.js';
import { Viewport } from '../common/viewport.js';
import { PlayerPreviewScene } from './playerPreviewScene.js';
import { GameScene } from '../game/gameScene.js';
import { Game } from '../game/game.js';

export class Launcher {
    constructor() {
        console.log('Launcher constructor');
        this._Init();
    }

    _Init() {
        console.log('Launcher init');

        this._prevUpdateTimestamp = 0;

        this._playerName = 'Bear';

        this._viewport = null;
        this._playerPreviewScene = null;
        this._gameScene = null;

        const color1Element = document.querySelector('.color1');
        this._colorBear = window.getComputedStyle(color1Element).getPropertyValue('background-color');

        this._FSM = new LauncherFSM(this);
        this._FSM.SetState('loginWin');

        const handlerButtonEvent = (buttonId, targetState) => {
            const button = document.getElementById(buttonId);
            button.addEventListener('click', () => {
                this._FSM.SetState(targetState);
            });
        };
        
        handlerButtonEvent('button-start', 'mainWin');
        handlerButtonEvent('choice-color', 'wardrobeWin');
        handlerButtonEvent('main-menu', 'mainWin');
        handlerButtonEvent('start-game', 'gameWin');

        // Color Blocks Listener
        const colorBlocks = document.querySelectorAll('.colorBlock');
        colorBlocks.forEach((block) => {
            block.addEventListener('click', () => {
                toggleActiveClass(block);
                let _func = changeDynamicBlockColor.bind(this);
                _func(block);
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
            this._colorBear = activeColor;
            this._playerPreviewScene.UpdateBearColor(this._colorBear);
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
        this._viewport = new Viewport(canvas);

        this._playerPreviewScene = new PlayerPreviewScene(this._viewport.GetRenderer());
        this._gameScene = new GameScene(this._viewport.GetRenderer());

        window.addEventListener('resize', (e) => {
            this.RendererResize();
        });

        this._Update(this._prevUpdateTimestamp);
    }

    _Update(timestamp) {
        const timeElapsed = timestamp - this._prevUpdateTimestamp;
        const timeElapsedSec = Math.min(1.0 / 30.0, timeElapsed * 0.001);

        //console.log(timeElapsedSec);

        this._FSM.Update(timeElapsedSec);

        requestAnimationFrame(this._Update.bind(this));

        this._prevUpdateTimestamp = timestamp;
    }

    RendererResize() {
        const divCanvasBear = document.getElementById("divCanvasBear");
        this._viewport.Resize(divCanvasBear.clientWidth, divCanvasBear.clientHeight);
        this._playerPreviewScene.UpdateCamera(divCanvasBear.clientWidth / divCanvasBear.clientHeight);
        this._gameScene.UpdateCamera(divCanvasBear.clientWidth / divCanvasBear.clientHeight);
    }

    GetPlayerName() {
        return this._playerName;
    }
};

class LauncherFSM extends FiniteStateMachine {
    constructor(launcher) {
        super();
        this._launcher = launcher;
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
        this._parent._launcher._playerName = document.getElementById("playerName").value;

        console.log(this._parent._launcher._playerName);
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
        this._parent._launcher.RendererResize();
        this._parent._launcher._playerPreviewScene.UpdateBearColor(this._parent._launcher._colorBear);
        this._parent._launcher._playerPreviewScene.StartRendering();
    }

    Exit() {
        console.log('MainWinState Exit()')
        document.getElementById('mainMenuScreen').style.display = 'none';
        this._parent._launcher._playerPreviewScene.StopRendering();
    }

    Update() {
        console.log('MainWinState Update()')
        this._parent._launcher._playerPreviewScene.Animate();
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
        this._parent._launcher.RendererResize();
        this._parent._launcher._playerPreviewScene.UpdateBearColor(this._parent._launcher._colorBear);
        this._parent._launcher._playerPreviewScene.StartRendering();
    }

    Exit() {
        console.log('WardrobeWinState Exit()')
        document.getElementById('choiceColorScreen').style.display = 'none';
        this._parent._launcher._playerPreviewScene.StopRendering();
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
        document.getElementById('divCanvasBear').classList.toggle('BearPreviewAreaGame');

        this._parent._launcher.RendererResize();
        this._parent._launcher._gameScene.UpdateBearColor(this._parent._launcher._colorBear);
        this._parent._launcher._gameScene.StartRendering();
        // TODO запуск игры
        this._game = new Game();
    }

    Exit() {
        console.log('GameWinState Exit()')
        document.getElementById('gameplayScreen').style.display = 'none';
        this._parent._launcher._gameScene.StopRendering();
        document.getElementById('divCanvasBear').classList.toggle('BearPreviewAreaGame');
    }

    Update() {
        console.log('GameWinState Update()')

        this._parent._launcher._gameScene.Animate();

        // TODO обновление состояния игры
        this._game.Update(null, null);
    }
};


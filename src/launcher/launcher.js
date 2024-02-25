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

        this._playerName = 'Bear';
        this._colorBear = null;
        this._prevUpdateTimestamp = 0;

        this._NavButtonsInit();
        this._FullscreenButtonInit();
        this._ColorBlocksButtonsInit();

        this._FSM = new LauncherFSM(this);
        this._FSM.SetState('loginWin');

        const canvas = document.getElementById("canvasColor");
        this._viewport = new Viewport(canvas);
        this._playerPreviewScene = new PlayerPreviewScene(this._viewport.GetRenderer());
        this._gameScene = new GameScene(this._viewport.GetRenderer());

        window.addEventListener('resize', (e) => {
            this.RendererResize();
        });

        this._Update(this._prevUpdateTimestamp);
    }

    _NavButtonsInit() {
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
    }

    _FullscreenButtonInit() {
        const buttonFullscreen = document.getElementById('fullscreen-button');
        const gameContainer = document.getElementById('game-container');
        const gameTitle = document.querySelector('h1'); // TODO: remove this

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
    }

    _ColorBlocksButtonsInit() {
        const color1Element = document.querySelector('.color1');
        this._colorBear = window.getComputedStyle(color1Element).getPropertyValue('background-color');

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
            this._playerPreviewScene?.UpdateBearColor(this._colorBear);
        }
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
        this.mapWinNameToDivName = new Map([
            ['loginWin', 'registration'],
            ['mainWin', 'mainMenuScreen'],
            ['wardrobeWin', 'choiceColorScreen'],
            ['gameWin', 'gameplayScreen']
        ]);

        this._AddState('loginWin', LoginWinState);
        this._AddState('mainWin', MainWinState);
        this._AddState('wardrobeWin', WardrobeWinState);
        this._AddState('gameWin', GameWinState);
    }

    ShowWin(winName) {
        const divName = this.mapWinNameToDivName.get(winName);
        this.ShowDiv(divName);
    }

    HideWin(winName) {
        const divName = this.mapWinNameToDivName.get(winName);
        this.HideDiv(divName);
    }

    ShowDiv(divName) {
        document.getElementById(divName).style.display = 'block';
    }

    HideDiv(divName) {
        document.getElementById(divName).style.display = 'none';
    }
};

class LoginWinState extends State {
    constructor(parent) {
        super(parent, 'loginWin');
    }

    Enter() {
        console.log('LoginWinState Enter()');
        this._parent.HideDiv('divCanvasBear');
        this._parent.ShowWin(this._name);
    }

    Exit() {
        console.log('LoginWinState Exit()')

        this._parent._launcher._playerName = document.getElementById("playerName").value;
        console.log(this._parent._launcher._playerName);

        this._parent.HideWin(this._name);
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
        this._parent.ShowDiv('divCanvasBear');
        this._parent.ShowWin(this._name);

        this._parent._launcher.RendererResize();
        this._parent._launcher._playerPreviewScene.UpdateBearColor(this._parent._launcher._colorBear);
        this._parent._launcher._playerPreviewScene.StartRendering();
    }

    Exit() {
        console.log('MainWinState Exit()')
        this._parent.HideWin(this._name);

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
        this._parent.ShowDiv('divCanvasBear');
        this._parent.ShowWin(this._name);

        this._parent._launcher.RendererResize();
        this._parent._launcher._playerPreviewScene.UpdateBearColor(this._parent._launcher._colorBear);
        this._parent._launcher._playerPreviewScene.StartRendering();
    }

    Exit() {
        console.log('WardrobeWinState Exit()')
        this._parent.HideWin(this._name);

        this._parent._launcher._playerPreviewScene.StopRendering();
    }

    Update() {
        console.log('WardrobeWinState Update()')
        this._parent._launcher._playerPreviewScene.Animate();
    }
};

class GameWinState extends State {
    constructor(parent) {
        super(parent, 'gameWin');
    }

    Enter() {
        console.log('GameWinState Enter()')
        this._parent.ShowDiv('divCanvasBear');
        this._parent.ShowWin(this._name);

        document.getElementById('divCanvasBear').classList.toggle('BearPreviewAreaGame');

        this._parent._launcher.RendererResize();
        this._parent._launcher._gameScene.UpdateBearColor(this._parent._launcher._colorBear);
        this._parent._launcher._gameScene.StartRendering();
        // TODO запуск игры
        this._game = new Game();
    }

    Exit() {
        console.log('GameWinState Exit()')
        this._parent.HideWin(this._name);

        this._parent._launcher._gameScene.StopRendering();

        document.getElementById('divCanvasBear').classList.toggle('BearPreviewAreaGame');
    }


    Update(timeElapsedSec) {
        console.log('GameWinState Update()')

        this._parent._launcher._gameScene.Animate();

        // TODO обновление состояния игры
        this._game.Update(timeElapsedSec);
    }
};


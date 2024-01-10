import * as THREE from 'three';

export class Viewport {
    constructor(canvas) {
        console.log('Viewport constructor');
        this._canvas = canvas;
        this._Init();
    }

    _Init() {
        this._threejs = new THREE.WebGLRenderer({ canvas: this._canvas });
    }

    Resize(width, height) {
        this._canvas.width = width;
        this._canvas.height = height;
        this._threejs.setSize(this._canvas.width, this._canvas.height);
        this._threejs.setPixelRatio = this._canvas.width / this._canvas.height;
    }

    GetRenderer() {
        return this._threejs;
    }
};
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class PlayerPreviewScene {
    constructor(renderer) {
        console.log('PlayerPreviewScene constructor');
        this._Init();
        this._renderer = renderer;
    }

    _Init() {
        this._renderer.setClearColor(0xA3A3A3, 0);
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(
            75,
            this._renderer.getSize()[0] / this._renderer.getSize()[1],
            0.1,
            1000
        )
        this._camera.position.z = 1;
        this._scene.add(this._camera);

        this._ambientLight = new THREE.AmbientLight(0xEDEDED, 0.8);
        this._scene.add(this._ambientLight);
    
        this._directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        this._directionalLight.position.set(10, 11, 7);
        this._scene.add(this._directionalLight);

        this._controls = new OrbitControls( this._camera, this._renderer.domElement );

        this._loader = new GLTFLoader();
        this._bearModel = null;
        this._mixer = null;

        this._loader.load(
            './static/bear.glb',
            (glb) => {
                this._bearModel = glb.scene;
                this._scene.add(glb.scene);
                this._mixer = new THREE.AnimationMixer(glb.scene);
                this._mixer.clipAction(THREE.AnimationClip.findByName(glb.animations, 'happy-idle')).play();
            },
        );

        this._clock = new THREE.Clock();

    }

    UpdateCamera(aspect) {
        this._camera.aspect = aspect;
        this._camera.updateProjectionMatrix();
    }

    UpdateBearColor(color) {
        this._bearModel.traverse(function (object) {
            if (object.material && object.material.name == 'Mat.base') {
                object.material.color.setStyle(color);
            }
        })
    }

    Animate() {
        if (this._mixer) {
            this._mixer.update(this._clock.getDelta());
        }

        requestAnimationFrame(this.Animate)
        this._renderer.render(this._scene, this._camera)
    }
}
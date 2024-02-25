import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class PlayerPreviewScene {
    constructor(renderer) {
        console.log('PlayerPreviewScene constructor');
        this._renderer = renderer;
        this._is_rendering_enabled = false;
        this._Init();
    }

    _Init() {
        const renderer_area = new THREE.Vector2();
        this._renderer.getSize(renderer_area);

        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(
            75,
            renderer_area.width / renderer_area.height,
            0.1,
            1000
        )
        this._camera.position.set(-0.2, 0.5, 0.8);
        this._scene.add(this._camera);

        this._podiumTopGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 8);
        this._podiumTopMaterial = new THREE.MeshBasicMaterial( {color: 0xdee0e3});
        this._podiumTop = new THREE.Mesh(this._podiumTopGeometry, this._podiumTopMaterial);
        this._podiumTop.position.set(0, -0.03, 0);
        this._scene.add(this._podiumTop);

        this._podiumBottomGeometry = new THREE.CylinderGeometry( 0.35, 0.35, 0.075, 8);
        this._podiumBottomMaterial = new THREE.MeshBasicMaterial({ color: 0x122B66 });
        this._podiumBottom = new THREE.Mesh(this._podiumBottomGeometry, this._podiumBottomMaterial);
        this._podiumBottom.position.set(0, -0.095, 0);
        this._scene.add(this._podiumBottom);

        this._ambientLight = new THREE.AmbientLight(0xEDEDED, 0.8);
        this._scene.add(this._ambientLight);

        this._directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        this._directionalLight.position.set(10, 11, 7);
        this._scene.add(this._directionalLight);

        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.enabled = false;

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

    StartRendering() {
        this._renderer.setClearColor(0xA3A3A3, 0);
        this._is_rendering_enabled = true;
        this._Animate();
    }

    StopRendering() {
        this._is_rendering_enabled = false;
    }

    _Animate() {
        if (this._is_rendering_enabled) {
            if (this._mixer) {
                this._mixer.update(this._clock.getDelta());
            }

            this._renderer.render(this._scene, this._camera)
        }
    }
}
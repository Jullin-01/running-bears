import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class GameScene {
    constructor(renderer) {
        console.log('GameScene constructor');
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
        this._camera.position.set(-1, 0.22, 0.74);
        this._scene.add(this._camera);

        this._skyboxMaterialArray = [];
        this._skyboxTextureFront = new THREE.TextureLoader().load('/static/skybox/front.png');
        this._skyboxTextureBack = new THREE.TextureLoader().load('/static/skybox/back.png');
        this._skyboxTextureUp = new THREE.TextureLoader().load('/static/skybox/up.png');
        this._skyboxTextureDown = new THREE.TextureLoader().load('/static/skybox/down.png');
        this._skyboxTextureLeft = new THREE.TextureLoader().load('/static/skybox/left.png');
        this._skyboxTextureRight = new THREE.TextureLoader().load('/static/skybox/right.png');

        this._skyboxMaterialArray.push(new THREE.MeshBasicMaterial({map: this._skyboxTextureFront}));
        this._skyboxMaterialArray.push(new THREE.MeshBasicMaterial({map: this._skyboxTextureBack}));
        this._skyboxMaterialArray.push(new THREE.MeshBasicMaterial({map: this._skyboxTextureUp}));
        this._skyboxMaterialArray.push(new THREE.MeshBasicMaterial({map: this._skyboxTextureDown}));
        this._skyboxMaterialArray.push(new THREE.MeshBasicMaterial({map: this._skyboxTextureLeft}));
        this._skyboxMaterialArray.push(new THREE.MeshBasicMaterial({map: this._skyboxTextureRight}));

        for(let i=0; i<6; i++)
            this._skyboxMaterialArray[i].side = THREE.BackSide;

        this._skyboxGeometry = new THREE.BoxGeometry(50, 50, 50);
        this._skybox = new THREE.Mesh( this._skyboxGeometry, this._skyboxMaterialArray);
        this._scene.add(this._skybox);


        this._ambientLight = new THREE.AmbientLight(0xEDEDED, 0.8);
        this._scene.add(this._ambientLight);

        this._directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        this._directionalLight.position.set(10, 11, 7);
        this._scene.add(this._directionalLight);

        this._controls = new OrbitControls(this._camera, this._renderer.domElement);

        window.addEventListener('click', (e) => {
            console.log(this._camera.position);
        });

        this._loader = new GLTFLoader();
        this._bearModel = null;
        this._mixer = null;

        this._loader.load(
            './static/bear.glb',
            (glb) => {
                this._bearModel = glb.scene;
                this._scene.add(glb.scene);
                this._mixer = new THREE.AnimationMixer(glb.scene);
                this._mixer.clipAction(THREE.AnimationClip.findByName(glb.animations, 'falling')).play();
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
//        this._renderer.setClearColor(0xA3A3A3, 1);
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

            requestAnimationFrame(this._Animate.bind(this))
            this._renderer.render(this._scene, this._camera)
        }
    }
}
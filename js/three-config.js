import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ThreeScene {
    constructor(canvas) {
        console.log('ThreeScene constructor started');

        if (!canvas) {
            throw new Error('Canvas is required for ThreeScene');
        }

        // Scene setup
        this.scene = new THREE.Scene();
        console.log('Scene created');

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        console.log('Camera created');

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        console.log('Renderer created');

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        console.log('Lights added');

        // Load the model
        const loader = new GLTFLoader();
        loader.load(
            './images/scene.gltf',
            (gltf) => {
                console.log('Model loaded successfully');
                this.model = gltf.scene;
                this.model.scale.set(1.5, 1.5, 1.5);
                this.scene.add(this.model);
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading model:', error);
            }
        );

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Start animation
        this.animate();
        console.log('Animation started');
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        if (this.model) {
            this.model.rotation.y += 0.005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(isDark) {
        this.scene.background = isDark ? new THREE.Color(0x000000) : null;
    }
}

export { ThreeScene }; 
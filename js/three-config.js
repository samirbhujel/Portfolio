class ThreeScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
            antialias: true,
            alpha: true  // Make background transparent
        });

        // Basic setup
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.position.setZ(15);

        // Set initial background to transparent
        this.scene.background = new THREE.Color(0xffffff);
        this.scene.fog = new THREE.Fog(0xffffff, 15, 50); // Increased fog density

        // Add lights
        this.setupLights();
        
        // Add background elements
        this.addBackgroundElements();
        
        // Setup mouse movement
        this.setupMouseMove();
        
        // Start animation
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(this.ambientLight);

        this.pointLight = new THREE.PointLight(0x4488ff, 0.6);
        this.pointLight.position.set(5, 5, 5);
        this.scene.add(this.pointLight);
    }

    addBackgroundElements() {
        // Add soccer ball with better materials
        const soccerBallGeometry = new THREE.SphereGeometry(2, 32, 32);
        const soccerBallMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,  // White base color
            roughness: 0.2,   // More glossy
            metalness: 0.0,   // No metallic effect
            clearcoat: 0.3,   // Slight clearcoat
            clearcoatRoughness: 0.2,
            transparent: true,
            opacity: 0.9
        });
        
        this.soccerBall = new THREE.Mesh(soccerBallGeometry, soccerBallMaterial);
        
        // Add black pentagon patterns
        const pentagonGeometry = new THREE.IcosahedronGeometry(2.01, 1); // Slightly larger radius
        const pentagonMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x000000,  // Black color
            roughness: 0.3,
            metalness: 0.0,
            side: THREE.BackSide,  // Render on inside
            transparent: true,
            opacity: 0.8
        });
        
        this.soccerPattern = new THREE.Mesh(pentagonGeometry, pentagonMaterial);
        this.soccerBall.add(this.soccerPattern);  // Add pattern as child of ball
        
        // Position the ball
        this.soccerBall.position.set(0, 0, -10);
        this.soccerBall.userData = {
            originalY: this.soccerBall.position.y,
            originalX: this.soccerBall.position.x,
            originalZ: this.soccerBall.position.z,
            speed: 0.001,
            rotationSpeed: 0.005,
            amplitude: 2
        };
        
        // Add extra lighting for the ball
        const ballLight = new THREE.PointLight(0xffffff, 0.5);
        ballLight.position.set(5, 5, 0);
        this.soccerBall.add(ballLight);
        
        this.scene.add(this.soccerBall);

        // Add more floating shapes with varied sizes
        const geometries = [
            new THREE.IcosahedronGeometry(1.5),
            new THREE.TorusGeometry(1.2, 0.3, 16, 100),
            new THREE.OctahedronGeometry(1.3),
            new THREE.TetrahedronGeometry(1.0),  // Added new shape
            new THREE.SphereGeometry(0.8, 32, 32)  // Added new shape
        ];

        this.shapes = geometries.map((geometry, i) => {
            const material = new THREE.MeshPhysicalMaterial({
                color: 0x4488ff,
                roughness: 0.1,  // More glossy
                metalness: 0.2,  // Slight metallic effect
                transmission: 0.8,  // More transparent
                thickness: 0.5,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 0.5  // More visible
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            // Spread shapes more evenly in space
            const radius = 15;
            const theta = (i / geometries.length) * Math.PI * 2;
            mesh.position.x = radius * Math.cos(theta);
            mesh.position.y = (Math.random() - 0.5) * 10;
            mesh.position.z = -15 + radius * Math.sin(theta);
            
            mesh.userData = {
                originalY: mesh.position.y,
                originalX: mesh.position.x,
                originalZ: mesh.position.z,
                speed: 0.001 + (Math.random() * 0.003),
                amplitude: 1 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2
            };
            
            this.scene.add(mesh);
            return mesh;
        });

        // Enhanced particle system
        const particleCount = 2000;  // More particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);

        for(let i = 0; i < particleCount * 3; i += 3) {
            const radius = Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[i + 2] = radius * Math.cos(phi) - 25;
            
            particleSizes[i/3] = Math.random() * 0.05 + 0.02;  // Varied sizes
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x4488ff,
            size: 0.05,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true  // Particles change size with distance
        });

        this.particles = new THREE.Points(particlesGeometry, particleMaterial);
        this.scene.add(this.particles);
    }

    setupMouseMove() {
        this.mouse = new THREE.Vector2();
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Animate soccer ball
        if (this.soccerBall) {
            // Floating motion
            this.soccerBall.position.y = this.soccerBall.userData.originalY + 
                Math.sin(time * this.soccerBall.userData.speed) * this.soccerBall.userData.amplitude;
            
            // Constant rotation
            this.soccerBall.rotation.x += this.soccerBall.userData.rotationSpeed;
            this.soccerBall.rotation.y += this.soccerBall.userData.rotationSpeed * 0.7;

            // Mouse interaction
            const mouseX = this.mouse.x * 5;
            const mouseY = this.mouse.y * 5;
            
            // Make ball follow mouse with smooth damping
            this.soccerBall.position.x += (mouseX - this.soccerBall.position.x) * 0.02;
            const targetY = -mouseY + this.soccerBall.userData.originalY;
            this.soccerBall.position.y += (targetY - this.soccerBall.position.y) * 0.02;
        }

        // Enhanced shape animation
        this.shapes.forEach((shape, i) => {
            // Complex rotation
            shape.rotation.x += 0.002;
            shape.rotation.y += 0.003;
            shape.rotation.z += 0.001;
            
            // Orbital floating motion
            const userData = shape.userData;
            shape.position.y = userData.originalY + Math.sin(time * userData.speed + userData.phase) * userData.amplitude;
            shape.position.x = userData.originalX + Math.cos(time * userData.speed + userData.phase) * userData.amplitude;
            shape.position.z = userData.originalZ + Math.sin(time * userData.speed * 0.5) * (userData.amplitude * 0.5);

            // Enhanced mouse interaction
            const mouseX = this.mouse.x * 5;
            const mouseY = this.mouse.y * 5;
            
            shape.rotation.x += (mouseY - shape.rotation.x) * 0.05;
            shape.rotation.y += (mouseX - shape.rotation.y) * 0.05;
            
            // Attract shapes towards mouse
            shape.position.x += (mouseX - shape.position.x) * 0.02;
            shape.position.y += (-mouseY - shape.position.y) * 0.02;
        });

        // Enhanced particle animation
        if (this.particles) {
            this.particles.rotation.y += 0.0002;
            this.particles.rotation.x += 0.0001;
            
            // Make particles follow mouse slightly
            const mouseX = this.mouse.x * 2;
            const mouseY = this.mouse.y * 2;
            this.particles.position.x += (mouseX - this.particles.position.x) * 0.05;
            this.particles.position.y += (-mouseY - this.particles.position.y) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }

    updateTheme(isDark) {
        // Update scene background
        const bgColor = isDark ? 0x0a0a0a : 0xffffff;
        this.scene.background = new THREE.Color(bgColor);
        this.scene.fog.color = new THREE.Color(bgColor);

        // Update shapes with more visible colors
        const shapeColor = isDark ? 0x00ff88 : 0x4488ff;
        this.shapes.forEach(shape => {
            shape.material.color.setHex(shapeColor);
            shape.material.opacity = isDark ? 0.5 : 0.4;
        });

        // Update particles
        if (this.particles) {
            this.particles.material.color.setHex(shapeColor);
            this.particles.material.opacity = isDark ? 0.4 : 0.3;
        }

        // Update lights with more intensity
        this.pointLight.color.setHex(shapeColor);
        this.pointLight.intensity = isDark ? 0.8 : 0.6;
        this.ambientLight.intensity = isDark ? 0.4 : 0.5;

        // Update soccer ball materials for theme
        if (this.soccerBall) {
            this.soccerBall.material.color = new THREE.Color(isDark ? 0xeeeeee : 0xffffff);
            if (this.soccerPattern) {
                this.soccerPattern.material.opacity = isDark ? 0.9 : 0.8;
            }
        }
    }
} 
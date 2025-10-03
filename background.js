/**
 * The code is adapted from the Decorative WebGL Backgrounds demo by Louis Hoebregts.
 * Link: https://github.com/Mamboleoo/DecorativeBackgrounds
 */

// Initialize canvas and renderer
const canvas = document.querySelector('#scene');
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true // Allows for a transparent background if needed
});
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0xffffff, 1); // Set background to white

// Initialize scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
camera.position.set(0, 0, 80);

// Load the dot texture from the original GitHub repository
const loader = new THREE.TextureLoader();
loader.crossOrigin = "Anonymous";
const dotTexture = loader.load('https://raw.githubusercontent.com/Mamboleoo/DecorativeBackgrounds/master/img/dotTexture.png');

// Create the geometry for the sphere of dots
const radius = 50;
const sphereGeom = new THREE.IcosahedronGeometry(radius, 5);
const bufferDotsGeom = new THREE.BufferGeometry();
const positions = new Float32Array(sphereGeom.vertices.length * 3);

// Animate each dot
sphereGeom.vertices.forEach((vector, i) => {
    vector.toArray(positions, i * 3);
    animateDot(i, vector);
});

function animateDot(index, vector) {
    gsap.to(vector, {
        duration: 4,
        x: 0,
        z: 0,
        ease: "back.out",
        delay: Math.abs(vector.y / radius) * 2,
        repeat: -1,
        yoyo: true,
        yoyoEase: "back.out",
        onUpdate: function () {
            updateDot(index, this.targets()[0]);
        }
    });
}

function updateDot(index, vector) {
    positions[index * 3] = vector.x;
    positions[index * 3 + 2] = vector.z;
}

// Set up the shader material for the points
const attributePositions = new THREE.BufferAttribute(positions, 3);
bufferDotsGeom.setAttribute('position', attributePositions);
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        texture: {
            value: dotTexture
        }
    },
    vertexShader: document.getElementById("wrapVertexShader").textContent,
    fragmentShader: document.getElementById("wrapFragmentShader").textContent,
    transparent: true
});

const dots = new THREE.Points(bufferDotsGeom, shaderMaterial);
scene.add(dots);

// Render loop
function render() {
    dots.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}

// Mouse move interaction
const mouse = new THREE.Vector2(0.8, 0.5);
function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) - 0.5;
    mouse.y = (e.clientY / window.innerHeight) - 0.5;
    gsap.to(dots.rotation, {
        duration: 4,
        x: (mouse.y * Math.PI * 0.5),
        z: (mouse.x * Math.PI * 0.2),
        ease: "power1.out"
    });
}

// Handle window resizing
function onResize() {
    canvas.style.width = '';
    canvas.style.height = '';
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Event Listeners
gsap.ticker.add(render);
window.addEventListener("mousemove", onMouseMove);
let resizeTm;
window.addEventListener("resize", () => {
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 200);
});
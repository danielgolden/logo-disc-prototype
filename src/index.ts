import * as THREE from "three";
import "./style.css";
import { Pane } from "tweakpane";
import { random } from "./utils";
import gsap, { Power1 } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import lightspeedLogo from "./assets/lightspeed.jpg";
import shopifyLogo from "./assets/shopify.jpg";
import xeroLogo from "./assets/xero-logo.jpg";
import mindfeelLogo from "./assets/mindfeel-logo.jpg";
import docusignLogo from "./assets/docusign-logo.jpg";
import nbcLogo from "./assets/nbc-logo.jpg";

interface LogoObject {
  name: string;
  texture: THREE.Texture;
  material: THREE.MeshStandardMaterial;
  geometry: THREE.SphereGeometry;
  mesh: THREE.Mesh;
}

/*
  Textures  
*/
const textureLoader = new THREE.TextureLoader();
const lightspeedTexture = textureLoader.load(lightspeedLogo);
const shopifyTexture = textureLoader.load(shopifyLogo);
const xeroTexture = textureLoader.load(xeroLogo);
const mindfeelTexture = textureLoader.load(mindfeelLogo);
const docusignTexture = textureLoader.load(docusignLogo);
const nbcTexture = textureLoader.load(nbcLogo);

/*
  Plane
*/
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshStandardMaterial();
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
const planeOpacity = 0.31;
plane.receiveShadow = true;
plane.position.z = -1;
plane.material.transparent = true;
plane.material.opacity = planeOpacity; // Controls shadow opacity
plane.material.color.set("#f6f9fc");
plane.material.metalness = 0.01;
plane.material.roughness = 0.6;
plane.position.set(1, 0.5);

/*
  Ellipsoids (Logo discs)
*/
class LogoObject {
  constructor(texture: THREE.Texture, name: string) {
    // Geometry
    const geometry = new THREE.SphereGeometry(0.5, 40, 40);
    geometry.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, 0.2));
    this.geometry = geometry;
    this.name = name;

    // Texture
    this.texture = texture;
    this.texture.offset.x = 0;
    this.texture.repeat.x = 2;
    this.texture.repeat.y = 1;

    // Material
    this.material = new THREE.MeshStandardMaterial();
    this.material.metalness = 0.01;
    this.material.roughness = 0.6;
    this.material.map = this.texture;

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
  }
}

// Textures
const lightspeedDisc = new LogoObject(lightspeedTexture, "lightspeed");
const shopifyDisc = new LogoObject(shopifyTexture, "shopify");
const xeroDisc = new LogoObject(xeroTexture, "xero");
const mindfeelDisc = new LogoObject(mindfeelTexture, "mindfeel");
const docusignDisc = new LogoObject(docusignTexture, "docusign");
const nbcDisc = new LogoObject(nbcTexture, "nbc");

const logoDiscs = [
  docusignDisc,
  shopifyDisc,
  nbcDisc,
  xeroDisc,
  lightspeedDisc,
  mindfeelDisc
];

// Logo Disc Group
const logoDiscGroup = new THREE.Group();
logoDiscs.forEach((logoDisc) => {
  logoDiscGroup.add(logoDisc.mesh);
});

logoDiscGroup.position.set(1, 0.5);

// Positioning meshes
const positionDiscs = () => {
  xeroDisc.mesh.position.set(0, 0, 0);
  docusignDisc.mesh.position.set(-0.6, 1.25, 0);
  lightspeedDisc.mesh.position.set(0.9, 1.075, 0);
  mindfeelDisc.mesh.position.set(1, -1, 0);
  nbcDisc.mesh.position.set(-1.1, -0.85, 0);
  shopifyDisc.mesh.position.set(-1.6, 0.35, 0);
};

positionDiscs();

// Canvas
const $canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#f6f9fc");
scene.add(logoDiscGroup);
scene.add(plane);

/*
  Lights
*/
const ambientLight = new THREE.AmbientLight("white", 0.75);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 0.25);
directionalLight.castShadow = true;
directionalLight.position.set(0, 0, 2);
directionalLight.shadow.mapSize.width = 1024 * 3;
directionalLight.shadow.mapSize.height = 1024 * 3;

directionalLight.shadow.camera.top = 2.5;
directionalLight.shadow.camera.right = 2.5;
directionalLight.shadow.camera.bottom = -2.5;
directionalLight.shadow.camera.left = -2.5;

directionalLight.shadow.camera.near = 1.5;
directionalLight.shadow.camera.far = 5;
// const direcitonalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);

directionalLight.shadow.radius = 50;

scene.add(directionalLight);
// scene.add(direcitonalLightCameraHelper);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(
  30,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 12;
camera.position.x = 0;
camera.position.y = 0;
scene.add(camera);

const controls = new OrbitControls(camera, $canvas as HTMLElement);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: $canvas as HTMLElement,
  antialias: true,
  alpha: true
});

renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const animationConfig = {
  maxPositionDistance: 0.0375,
  maxDepthDistance: 0.175,
  maxRotateDistance: 0.25,
  translateDuration: 3,
  rotateDuration: 4,
  keyframeCount: 5
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/*
  Animation
*/

const logoDiscAnimations: GSAPTimeline[] = [];

// One time animations
const fadeInAnimation = () => {
  const fadeIn = gsap.timeline({ delay: 0.5 });
  logoDiscs.forEach((logoDisc, index) => {
    const fadeTiming = index * 0.05 - 0.05;
    const scaleFrom = 0.975;
    logoDisc.material.opacity = 0;
    logoDisc.material.transparent = true;
    logoDisc.mesh.scale.set(scaleFrom, scaleFrom, scaleFrom);
    // logoDisc.mesh.rotation.y = .25;

    fadeIn.to(
      logoDisc.material,
      { opacity: 1, duration: 1.5, ease: Power1.easeOut },
      fadeTiming
    );
    fadeIn.to(
      logoDisc.mesh.scale,
      { x: 1, y: 1, z: 1, duration: 1.5, ease: Power1.easeOut },
      fadeTiming
    );
    // fadeIn.to(
    //   logoDisc.mesh.rotation,
    //   { y: 0, x: 0, z: 0, duration: 1, ease: Power1.easeOut },
    //   fadeTiming
    // );
  });
};

const perpetualAnimations = () => {
  // Perpetually repeating animations
  logoDiscs.forEach((logoDisc) => {
    const subtleShift = gsap.timeline({ repeat: Infinity, yoyo: true });
    const subtleRotate = gsap.timeline({ repeat: Infinity, yoyo: true });

    logoDiscAnimations.push(...[subtleShift, subtleRotate]);

    // For tweakpane. So the logo position always resets to it's home
    // when animation values are tweaked.
    positionDiscs();

    const subtleShiftKeyframe = () => {
      return {
        x: random(
          -animationConfig.maxPositionDistance + logoDisc.mesh.position.x,
          animationConfig.maxPositionDistance + logoDisc.mesh.position.x
        ),
        y: random(
          -animationConfig.maxPositionDistance + logoDisc.mesh.position.y,
          animationConfig.maxPositionDistance + logoDisc.mesh.position.y
        ),
        z: random(
          -animationConfig.maxDepthDistance,
          animationConfig.maxDepthDistance
        ),
        duration: animationConfig.translateDuration,
        ease: Power1.easeInOut
      };
    };

    const subtleRotateKeyframe = () => {
      return {
        x: random(
          -animationConfig.maxRotateDistance,
          animationConfig.maxRotateDistance
        ),
        y: random(
          -animationConfig.maxRotateDistance,
          animationConfig.maxRotateDistance
        ),
        duration: animationConfig.rotateDuration,
        ease: Power1.easeInOut
      };
    };

    // Create timeline for each animation
    for (let i = 0; i < animationConfig.keyframeCount; i++) {
      subtleShift.to(logoDisc.mesh.position, subtleShiftKeyframe());
      subtleRotate.to(logoDisc.mesh.rotation, subtleRotateKeyframe());
    }

    // Set each timeline to a random point
    const subtleShiftTimelineLength =
      animationConfig.translateDuration * animationConfig.keyframeCount;
    const subtleRotateTimelineLength =
      animationConfig.translateDuration * animationConfig.keyframeCount;

    subtleShift.seek(random(0, subtleShiftTimelineLength));
    subtleRotate.seek(random(0, subtleRotateTimelineLength));
  });
};

const animatePlane = () => {
  const fadeInPlane = gsap.timeline({ delay: 0.75 });
  plane.material.opacity = 0;
  plane.material.transparent = true;
  fadeInPlane.to(plane.material, { opacity: planeOpacity, duration: 1.5 });
};

const restartLogoAnimation = () => {
  logoDiscAnimations.forEach((timeline) => {
    timeline.kill();
  });
  perpetualAnimations();
};

fadeInAnimation();
perpetualAnimations();
animatePlane();

/*
  Controls
*/
const pane = new Pane();

const animationControls = pane.addFolder({
  title: "Animation",
  expanded: true
});

animationControls
  .addInput(animationConfig, "maxPositionDistance", {
    min: 0,
    max: 0.5,
    step: 0.01,
    label: "Translate"
  })
  .on("change", restartLogoAnimation);
animationControls
  .addInput(animationConfig, "maxRotateDistance", {
    min: 0,
    max: 3,
    step: 0.05,
    label: "Rotate"
  })
  .on("change", restartLogoAnimation);
animationControls
  .addInput(animationConfig, "maxDepthDistance", {
    min: 0,
    max: 0.5,
    step: 0.01,
    label: "Depth"
  })
  .on("change", restartLogoAnimation);
animationControls.addSeparator();
animationControls
  .addInput(animationConfig, "translateDuration", {
    min: 1,
    max: 10,
    step: 0.5,
    label: "Translate duration"
  })
  .on("change", restartLogoAnimation);
animationControls
  .addInput(animationConfig, "rotateDuration", {
    min: 1,
    max: 10,
    step: 0.5,
    label: "Rotate duration"
  })
  .on("change", restartLogoAnimation);

const lightingControls = pane.addFolder({
  title: "Light intensity",
  expanded: false
});

lightingControls.addInput(ambientLight, "intensity", {
  min: 0,
  max: 1,
  step: 0.05,
  label: "Ambient",
  presetKey: "ambientIntensity"
});
lightingControls.addInput(directionalLight, "intensity", {
  min: 0,
  max: 1,
  step: 0.05,
  label: "Directional",
  presetKey: "directionalIntensity"
});

const resetButton = pane.addButton({
  title: "Reset all"
});

const preset = {
  maxPositionDistance: 0.0375,
  maxRotateDistance: 0.25,
  maxDepthDistance: 0.175,
  translateDuration: 3,
  rotateDuration: 4,
  ambientIntensity: 0.75,
  directionalIntensity: 0.25
};

resetButton.on("click", () => {
  pane.importPreset(preset);
});

/*
  Render that junk
*/
const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

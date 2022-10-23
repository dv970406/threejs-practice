import * as THREE from "three";
import gsap from "gsap";

// 라이브러리를 이용한 애니메이션(GreenSock)

const example = () => {
  // 1. Renderer 세팅
  const THREE_CANVAS = document.getElementById("three-canvas");

  const renderer = new THREE.WebGLRenderer({
    canvas: THREE_CANVAS,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // 2. Scene
  const scene = new THREE.Scene();
  // (color, near, far)
  scene.fog = new THREE.Fog("black", 3, 7);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 2;
  camera.position.z = 5;

  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.y = 3;
  light.position.z = 5;
  scene.add(light);

  // 3. Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    // color : '#ff0000',
    color: 0xff0000,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 4. 그리기
  const draw = () => {
    renderer.render(scene, camera);

    //window.requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw);
  };

  gsap.to(mesh.position, {
    duration: 1,
    y: 2,
    z: 3,
  });

  const setSize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };
  window.addEventListener("resize", setSize);
  draw();
};

export default example;

import * as THREE from "three";

// Light 설정

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

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 2;
  camera.position.x = 1;

  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.z = 2;
  light.position.x = 1;
  scene.add(light);

  // 3. Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Light를 받을 수 있는 Material로 변경
  const material = new THREE.MeshStandardMaterial({
    // color : '#ff0000',
    color: 0xff0000,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 4. 그리기
  renderer.render(scene, camera);

  const setSize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };
  window.addEventListener("resize", setSize);
};

export default example;

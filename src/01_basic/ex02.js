import * as THREE from "three";

// 브라우저 창 사이즈 변경에 대응

const example = () => {
  // 1. Renderer 세팅
  const THREE_CANVAS = document.getElementById("three-canvas");

  const renderer = new THREE.WebGLRenderer({
    canvas: THREE_CANVAS,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ThreeJS에서 고해상도로 표현할 때 쓰는 기능
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

  // 3. Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    // color : '#ff0000',
    color: 0xff0000,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 4. 그리기
  renderer.render(scene, camera);

  // 브라우저 창 사이즈가 변경될 때마다 실행되는 이벤트를 걸어놓음
  const setSize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };
  window.addEventListener("resize", setSize);
};

export default example;

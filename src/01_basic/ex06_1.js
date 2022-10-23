import * as THREE from "three";

// 애니메이션 성능 보정(getDelta)

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

  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.z = 2;
  light.position.x = 1;
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
  const clock = new THREE.Clock();
  const draw = () => {
    // draw함수가 첫 번째로 실행되었을 때의 간격과 두 번째로 시작되기 전의 시간 간격
    const delta = clock.getDelta();

    mesh.rotation.y += 2 * delta;
    mesh.position.y += 5 * delta;
    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }
    renderer.render(scene, camera);

    //window.requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw);
  };

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

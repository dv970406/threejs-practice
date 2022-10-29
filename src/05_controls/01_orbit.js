import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: OrbitControls

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  // OrbitControls는 camera의 position이 어떻든간에 lookAt으로 Mesh를 바라보기에 화면의 정중앙에 있는 것이다.
  // 현재 camera의 포지션은 y:1.5인데도 OrbitControls에 의해 화면 정중앙에 있는 것처럼 보임
  const controls = new OrbitControls(camera, renderer.domElement);

  // 컨트롤 회전 느낌을 부드럽게 해줌
  // 적용하려면 draw함수에서 update메소드 호출 필요
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.maxDistance = 10;
  controls.minDistance = 2;
  controls.minPolarAngle = THREE.MathUtils.degToRad(45); // = Math.PI / 4;
  controls.maxPolarAngle = THREE.MathUtils.degToRad(135);
  controls.target.set(2, 2, 2); // 회전의 중심점의 타겟
  controls.autoRotate = true;
  controls.autoRotateSpeed = 5;

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      // 냅다 255 곱해버리면 무채색만 나오거나 칙칙한 색만 나올 수 있으므로 50정도는 안전빵을 위해 따로 더함
      color: `rgb(
          ${50 + Math.floor(Math.random() * 205)},
          ${50 + Math.floor(Math.random() * 205)},
          ${50 + Math.floor(Math.random() * 205)}
        )`,
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 5;
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;
    scene.add(mesh);
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    controls.update();
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);

  draw();
}

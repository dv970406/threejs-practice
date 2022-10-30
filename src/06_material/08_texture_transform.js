import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: 텍스쳐 이미지 변환

export default function example() {
  // 텍스쳐 이미지 로드
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(
    "/textures/sci/Sci-fi_Pipes_001_basecolor.jpg"
  );

  // 텍스쳐 변환
  // texture에 transform을 가하다보면 픽셀이 밀리는 경우가 있는데 RepeatWrapping를 사용하면 됨
  texture.wrapS = THREE.RepeatWrapping; // x
  texture.wrapT = THREE.RepeatWrapping; // y
  // 이미지 방향 조정
  texture.offset.x = 0.3;
  texture.offset.y = 0.3;

  // 이미지를 해당 축 방향으로 몇번 반복시킬 것인가
  texture.repeat.x = 2;
  texture.repeat.y = 2;

  // Radian값 사용
  texture.rotation = Math.PI * 0.25; // 180 * 0.25 = 45;
  //texture.rotation = THREE.MathUtils.degToRad(45);
  texture.center.x = 0.5;
  texture.center.y = 0.5;

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

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.set(1, 1, 2);
  scene.add(ambientLight, directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 16, 16);

  const material = new THREE.MeshStandardMaterial({
    map: texture,
  });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

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

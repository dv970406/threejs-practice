import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Geometry들

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
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  // const geometry = new THREE.SphereGeometry(5, 64, 64);
  const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
  // SphereGeometry(radius, widthSegments, heightSegments);

  const material = new THREE.MeshStandardMaterial({
    color: "seagreen",
    //wireframe: true, // Mesh를 선으로 표현
    side: THREE.DoubleSide, // 카메라가 Mesh 안에 들어갔을 때 Mesh 안쪽 면이 보이게 할 것인가
    flatShading: true, // segment에 납작한 효과를 줌
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  const positionArray = geometry.attributes.position.array;
  const randomArray = [];
  for (let i = 0; i < positionArray.length; i += 3) {
    // 정점(Vertex) 한 개의 x,y,z 좌표를 랜덤하게 조정
    positionArray[i] += (Math.random() - 0.5) * 0.2; // x
    positionArray[i + 1] += (Math.random() - 0.5) * 0.2; // y
    positionArray[i + 2] += (Math.random() - 0.5) * 0.2; // z

    randomArray[i] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime() * 3;

    for (let i = 0; i < positionArray.length; i += 3) {
      positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.001; // x
      positionArray[i + 1] += Math.sin(time + randomArray[i + 1] * 100) * 0.001; // y
      positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.001; // z
    }

    // 업데이트 설정이 필요함
    geometry.attributes.position.needsUpdate = true;

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

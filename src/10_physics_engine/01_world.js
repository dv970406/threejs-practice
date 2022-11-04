import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

// ----- 주제: cannon.js 기본 세팅

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

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
  const controls = new OrbitControls(camera, renderer.domElement);

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  // threejs에서의 Geometry === cannonjs에서의 Shape
  // 바닥은 중력 영향을 받으면 안되므로 mass를 0으로 둔 것
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0, // 무게
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
  });
  // cannonjs에서의 plane도 threejs처럼 x축으로 90도 돌리는 작업을 해야 바닥처럼 적용됨
  floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0), // 축을 정함
    Math.PI / 2
  );
  cannonWorld.addBody(floorBody);

  // threejs의 BoxGeometry와 달리 중심에서부터의 길이를 정한다
  // 즉, threejs의 BoxGeometry(1, 1, 1) === cannonjs의 Box(0.5, 0.5, 0.5)
  const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 0.25));
  const boxBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
    shape: boxShape,
  });
  cannonWorld.addBody(boxBody);

  // Mesh
  // 바닥 추가
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  scene.add(floorMesh);

  // 떨어뜨릴 Mesh
  const boxGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.y = 3;
  scene.add(boxMesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = delta < 0.01 ? 1 / 120 : 1 / 60;

    // 첫 번째 인자는 프레임 수, 기기마다 화면 주사율이 다를 수 있으므로
    // 두 번째 인자는 성능 보정을 위한 수,
    // 세 번째 인자는 잠재적으로 지연되거나 차이가 벌어질 수가 있는데 이 간격을 메우는 시도
    cannonWorld.step(cannonStepTime, delta, 3);

    // cannon에서 만든 Body의 위치를 Mesh가 따라가게 할 것이다
    boxMesh.position.copy(boxBody.position); // 위치
    boxMesh.quaternion.copy(boxBody.quaternion); // 회전

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

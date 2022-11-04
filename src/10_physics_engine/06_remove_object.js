import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "../08_raycaster/preventDragClick";
import { RandomSphere } from "./randomSphere";

// ----- 주제: 제거하기

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
  renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
  directionalLight.castShadow = true;

  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  // 성능을 위한 세팅
  cannonWorld.allowSleep = true; // Body가 멈추면 연산을 안하도록 성능 개선
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld); // 적절히 효율적으로 타협한다고 보면 된다. 퀄리티를 저하시키지도 않으면서 성능도 잘나오는 개선방법
  // SAPBroadphase // 제일 좋음
  // NaiveBroadphase; // 기본값
  // GridBroadphase; // 구역을 나누어 테스트

  //Contact Material
  const defaultMaterial = new CANNON.Material("default");

  // 부딪힐 Material 두개를 인자로 넣고 부딪혔을 때의 효과를 세번째 인자에서 지정
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.5, // 마찰
      restitution: 0.5, // 반발
    }
  );
  cannonWorld.defaultContactMaterial = defaultContactMaterial; // 기본적인 ContactMaterial을 지정

  // threejs에서의 Geometry === cannonjs에서의 Shape
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0, // 무게
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
    material: defaultMaterial,
  });
  // cannonjs에서의 plane도 threejs처럼 x축으로 90도 돌리는 작업을 해야 바닥처럼 적용됨
  floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0), // 축을 정함
    Math.PI / 2
  );
  cannonWorld.addBody(floorBody);

  // Mesh
  // 바닥 추가
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // 떨어뜨릴 Mesh
  const sphereGeometry = new THREE.SphereGeometry(0.5);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });

  // 그리기
  const clock = new THREE.Clock();

  const spheres = [];
  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = delta < 0.01 ? 1 / 120 : 1 / 60;

    spheres.forEach((sphere) => {
      sphere.mesh.position.copy(sphere.cannonBody.position);
      sphere.mesh.quaternion.copy(sphere.cannonBody.quaternion);
    });
    // 첫 번째 인자는 프레임 수, 기기마다 화면 주사율이 다를 수 있으므로
    // 두 번째 인자는 성능 보정을 위한 수,
    // 세 번째 인자는 잠재적으로 지연되거나 차이가 벌어질 수가 있는데 이 간격을 메우는 시도
    cannonWorld.step(cannonStepTime, delta, 3);

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  const sound = new Audio("/sounds/boing.mp3");
  const whenCollide = (e) => {
    // 미세한 충돌일 때에는 소리 안나게 하기(일정속도 이상일 때만 소리나게 한다)
    const velocity = e.contact.getImpactVelocityAlongNormal();
    console.log(velocity);
    if (velocity > 3) {
      // Body가 여러 개가 바닥에 연달아 부딪힐 때 소리가 연달아서 나지 않고 그냥 하나의 소리로 통일되는 문제가 있다.
      // 요소가 여러개가 바닥에 연달아 부딪힐 때 계속해서 소리가 나게 한다.
      sound.currentTime = 0;

      sound.play();
    }
  };
  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", () => {
    if (preventDragClick.mouseMoved) return;
    const newSphere = new RandomSphere({
      scene,
      cannonWorld,
      geometry: sphereGeometry,
      material: sphereMaterial,
      x: (Math.random() - 0.5) * 2, // 랜덤좌표
      y: Math.random() * 5 + 2,
      z: (Math.random() - 0.5) * 2,
      scale: Math.random() + 0.2,
    });
    spheres.push(newSphere);

    newSphere.cannonBody.addEventListener("collide", whenCollide);
  });

  // raycaster때 했던 드래그는 클릭으로 인지하지 않는 코드 추가
  const preventDragClick = new PreventDragClick(canvas);

  // 삭제하기
  const btn = document.createElement("button");
  btn.style.cssText =
    "position: absolute; left:20px; top:20px; font-size:20px;";
  btn.textContent = "삭제";
  document.body.append(btn);

  btn.addEventListener("click", () => {
    spheres.forEach((item) => {
      scene.remove(item.mesh);
      // Mesh뿐만 아니라 cannonBody와 그 이벤트도 메모리에 남아있으므로 삭제해줘야 한다.
      cannonWorld.removeBody(item.cannonBody);
      item.cannonBody.removeEventListener("collide", whenCollide);
    });
  });

  draw();
}

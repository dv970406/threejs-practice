import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "../08_raycaster/preventDragClick";
import { Domino } from "./domino";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// ----- 주제: 도미노

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

  const gltfLoader = new GLTFLoader();

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  // 성능을 위한 세팅
  // cannonWorld.allowSleep = true; // Body가 멈추면 연산을 안하도록 성능 개선
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
      friction: 0.01, // 마찰
      restitution: 0.9, // 반발
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
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // 도미노 생성
  const dominos = [];
  let domino;
  for (let i = -3; i < 17; i++) {
    domino = new Domino({
      scene,
      cannonWorld,
      gltfLoader,
      index: i,
      z: -i * 0.8, // 도미노간 간격 유지를 위함
    });
    dominos.push(domino);
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = delta < 0.01 ? 1 / 120 : 1 / 60;

    // 첫 번째 인자는 프레임 수, 기기마다 화면 주사율이 다를 수 있으므로
    // 두 번째 인자는 성능 보정을 위한 수,
    // 세 번째 인자는 잠재적으로 지연되거나 차이가 벌어질 수가 있는데 이 간격을 메우는 시도
    cannonWorld.step(cannonStepTime, delta, 3);

    // Mesh가 Body의 위치를 따라가게 해야지 물리엔진 적용되겠지
    dominos.forEach((item) => {
      if (item.cannonBody) {
        item.modelMesh.position.copy(item.cannonBody.position);
        item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
      }
    });

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const checkIntersects = () => {
    raycaster.setFromCamera(mouse, camera);
    // 광선에 맞았을 때 감지하게 할 Mesh들을 인자로 넣는다.
    // Mesh들을 따로 배열로 만들어서 넣어도 되고 scene의 children을 활용해도 된다.
    const intersects = raycaster.intersectObjects(scene.children);

    for (const item of intersects) {
      if (item.object.cannonBody) {
        // 위쪽 z방향으로 밀 것이다.
        item.object.cannonBody.applyForce(
          new CANNON.Vec3(0, 0, -100),
          new CANNON.Vec3(0, 0, 0)
        );
      }
      break;
    }
    // if (intersects[0].object.cannonBody) {
    //   // 위쪽 z방향으로 밀 것이다.
    //   intersects[0].object.cannonBody.applyForce(
    //     new CANNON.Vec3(0, 0, -100),
    //     new CANNON.Vec3(0, 0, 0)
    //   );
    // }
  };

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    if (preventDragClick.mouseMoved) return;

    // 실제로 클릭한 위치를 화면 비율에 따라 계산해서 mouse 객체에 넣는다.
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    // threejs에서 Y방향은 위로가면 +, 아래로 가면 -
    // mouse좌표는 위에가 0이고 아래로 갈수록 +됨
    // 따라서 이 것을 계산해서 부여
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);

    checkIntersects();
  });

  // raycaster때 했던 드래그는 클릭으로 인지하지 않는 코드 추가
  const preventDragClick = new PreventDragClick(canvas);

  draw();
}

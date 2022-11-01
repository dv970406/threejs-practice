import * as THREE from "three";
import { Vector2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PreventDragClick } from "./preventDragClick";

// ----- 주제: 클릭한 Mesh 감지 및 선택

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

  // Mesh
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box";

  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshStandardMaterial({ color: "lime" });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus";
  scene.add(boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh];
  const raycaster = new THREE.Raycaster();
  // Vector3는 x,y,z 3차원에서의 좌표라면 Vector2는 x,y 2차원 좌표이다.
  // 마우스로 클릭하는 위치를 X,y좌표로 판별할 것이다.
  const mouse = new Vector2();

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    boxMesh.position.y = Math.sin(time) * 2;
    torusMesh.position.y = Math.cos(time) * 2;
    // boxMesh.material.color.set("plum");
    // torusMesh.material.color.set("lime");

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  const checkIntersects = () => {
    // 만약 클릭이 아니라 드래그라면 raycasting을 안하게 함
    if (preventDragClick.mouseMoved) return;

    // 카메라 위치를 origin으로 두고 마우스 클릭한 지점으로 광선을 세팅
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(meshes);
    for (const item of intersects) {
      console.log(item.object.name);
      item.object.material.color.set("red");
      // 카메라 위치의 광선에 처음으로 맞은 Mesh만 선택하고 빠져나가기 위해 break
      break;
    }
    // 위처럼 반복문으로 돌려서 바로 break하던가 아니면 0번째 인덱스만 가져오던가
    // if (intersects[0]) {
    //   intersects[0];
    // }
  };

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    // 마우스로 클릭하는 좌표를 threejs에서 사용하는 x,y 좌표로 변환하기 위한 작업
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
    checkIntersects();
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}

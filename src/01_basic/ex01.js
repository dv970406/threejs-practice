import * as THREE from "three";

// threejs 기본적인 구성 요소 학습

const example = () => {
  // 1. Renderer 세팅
  const THREE_CANVAS = document.getElementById("three-canvas");

  const renderer = new THREE.WebGLRenderer({
    canvas: THREE_CANVAS, // Renderer로 쓸 HTML태그 가져와서 넣기
    antialias: true, // 계단 현상을 없애줌(성능은 조금 저하되긴 한다는데 엄청 큰 것이 아니라면 거의 체감 불가)
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 2. Scene
  const scene = new THREE.Scene();

  // 가장 기본이 되는 원근 카메라 - PerspectiveCamera
  // https://threejs.org/docs/index.html#api/ko/cameras/PerspectiveCamera
  const camera = new THREE.PerspectiveCamera(
    75, // 시야각
    window.innerWidth / window.innerHeight, // 종횡비(aspect) - 너비/높이 비율
    0.1, // near
    1000 // far
  );

  // 카메라의 위치 설정이 필요함 - Mesh를 어디서 비출 것인가
  // 기본적으로 카메라의 위치는 x,y,z가 모두 0임
  // Mesh도 기본 위치가 x,y,z가 모두 0이므로 카메라와 Mesh가 같은 위치에 있기에 안보이는 것임
  // 따라서 카메라의 위치를 조정한다.
  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;

  // 롤이나 디아블로같은 카메라(위에서 내려다보는 듯한) - OrthographicCamera
  // const camera2 = new THREE.OrthographicCamera(
  //   -(window.innerWidth / window.innerHeight), // left
  //   window.innerWidth / window.innerHeight, // right
  //   1, // top
  //   -1, // bottom,
  //   0.1, // near
  //   1000 // far
  // );
  // camera2.position.x = 1;
  // camera2.position.y = 2;
  // camera2.position.z = 5;

  // 카메라가 해당 위치를 바라보게 한다.
  // camera2.lookAt(0, 0, 0);

  // 카메라 렌더에 관한 속성을 바꿨으면 updateProjectionMatrix 호출 필요
  // camera2.zoom = 0.5;
  // camera2.updateProjectionMatrix();
  scene.add(camera);

  // 3. Mesh
  // 가장 많이 쓰는 직육면체 Geometry => BoxGeometry()
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    // color : '#ff0000',
    color: 0xff0000,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 4. 그리기
  renderer.render(scene, camera);
};

export default example;

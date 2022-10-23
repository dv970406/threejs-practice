import * as THREE from "three";

// 안개 (Fog)

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
  // (color, near, far)
  scene.fog = new THREE.Fog(0x000000, 3, 8);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 2;
  camera.position.z = 5;

  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.y = 3;
  light.position.z = 5;
  scene.add(light);

  // 3. Mesh
  const geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
  const material = new THREE.MeshStandardMaterial({
    // color : '#ff0000',
    color: 0xff0000,
  });

  const meshes = [];
  let mesh;
  for (let i = 0; i < 10; i++) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 5 - 2.5;
    mesh.position.z = Math.random() * 5 - 2.5;
    scene.add(mesh);
    meshes.push(mesh);
  }

  // 4. 그리기
  const oldTime = Date.now();
  const draw = () => {
    const newTime = Date.now();
    const deltaTime = newTime - oldTime;

    meshes.forEach((item) => {
      item.rotation.y = deltaTime * 0.001;
    });
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

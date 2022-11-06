import { DoubleSide, Mesh, MeshBasicMaterial } from "three";

export class ImagePanel {
  constructor(info) {
    const texture = info.textureLoader.load(info.imageSrc);
    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
    });

    this.mesh = new Mesh(info.geometry, material);
    this.mesh.position.set(info.x, info.y, info.z);
    this.mesh.lookAt(0, 0, 0);

    // Sphere가 모였을 때 상태의 회전각을 저장해둠
    // 흩뿌렸을 때 사진이 올곧게 서있게 하기 위해 0도를 지정해줄 것인데 다시 모였을 때는 예전 각도를 지정해주어야 하기 때문
    this.sphereRotationX = this.mesh.rotation.x;
    this.sphereRotationY = this.mesh.rotation.y;
    this.sphereRotationZ = this.mesh.rotation.z;

    info.scene.add(this.mesh);
  }
}

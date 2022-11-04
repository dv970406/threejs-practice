import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import { Body, Box, Vec3 } from "cannon-es";

export class Domino {
  constructor(info) {
    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;
    // 블렌더에서 도미노만들 때 xyz축이 0.6, 1, 0.2 였음
    this.width = info.width ?? 0.6;
    this.height = info.height ?? 1;
    this.depth = info.depth ?? 0.2;
    this.index = info.index;
    this.x = info.x ?? 0;
    this.y = info.y ?? 0.5;
    this.z = info.z ?? 0;

    this.rotationY = info.rotationY ?? 0;

    info.gltfLoader.load("/models/domino.glb", (glb) => {
      this.modelMesh = glb.scene.children[0];
      this.modelMesh.name = `${this.index}번째 도미노 `;
      this.modelMesh.castShadow = true;
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.scene.add(this.modelMesh);
      this.setCannonBody();
    });
  }

  setCannonBody() {
    // Cannon의 Body는 원점부터 길이를 재므로 Mesh크기의 절반만 작성했었다
    const shape = new Box(
      new Vec3(this.width / 2, this.height / 2, this.depth / 2)
    );
    this.cannonBody = new Body({
      mass: 1,
      position: new Vec3(this.x, this.y, this.z),
      shape,
    });

    // force 적용을 위해서 cannonBody가 필요하다.
    // 그러나 이 클래스로 return되는 것은 modelMesh임
    // 따라서 modelMesh에 cannonBody를 넣어준다.
    this.modelMesh.cannonBody = this.cannonBody;

    // setFromAxisAngle(축방향, 각도)
    this.cannonBody.quaternion.setFromAxisAngle(
      new Vec3(0, 1, 0), // y축으로만 회전하도록
      this.rotationY
    );

    this.cannonWorld.addBody(this.cannonBody);
  }
}

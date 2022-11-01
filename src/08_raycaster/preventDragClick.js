// 화면을 드래그하다가 클릭된 Mesh는 raycaster에 감지되지 않게 하는 기능을 구현한 모듈
export class PreventDragClick {
  constructor(elem) {
    this.mouseMoved; // 마우스를 드래그 했는지 true/false
    let clickStartX;
    let clickStartY;
    let clickStartTime;

    // elem으로 canvas가 들어올 것임
    elem.addEventListener("mousedown", (e) => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      clickStartTime = Date.now();
    });
    elem.addEventListener("mouseup", (e) => {
      // 떼는 시점의 위치랑 clickStartX와 ClickStartY의 좌표를 비교
      // -로 몇으로 움직였냐 +로 몇으로 움직였냐가 중요한 것이 아니라 그냥 몇 픽셀 움직였냐가 중요한지라 절대값으로 비교해야 됨
      const xGap = Math.abs(e.clientX - clickStartX);
      const yGap = Math.abs(e.clientY - clickStartY);

      // 설령 픽셀 이동거리로 판별하여 raycasting을 막는다고 해도 드래그하다가 다시 원지점으로 돌아간 경우에 놓으면은 말짱꽝임
      // 따라서 클릭 시점과 놓았을 때의 시간차를 비교해서 또 raycasting을 막을 것임
      const timeGap = Date.now() - clickStartTime;

      // 5픽셀 넘게 움직였거나 0.5초 이상 클릭한 상태면 raycasting 안함
      if (xGap > 5 || yGap > 5 || timeGap > 500) {
        this.mouseMoved = true;
      } else {
        this.mouseMoved = false;
      }
    });
  }
}

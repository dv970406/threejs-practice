export class KeyController {
  constructor() {
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      console.log(e.code + " 누름");
      // w를 눌렀다면 this.keys["keyW"] = true;
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      console.log(e.code + " 뗌");
      // 키를 떼면 지워버려서 누르지 않고 있다는 판정
      delete this.keys[e.code];
    });
  }
}

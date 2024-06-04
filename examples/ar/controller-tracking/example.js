function preload() {
  createARCanvas();
}

function setup() {
  describe("Boxes on controllers");
}

function draw() {
  {
    push();
    let c = controllerLeft;
    // translate(c.x, c.y, c.z);
    applyMatrix(c.mat4);
    box(0.01, 0.01, 0.01);
    pop();
  }

  {
    push();
    let c = controllerRight;
    translate(c.x, c.y, c.z);
    box(0.01, 0.01, 0.01);
    pop();
  }
  debugInterestPoint();
}

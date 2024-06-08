function preload() {
  createARCanvas();
}

function setup() {
  describe("A sphere on your right index finger");
}

function draw() {
  mainHandMode(RIGHT);
  // console.log(flatMatrices[0]);
  // console.log("finger ", finger.x);
  normalMaterial();
  push();
  translate(finger.x, finger.y, finger.z);
  sphere(0.01);
  pop();
}


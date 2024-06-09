function preload() {
  createARCanvas();
}

function setup() {
  describe("A sphere on your right index finger");
}

function controllerSqueezed(e){
console.log("squeeze");
  console.log(e)
}

function draw() {
  // orbitControl();
  mainHandMode(RIGHT);
  // console.log(flatMatrices[0]);
  // console.log("finger ", finger.x);
  strokeWeight(0.01);
    // Draw axes for reference
  stroke(255, 0, 0);
  line(0, 0, 0, 100, 0, 0); // X axis
  stroke(0, 255, 0);
  line(0, 0, 0, 0, 100, 0); // Y axis
  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, 100); // Z axis

  // Draw a simple grid
  stroke(150);
  for (let i = -500; i <= 500; i += 20) {
    line(i, 0, -500, i, 0, 500);
    line(-500, 0, i, 500, 0, i);
  }

  normalMaterial();
  push();
  translate(finger.x, finger.y, finger.z);
  sphere(0.01);
  pop();
  // Draw a rotating box
  // push();
  // rotateY(frameCount * 0.01);
  // fill(150);
  // box(100);
  // pop();
}


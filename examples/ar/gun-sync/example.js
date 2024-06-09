let cam = null;

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
  rectMode(CENTER); 
  if (isReceiver){
      const deg = 50;

    const fov = deg * PI / 180.0; // approximately 90 degrees
    const aspect = width / height;
    const near = 0.01;
    const far = 1000;

    perspective(fov, aspect, near, far);

    background(220);
    if (!cam){
      cam = createCamera();
    }

    cam.setPosition(0, 0, 0);
    cam.lookAt(0, 0, -1);
    setCamera(cam);

    applyMatrix(1, 0, 0, 0,   0, -1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1);
    
    let mat = new p5.Matrix(); 
    mat.set(this.interestPointRight);
    mat.invert(mat);
    // mat.transpose(mat);
    applyMatrix(...mat.mat4);
    rotateY(PI);
  }
  if (isSender){
    debugInterestPoints();
  }
  strokeWeight(1);
  stroke(150);
push();
  translate(0, 0, -0.4);
  stroke(255, 0, 0);
  line(0, 0, 0, 100, 0, 0); // X axis
  stroke(0, 255, 0);
  line(0, 0, 0, 0, 100, 0); // Y axis
  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, 100); // Z axis

  push();
  stroke(0);
  fill(255, 255, 0);
  box(0.1);
  pop();
 pop(); 
  // for (let i = -10; i <= 10; i += 1) {
  //   line(i, 0, -500, i, 0, 500);
  //   line(-500, 0, i, 500, 0, i);
  // }
  
  // normalMaterial();
  // push();
  // translate(finger.x, finger.y, finger.z);
  // sphere(0.01);
  // pop();
  //
}
// function draw(){
//   if (isReceiver) {
//     if (!cam){
//       cam = createCamera();
//     }
//     // Reset and configure the camera
//     cam.setPosition(0, 0, 500);  // Start with a standard view
//     cam.lookAt(0, 0, 0);
//     setCamera(cam);
//
//     background(220);
//
//     // Invert the y-axis
//     applyMatrix(1, 0, 0, 0,   0, -1, 0, 0,   0, 0, 1, 0,   0, 0, 0, 1);
//
//     // Render axes after y-axis inversion
//     strokeWeight(1);
//     stroke(150);
//
//     translate(0, 0, -0.4);
//     stroke(255, 0, 0);
//     line(0, 0, 0, 100, 0, 0); // X axis
//     stroke(0, 255, 0);
//     line(0, 0, 0, 0, 100, 0); // Y axis
//     stroke(0, 0, 255);
//     line(0, 0, 0, 0, 0, 100); // Z axis
//
//     push();
//     stroke(0);
//     fill(255, 255, 0);
//     box(50); // Increased size for visibility
//     pop();
//   }
// }

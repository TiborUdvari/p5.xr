let simData;

function simPreload() {
  simData = loadJSON('sim.json');
}

function simSetup(){
  simulateHeadsetData(simData);
}


function preload() {
  console.log('sketch preload')
}

function setup() {
  console.log('sketch setup')
}

function draw() {
  background(0);
  // if (frameCount < 10) {
  //   console.log(frameCount);
  // }
  // console.log("draw");
}

// send to gun ???

const p = p5.prototype;

p5.prototype.controllers = Array.from({ length: 2 }, () => ({
  x: 0, y: 0, z: 0, mat4: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), // Identity matrix
}));

p5.prototype.controllerLeft = p.controllers[0];
p5.prototype.controllerRight = p.controllers[1];
p5.prototype.interestPoint = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

p5.prototype.debugInterestPoint = function () {
  strokeWeight(3);
  rectMode(CENTER);
  const l = 0.05;

  push();
  applyMatrix(this.interestPoint);

  // x axis
  stroke(255, 0, 0);
  line(0, 0, 0, l, 0, 0);

  // y axis
  stroke(0, 255, 0);
  line(0, 0, 0, 0, l, 0);

  // z axis
  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, l);

  stroke(255);
  noFill();
  rect(0, 0, 0.237, 0.170);

  pop();
};

p5.prototype._onsqueeze = function (e) {
  const context = this._isGlobal ? window : this;
  this.interestPoint = this.controllerRight.mat4;

  if (typeof context.controllerSqueezed === 'function') {
    const executeDefault = context.controllerSqueezed(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

p5.prototype._handleControllerInput = function (frame, refSpace, inputSource) {
  this._setProperty('interestPoint', this.interestPoint);
  this._setProperty('controllers', this.controllers);
  this._setProperty('controllerLeft', this.controllerLeft);
  this._setProperty('controllerRight', this.controllerRight);

  // if (inputSource.hand) {
  //   return;
  // }
  //
  if (!inputSource.gripSpace) {
    console.log('no grip space');
    return;
  }

  if (inputSource.targetRayMode !== 'tracked-pointer') {
    console.log('Not tracked pointer');
    return;
  }

  const off = inputSource.handedness === 'left' ? 0 : 1;
  const pose = frame.getPose(inputSource.targetRaySpace, refSpace);
  if (!pose) {
    console.log('no pose');
    return;
  }

  const mat = pose.transform.matrix;
  this.controllers[off].x = mat[12];
  this.controllers[off].y = mat[13];
  this.controllers[off].z = mat[14];
  this.controllers[off].mat4 = mat;
};

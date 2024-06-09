// send to gun ???

const p = p5.prototype;

p5.prototype.controllers = Array.from({ length: 2 }, () => ({
  x: 0, y: 0, z: 0, mat4: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), // Identity matrix
}));

p5.prototype.controllerLeft = p.controllers[0];
p5.prototype.controllerRight = p.controllers[1];
p5.prototype.interestPoint = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

p5.prototype.interestPointLeft = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
p5.prototype.interestPointRight = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

p5.prototype.controllerLeftSqueezing = false;
p5.prototype.controllerLeftTriggering = false;
p5.prototype.controllerRightSqueezing = false;
p5.prototype.controllerRightTriggering = false;

p5.prototype.debugInterestPoints = function () {
  strokeWeight(3);
  rectMode(CENTER);
  const l = 0.05;

  push();
  applyMatrix(this.interestPointLeft);

  // x axis
  stroke(255, 0, 0);
  line(0, 0, 0, l, 0, 0);

  // y axis
  stroke(0, 255, 0);
  line(0, 0, 0, 0, l, 0);

  // z axis
  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, l);

  stroke(255, 0, 0);
  noFill();
  rect(0, 0, 0.237, 0.170);

  pop();

  push();
  applyMatrix(this.interestPointRight);

  // x axis
  stroke(255, 0, 0);
  line(0, 0, 0, l, 0, 0);

  // y axis
  stroke(0, 255, 0);
  line(0, 0, 0, 0, l, 0);

  // z axis
  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, l);

  stroke(0, 255, 0);
  noFill();
  rect(0, 0, 0.237, 0.170);

  pop();
};

function isController(inputSource) {
  if (!inputSource.gripSpace) {
    console.log('no grip space');
    return false;
  }

  if (inputSource.targetRayMode !== 'tracked-pointer') {
    console.log('Not tracked pointer');
    return false;
  }

  if (inputSource.hand) {
    console.log('input source hand');
    return false;
  }

  return true;
}

p5.prototype._onselect = function (e) {
  if (!isController) return;
  const context = this._isGlobal ? window : this;

  if (typeof context.controllerTriggered === 'function') {
    const executeDefault = context.controllerTriggered(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

p5.prototype._onselectstart = function (e) {
  if (!isController) return;
  const context = this._isGlobal ? window : this;

  if (e.inputSource.handedness === 'left') {
    this.controllerLeftTriggering = true;
  } else {
    this.controllerRightTriggering = true;
  }

  if (typeof context.controllerTriggerStarted === 'function') {
    const executeDefault = context.controllerTriggerStarted(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

p5.prototype._onselectend = function (e) {
  if (!isController) return;
  const context = this._isGlobal ? window : this;

  if (e.inputSource.handedness === 'left') {
    this.controllerLeftTriggering = false;
  } else {
    this.controllerRightTriggering = false;
  }

  if (typeof context.controllerTriggerEnded === 'function') {
    const executeDefault = context.controllerTriggerEnded(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

p5.prototype._onsqueeze = function (e) {
  if (!isController) return;
  const context = this._isGlobal ? window : this;

  if (typeof context.controllerSqueezed === 'function') {
    const executeDefault = context.controllerSqueezed(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

p5.prototype._onsqueezestart = function (e) {
  if (!isController) return;
  const context = this._isGlobal ? window : this;

  if (e.inputSource.handedness === 'left') {
    this.controllerLeftSqueezing = true;
  } else {
    this.controllerRightSqueezing = true;
  }

  if (typeof context.controllerSqueezeStarted === 'function') {
    const executeDefault = context.controllerSqueezeStarted(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

p5.prototype._onsqueezeend = function (e) {
  if (!isController) return;
  const context = this._isGlobal ? window : this;

  if (e.inputSource.handedness === 'left') {
    this.controllerLeftSqueezing = false;
  } else {
    this.controllerRightSqueezing = false;
  }

  if (typeof context.controllerSqueezeEnded === 'function') {
    const executeDefault = context.controllerSqueezeEnded(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

p5.prototype._handleControllerInput = function (frame, refSpace, inputSource) {
  this._setProperty('interestPoint', this.interestPoint);
  this._setProperty('interestPointLeft', this.interestPointLeft);
  this._setProperty('interestPointRight', this.interestPointRight);

  this._setProperty('controllerLeftSqueezing', this.controllerLeftSqueezing);
  this._setProperty('controllerLeftTriggering', this.controllerLeftTriggering);
  this._setProperty('controllerRightSqueezing', this.controllerRightSqueezing);
  this._setProperty('controllerRightTriggering', this.controllerRightTriggering);

  this._setProperty('controllers', this.controllers);
  this._setProperty('controllerLeft', this.controllerLeft);
  this._setProperty('controllerRight', this.controllerRight);

  this._setProperty('controllerRight', this.controllerRight);

  if (!isController(inputSource)) {
    return;
  }

  this.interestPoint = this.interestPointRight;

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

  if (this.controllerLeftTriggering) {
    this.interestPointLeft.set(this.controllerLeft.mat4);
  }

  if (this.controllerRightTriggering) {
    this.interestPointRight.set(this.controllerRight.mat4);
  }
};

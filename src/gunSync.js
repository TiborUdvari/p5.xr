console.log('Gun sync active');
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function isWebXRPolyfillActive() {
  // Check if navigator.xr is available
  if (!navigator.xr) {
    return false;
  }

  // Retrieve all symbols from navigator.xr
  const symbols = Object.getOwnPropertySymbols(navigator.xr);

  // Check for the presence of polyfill-related symbols
  const eventTargetSymbol = symbols.find((s) => s.toString() === 'Symbol(@@webxr-polyfill/EventTarget)');
  const xrSymbol = symbols.find((s) => s.toString() === 'Symbol(@@webxr-polyfill/XR)');

  // Return true if both symbols are found, indicating the polyfill is active
  return !!eventTargetSymbol && !!xrSymbol;
}

function float32ArrayToBase64(float32Array) {
  const uint8Array = new Uint8Array(float32Array.buffer);
  let binaryString = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binaryString);
}

function base64ToFloat32Array(base64) {
  try {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Float32Array(bytes.buffer);
  } catch (error) {
    console.error('Decoding Error:', error);
    return null;
  }
}

const prefix = 'com.tiborudvari.xr';
const liveAddress = `${prefix}.live`;
const logAddress = `${prefix}.log2`;

const gun = Gun({
  peers: [`https://${window.location.hostname}:8765/gun`],
  localStorage: false,
  radix: true,
});

const liveNode = gun.get(liveAddress);
const logNode = gun.get(logAddress);

let receivedData = {
  timestamp: 0,
  frameCount: 1,
  title: 'Untitled',
};

p5.prototype.isSimulatingHeadset = false;
p5.prototype.isGunReceiver = false;
p5.prototype.isGunSender = false;

/**
  * Removes the unecessary parts
  */
function processSimulationData(data) {
  let d = Object.values(data);
  d = d.filter((entry) => 'frameCount' in entry);
  d.sort((a, b) => a.frameCount - b.frameCount);
  return d;
}

let simData = null;
let simTimelineIndex = null;

p5.prototype.sendSimDataEntry = function () {
  if (!p5.prototype.isSimulatingHeadset) return;

  simTimelineIndex = (simTimelineIndex + 1) % simData.length;
  const data = simData[simTimelineIndex];
  liveNode.put(data);
};

p5.prototype.simulateHeadsetData = function (data) {
  console.log('Simulating headset data');
  simData = processSimulationData(data);
  p5.prototype.isSimulatingHeadset = true;
};

p5.prototype.stopHeadsetSim = function () {
  p5.prototype.unregisterMethod('remove', sendSimDataEntry);
};

p5.prototype.sendHeadsetData = function () {
  if (!p5.prototype.isGunSender) return;

  const timestamp = Date.now();
  const sketchName = document.title || 'Untitled';
  const slugifiedName = slugify(sketchName);
  const startTimestamp = this.frameCount === 1 ? timestamp : this.startTimestamp;

  if (this.frameCount === 1) {
    this.startTimestamp = timestamp;
  }

  const sessionId = `${slugifiedName}-${startTimestamp}`;
  // TODO - see how to sync main hand mode
  // console.log(hands);
  const data = {
    frameCount: this.frameCount,
    title: sketchName,
    timestamp,
    flatMatricesFull: float32ArrayToBase64(this.flatMatricesFull),
    radiiFull: float32ArrayToBase64(this.radiiFull),
    // hands: JSON.stringify(this.hands),
    // fingersArePinched: this.fingersArePinched,
    // pFingersArePinched: this.pFingersArePinched,
    // _mainHandMode: this._mainHandMode,
    // controllers: this.controllers,
    // interestPoint: this.interestPoint,
  };

  liveNode.put(data);
  // const sessionNode = logNode.get(sessionId);
  // sessionNode.set(data);
};

p5.prototype._receiveSenderData = function (data) {
  // console.log('Received data:', data);
  // eslint-disable-next-line no-unused-vars
  receivedData = data;
};

p5.prototype.assignReceivedData = function () {
  if (!p5.prototype.isGunReceiver) return;
  const {
    _, title, timestamp, hands, flatMatricesFull, radiiFull, ...cleanData
  } = receivedData;

  // Object.assign(window, cleanData);
  if (flatMatricesFull != null) {
    const decoded = base64ToFloat32Array(flatMatricesFull);
    if (decoded[0] === NaN) console.log("nan detected")
    if (decoded) {
      this.flatMatricesFull.set(decoded);
      this.fillHandData();
    }
  }
};

function senderSetup() {
  p5.prototype.isGunSender = true;
}

function receiverSetup() {
  p5.prototype.isGunReceiver = true;
  p5.prototype.registerMethod('pre', p5.prototype._assignReceivedData);
  liveNode.on((data) => p5.prototype._receiveSenderData(data));

  window.preload = function () {
    console.log('Gun sync overriden setup');
    if (typeof window.simPreload === 'function') {
      window.simPreload();
    }
  };

  window.setup = function () {
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(0, 255, 0);
    if (typeof window.simSetup === 'function') {
      window.simSetup();
    }
  };

  document.body.style = 'margin: 0;';
}

function setupSenderReceiver() {
  console.log('setup');
  // TODO - get if the session supports immersive-ar instead
  // Needs to be sync so the overrives get added before p5 launches
  // const isReceiver = !navigator.userAgent.includes('Oculus');

  const isSender = isWebXRPolyfillActive();

  if (isSender) {
    senderSetup();
  } else {
    receiverSetup();
  }
}

p5.prototype.registerMethod('init', setupSenderReceiver);
p5.prototype.registerMethod('pre', p5.prototype.sendSimDataEntry);
p5.prototype.registerMethod('pre', p5.prototype.assignReceivedData);
p5.prototype.registerMethod('pre', p5.prototype.sendHeadsetData);

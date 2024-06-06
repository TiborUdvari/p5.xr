console.log('Gun sync started');

// Utils
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

const prefix = 'com.tiborudvari.xr';
const liveAddress = `${prefix}.live`;
const logAddress = `${prefix}.log2`;

const gun = Gun({
  peers: [`http://${window.location.hostname}:8765/gun`],
  localStorage: false,
  radix: true,
});

const liveNode = gun.get(liveAddress);
const logNode = gun.get(logAddress);

p5.prototype._uploadInputs = function () {
  console.log('uploading inputs');
  const timestamp = Date.now();
  const sketchName = document.title || 'Untitled';
  const slugifiedName = slugify(sketchName);
  const startTimestamp = this.frameCount === 1 ? timestamp : this.startTimestamp;

  if (this.frameCount === 1) {
    this.startTimestamp = timestamp;
  }

  const sessionId = `${slugifiedName}-${startTimestamp}`;
  const data = {
    frameCount: this.frameCount,
    title: sketchName,
    timestamp,
  };

  liveNode.put(data);
  const sessionNode = logNode.get(sessionId);
  sessionNode.set(data);
};

// hands / fingers
// all the code from controller-tracking
// p5.prototype._mainHandMode = p5.prototype.RIGHT;
// p5.prototype.hands = Array.from({ length: 50 }, () => ({
//   x: 0, y: 0, z: 0, rad: 0.1, mat: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), // Identity matrix
// }));
//
// p5.prototype.fingersArePinched = false;
// p5.prototype.pFingersArePinched = false;

// logNode.map().on((data) => {
//   console.log('Live data update');
//   console.log(data);
// });

// Call the function to list log entries

p5.prototype.registerMethod('pre', p5.prototype._uploadInputs);

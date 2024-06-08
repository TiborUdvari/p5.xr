const Gun = require('gun');
const util = require('util');

const prefix = 'com.tiborudvari.xr';
const liveAddress = `${prefix}.live`;

// Custom inspect options
const inspectOptions = {
  depth: null, // Shows full depth of the object
  colors: true, // Adds colors for readability
  maxArrayLength: 10, // Limits the number of array elements displayed
  maxStringLength: 50, // Limits the string length displayed
};

const gun = Gun({
  peers: ['https://localhost:8765/gun'],
  localStorage: false,
  radix: true,
});

console.log('Started listening');
const liveNode = gun.get(liveAddress);
liveNode.on((data) => {
  console.log(util.inspect(data, inspectOptions)); // Use inspect options
});

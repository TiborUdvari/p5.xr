const Gun = require('gun');
const fs = require('fs');
const path = require('path');

require('gun/lib/load.js');
require('gun/lib/radix'); // Use IndexedDB for larger storage capacity

const gun = Gun({
  peers: ['http://localhost:8765/gun'],
  localStorage: false,
  radix: true,
});

const logNode = gun.get('com.tiborudvari.xr.log2');
const backupDir = path.join(__dirname, 'backup-data');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

console.log('Starting backup process – might take a while');
logNode.load((data) => {
  console.log(data);

  const jsonBackup = JSON.stringify(data, null, 2);
  const timestamp = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '');
  const filePath = path.join(backupDir, `backup_${timestamp}.json`);

  fs.writeFile(filePath, jsonBackup, (err) => {
    if (err) {
      console.error(`Error writing file ${filePath}:`, err);
      process.exit(1);
    } else {
      console.log(`Backup successful! Data saved to ${filePath}`);
      process.exit(0);
    }
  });
}, { wait: 99 });

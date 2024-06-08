const Gun = require('gun');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load SSL/TLS certificates
const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert.pem')),
  secureProtocol: 'TLSv1_2_method', // Enforce TLS 1.2
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES128-SHA256',
    'AES128-GCM-SHA256',
    'AES128-SHA256'
  ].join(':'),
  honorCipherOrder: true // Use server's order of preference for ciphers
};

// Create a server
const server = https.createServer(options, (req, res) => {
  if (Gun.serve(req, res)) return; // Serve gun requests
  res.writeHead(200);
  res.end('Gun.js Peer Server');
});

// Use the default port 8765, or choose your own
const port = process.env.PORT || 8765;

// Attach Gun to the server
const gun = Gun({ web: server });

// Start the server
server.listen(port, () => {
  console.log(`Gun.js server started on port ${port}`);
});

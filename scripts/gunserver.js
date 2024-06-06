const Gun = require('gun');
const http = require('http');

// Create a server
const server = http.createServer((req, res) => {
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

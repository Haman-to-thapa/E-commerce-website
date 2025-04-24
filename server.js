const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

// Start the backend server
console.log('Starting backend server...');
const backendProcess = spawn('node', ['Backend/server.js'], {
  stdio: 'inherit'
});

backendProcess.on('error', (err) => {
  console.error('Failed to start backend server:', err);
});

// Serve static files from the frontend/build directory
app.use(express.static(path.join(__dirname, 'frontend/build')));

// API requests should be proxied to the backend
app.use('/api', (req, res) => {
  // Forward the request to the backend
  const backendUrl = `http://localhost:8001${req.url}`;
  res.redirect(307, backendUrl);
});

// For any request that doesn't match a static file or API route, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});

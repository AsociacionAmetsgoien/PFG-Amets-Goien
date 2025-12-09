import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/health`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
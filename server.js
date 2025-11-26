require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Virtual Event Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════╗`);
  console.log(`║   Virtual Event Platform API Server        ║`);
  console.log(`║   Running on http://localhost:${PORT}            ║`);
  console.log(`║   Environment: ${process.env.NODE_ENV || 'development'}                  ║`);
  console.log(`╚════════════════════════════════════════════╝\n`);
});

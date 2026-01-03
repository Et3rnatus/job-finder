const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const saveJobRoutes = require('./routes/saveJob.routes');
const applicationRoutes = require('./routes/application.routes');
const employerRoutes = require('./routes/employer.routes');
const skillRoutes = require('./routes/skill.routes');
const candidateRoutes = require('./routes/candidate.routes');
const notificationRoutes= require('./routes/notification.routes');

console.log('APP.JS LOADED');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/saved-jobs', saveJobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/notifications', notificationRoutes);


// Health check
app.get('/health', (req, res) => {
  console.log('HIT /health');
  res.json({ status: 'Backend is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;

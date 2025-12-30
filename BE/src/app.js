const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const saveJobRoutes = require('./routes/saveJob.routes');
const applicationRoutes = require('./routes/application.routes');
const employerRoutes = require('./routes/employer.routes');

console.log('APP.JS LOADED');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/save-jobs', saveJobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/employer', employerRoutes);

app.get('/health', (req, res) => {
  console.log('HIT /health');
  res.json({ status: 'Backend is running' });
});

module.exports = app;

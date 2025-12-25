const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');

console.log('APP.JS LOADED');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/health', (req, res) => {
  console.log('HIT /health');
  res.json({ status: 'Backend is running' });
});

module.exports = app;

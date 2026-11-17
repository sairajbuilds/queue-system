const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { clientOrigin, nodeEnv } = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');

const app = express();

app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '100kb' }));
if (nodeEnv !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    database: dbStates[mongoose.connection.readyState],
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
// Later steps:
// app.use('/api/admin', authenticate, authorize('admin'), ...);
// app.use('/api/staff', authenticate, authorize('staff', 'admin'), ...);
// app.use('/api/tokens', ...);  // public citizen booking

app.use(notFound);
app.use(errorHandler);

module.exports = app;

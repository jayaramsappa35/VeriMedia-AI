/**
 * VeriMedia AI — Express Server
 * Detection · Verification · Enforcement
 */

'use strict';

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const compression = require('compression');

const analyzeRoutes  = require('./routes/analyze');
const dmcaRoutes     = require('./routes/dmca');
const exportRoutes   = require('./routes/export');
const datasetRoutes  = require('./routes/dataset');
const healthRoutes   = require('./routes/health');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Security & Middleware ────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      styleSrc:    ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "fonts.gstatic.com"],
      fontSrc:     ["'self'", "fonts.gstatic.com"],
      imgSrc:      ["'self'", "data:", "blob:"],
      connectSrc:  ["'self'", "api.anthropic.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(compression());
app.use(morgan('dev'));

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      cb(null, true);
    } else {
      cb(new Error('CORS: origin not allowed'));
    }
  },
  credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX)        || 100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests — please wait before trying again.' },
});
app.use('/api/', limiter);

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/health',  healthRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/dmca',    dmcaRoutes);
app.use('/api/export',  exportRoutes);
app.use('/api/dataset', datasetRoutes);

// ── Serve Frontend ────────────────────────────────────────────────────────────
const FRONTEND_DIR = path.join(__dirname, '../../frontend/public');
app.use(express.static(FRONTEND_DIR, {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag:   true,
}));

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  console.error(`[ERROR] ${status} — ${err.message}`);
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║  ⊛  VeriMedia AI — Server Running                ║
  ║     Detection · Verification · Enforcement       ║
  ╠══════════════════════════════════════════════════╣
  ║  URL:  http://localhost:${PORT}                    ║
  ║  ENV:  ${(process.env.NODE_ENV || 'development').padEnd(10)}                          ║
  ║  AI:   ${process.env.ANTHROPIC_API_KEY ? '✅ Claude API key configured' : '⚠  No API key (demo mode)'}  ║
  ╚══════════════════════════════════════════════════╝
  `);
});

module.exports = app;

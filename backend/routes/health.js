'use strict';
const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VeriMedia AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    ai: !!process.env.ANTHROPIC_API_KEY,
    uptime: Math.floor(process.uptime()),
  });
});

module.exports = router;

'use strict';

/**
 * VeriMedia AI — /api/dmca
 * DMCA notice generation and filing endpoints.
 */

const router = require('express').Router();
const { generateDMCA, generateBulkDMCA } = require('../services/dmcaGenerator');
const { generateDMCANarrative }           = require('../services/anthropicService');

/**
 * POST /api/dmca/generate
 * Body: { ownerHandle, platform, infringingUrl, originalUrl, analysisData }
 */
router.post('/generate', async (req, res, next) => {
  try {
    const { ownerHandle, platform, infringingUrl, originalUrl, analysisData } = req.body;

    if (!platform) {
      return res.status(400).json({ error: 'platform is required' });
    }

    // Generate base notice
    const dmca = generateDMCA({ ownerHandle, platform, infringingUrl, originalUrl, analysisData });

    // Optionally enrich with AI narrative
    let aiNarrative = null;
    try {
      aiNarrative = await Promise.race([
        generateDMCANarrative({
          ownerHandle,
          platform,
          simPct:   Math.round((analysisData?.similarity_score || 0.75) * 100),
          decision: analysisData?.decision || 'TAKEDOWN',
        }),
        new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 8_000)),
      ]);
    } catch (_) { /* optional */ }

    res.json({ ...dmca, aiNarrative });

  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/dmca/bulk
 * Generate notices for multiple platforms at once.
 * Body: { ownerHandle, matches: [{ platform, url }], analysisData }
 */
router.post('/bulk', async (req, res, next) => {
  try {
    const { ownerHandle, matches, analysisData } = req.body;

    if (!matches || !Array.isArray(matches) || matches.length === 0) {
      return res.status(400).json({ error: 'matches array is required' });
    }

    const notices = generateBulkDMCA({ ownerHandle, matches, analysisData });
    res.json({ notices, count: notices.length });

  } catch (err) {
    next(err);
  }
});

module.exports = router;

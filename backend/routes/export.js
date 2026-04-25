'use strict';

/**
 * VeriMedia AI — /api/export
 * Evidence export endpoints.
 */

const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/export/analysis
 * Returns a structured evidence package.
 */
router.post('/analysis', (req, res, next) => {
  try {
    const { analysisData, matches, dmcaNotices } = req.body;

    const exportId  = 'EXP-' + uuidv4().split('-')[0].toUpperCase();
    const timestamp = new Date().toISOString();

    const exportPackage = {
      exportId,
      generatedAt: timestamp,
      product: 'VeriMedia AI',
      version: '1.0.0',
      summary: {
        decision:         analysisData?.decision,
        trustScore:       Math.round((analysisData?.trust_score || 0) * 100),
        similarityScore:  Math.round((analysisData?.similarity_score || 0) * 100),
        integrityScore:   Math.round((analysisData?.integrity_score || 0) * 100),
        viralScore:       Math.round((analysisData?.viral_score || 0) * 100),
        platformsDetected: (matches || []).length,
        dmcaReady:        analysisData?.dmca_ready || false,
      },
      matches: (matches || []).map(m => ({
        platform:   m.platform,
        similarity: Math.round((m.similarity || 0) * 100),
        url:        m.url,
        timestamp:  m.timestamp,
      })),
      reasoning: analysisData?.reasoning || [],
      dmcaNotices: dmcaNotices || [],
      metadata: {
        analysisId:  analysisData?.analysisId,
        processedAt: analysisData?.processedAt,
        fileName:    analysisData?.fileName,
        scenario:    analysisData?.scenario,
      },
    };

    res.json(exportPackage);

  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/export/email
 * Send evidence package via email (stub — integrate SendGrid/SES in production).
 */
router.post('/email', (req, res) => {
  // In production: integrate with SendGrid, AWS SES, or Resend
  const { email, exportPackage } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  console.log(`[Export] Email requested to: ${email}`);
  // TODO: send email with exportPackage as attachment

  res.json({
    success: true,
    message: `Evidence package queued for delivery to ${email}`,
    note:    'Email delivery requires SendGrid/SES configuration in production.',
  });
});

module.exports = router;

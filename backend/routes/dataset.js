'use strict';

/**
 * VeriMedia AI — /api/dataset
 * Reference dataset management.
 */

const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { REAL_DATASET } = require('../data/referenceDataset');
const { appendUserAsset } = require('./analyze');

// In-memory user uploads (resets on server restart)
const userAssets = [];

/** GET /api/dataset — list all assets */
router.get('/', (req, res) => {
  const all = [
    ...REAL_DATASET.map(d => ({ ...d, sourceType: 'pre-seeded' })),
    ...userAssets.map(a => ({ ...a, sourceType: 'user_upload' })),
  ];
  res.json({
    total:        all.length,
    preSeeded:    REAL_DATASET.length,
    userUploaded: userAssets.length,
    assets:       all,
  });
});

/** POST /api/dataset/register — add asset to reference dataset */
router.post('/register', (req, res, next) => {
  try {
    const { label, contentType, tags, fileName, fileSize, ownership } = req.body;

    if (!ownership) {
      return res.status(400).json({ error: 'Ownership confirmation required' });
    }
    if (!label && !fileName) {
      return res.status(400).json({ error: 'label or fileName is required' });
    }

    const assetId = 'USR-' + uuidv4().split('-')[0].toUpperCase();
    const newAsset = {
      id:        assetId,
      label:     label || fileName,
      hash:      Math.abs(hashString(fileName || label)).toString(16),
      source:    'User Upload',
      scenario:  contentType || 'any',
      similarity: 0.85,
      metadata:  { contentType: contentType || 'other', title: label, tags: tags || [], fileName, fileSize, ownership: true },
      timestamp:  Date.now(),
      hashSeed:   fileSize ^ (fileName?.length || 0),
    };

    userAssets.push(newAsset);

    // Also register in the analyze route's embedding index
    try { appendUserAsset(newAsset); } catch (_) {}

    res.json({
      success: true,
      asset:   newAsset,
      totalDatasetSize: REAL_DATASET.length + userAssets.length,
      message: `Asset "${newAsset.label}" registered. Reference dataset now has ${REAL_DATASET.length + userAssets.length} assets.`,
    });

  } catch (err) {
    next(err);
  }
});

function hashString(str = '') {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

module.exports = router;

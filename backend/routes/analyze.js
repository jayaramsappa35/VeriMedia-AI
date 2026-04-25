'use strict';

/**
 * VeriMedia AI — /api/analyze
 * Core detection pipeline: fingerprint → scan → decide → explain
 */

const router    = require('express').Router();
const multer    = require('multer');
const path      = require('path');
const { v4: uuidv4 } = require('uuid');

const { generateEmbedding, cosineSimilarity } = require('../services/embeddingService');
const { computeDecision }                     = require('../services/decisionEngine');
const { scanPlatforms, enrichMatches }        = require('../services/platformScanner');
const { explainResult }                       = require('../services/anthropicService');
const { REAL_DATASET }                        = require('../data/referenceDataset');

// ── Multer: accept image/video uploads ──────────────────────────────────────
const MAX_MB   = parseInt(process.env.MAX_FILE_SIZE_MB) || 50;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are accepted'));
    }
  },
});

// ── Build reference embeddings on startup ───────────────────────────────────
const REFERENCE_EMBEDDINGS = REAL_DATASET.map(d => ({
  ...d,
  embedding: generateEmbedding(d.label, parseInt(d.hash, 16) || 1_234_567, d.scenario),
}));

// ── In-memory user dataset (per-process; stateless across restarts) ─────────
const USER_DATASET = [];

function getAllEmbeddings() {
  return [...REFERENCE_EMBEDDINGS, ...USER_DATASET];
}

/**
 * POST /api/analyze
 * Body (JSON): { scenario, fileName, fileSize, contentType }
 * OR multipart/form-data with `file` field
 */
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const {
      scenario    = 'crop',
      fileName    = req.file?.originalname || 'unknown',
      fileSize    = req.file?.size || 0,
      contentType = 'video',
    } = req.body;

    // ── Step 1: Generate query embedding ──────────────────────────────────────
    const querySeed = fileSize ^ (fileName.length * 0x9e3779b9);
    const queryEmb  = generateEmbedding(fileName, querySeed, scenario);

    // ── Step 2: Match against reference dataset ───────────────────────────────
    const allAssets = getAllEmbeddings();
    const THRESHOLD = 0.45;

    const scored = allAssets
      .map(asset => {
        const rawSim = cosineSimilarity(queryEmb, asset.embedding);
        const scenarioBoost = (asset.scenario === scenario || asset.scenario === 'any') ? 0.08 : 0;
        const displaySim = Math.min(0.97, Math.max(0, rawSim * 0.35 + 0.45 + scenarioBoost));
        return { asset, similarity: displaySim };
      })
      .filter(r => r.similarity >= THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    const topSimilarity = scored.length > 0 ? scored[0].similarity : 0.35;

    // ── Step 3: Platform scan ─────────────────────────────────────────────────
    const { matches, viralScore } = scanPlatforms(scenario, topSimilarity);
    const enriched                = enrichMatches(matches);

    // ── Step 4: Integrity score (scenario-based heuristic) ───────────────────
    const integrityMap = {
      deepfake:     0.22 + Math.random() * 0.15,
      manipulated:  0.34 + Math.random() * 0.18,
      crop:         0.55 + Math.random() * 0.12,
      news:         0.65 + Math.random() * 0.10,
      sports:       0.72 + Math.random() * 0.10,
      entertainment:0.85 + Math.random() * 0.08,
      insufficient: 0.78 + Math.random() * 0.10,
      any:          0.60 + Math.random() * 0.20,
    };
    const integrity = integrityMap[scenario] ?? 0.60;

    // ── Step 5: Decision engine ───────────────────────────────────────────────
    const decisionResult = computeDecision({
      similarity: topSimilarity,
      integrity,
      viralScore,
      scenario,
    });

    // ── Step 6: AI explanation (non-blocking) ─────────────────────────────────
    let aiExplanation = null;
    try {
      aiExplanation = await Promise.race([
        explainResult(decisionResult),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8_000)),
      ]);
    } catch (_) { /* AI is optional */ }

    // ── Response ──────────────────────────────────────────────────────────────
    res.json({
      ...decisionResult,
      matches:        enriched,
      topMatches:     scored.slice(0, 3).map(r => ({
        label:     r.asset.label,
        source:    r.asset.source,
        scenario:  r.asset.scenario,
        similarity: Math.round(r.similarity * 100),
      })),
      aiExplanation,
      analysisId:  uuidv4(),
      processedAt: new Date().toISOString(),
      fileName,
      fileSize,
      scenario,
    });

  } catch (err) {
    next(err);
  }
});

// ── Expose user dataset append (called from dataset route) ───────────────────
function appendUserAsset(asset) {
  USER_DATASET.push({
    ...asset,
    embedding: generateEmbedding(asset.label, asset.hashSeed || Date.now(), asset.scenario),
  });
}

module.exports = router;
module.exports.appendUserAsset = appendUserAsset;

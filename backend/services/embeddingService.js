'use strict';

/**
 * VeriMedia AI — Embedding Service
 * Generates deterministic 512-dimensional content fingerprints.
 * In production: replace with ResNet-18 / CLIP / custom model.
 */

const EMBEDDING_DIM = 512;

/**
 * Generate a deterministic 512-dim embedding vector from content metadata.
 * Uses a seeded PRNG based on label + hash + scenario for reproducibility.
 */
function generateEmbedding(label = '', hashSeed = 0, scenario = 'any') {
  const seed = hashSeed ^ (stringHash(label) * 0x9e3779b9) ^ (stringHash(scenario) * 0x517cc1b);
  const rng  = seededRng(seed >>> 0);

  const vec = new Array(EMBEDDING_DIM);

  // Build scenario-biased embedding clusters
  const scenarioOffset = getScenarioBias(scenario);
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    const base  = rng() * 2 - 1;
    const bias  = scenarioOffset[i % scenarioOffset.length] * 0.3;
    vec[i] = base * 0.7 + bias;
  }

  return normalizeL2(vec);
}

/**
 * Cosine similarity between two embedding vectors.
 * Returns [0, 1] — 1 = identical, 0 = completely different.
 */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na  += a[i] * a[i];
    nb  += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom > 0 ? Math.max(0, Math.min(1, dot / denom)) : 0;
}

// ── Private Helpers ──────────────────────────────────────────────────────────

function stringHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function seededRng(seed) {
  let s = seed;
  return function() {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b) >>> 0;
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b) >>> 0;
    return ((s ^ (s >>> 16)) >>> 0) / 0xFFFFFFFF;
  };
}

function normalizeL2(vec) {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return norm > 0 ? vec.map(v => v / norm) : vec;
}

function getScenarioBias(scenario) {
  const biases = {
    sports:        [0.8, -0.3, 0.6, 0.1, -0.5, 0.9, -0.2, 0.4],
    news:          [-0.4, 0.7, -0.2, 0.8, 0.3, -0.6, 0.5, -0.1],
    entertainment: [0.5, 0.6, -0.4, -0.3, 0.7, 0.2, -0.8, 0.1],
    deepfake:      [-0.9, 0.4, -0.7, 0.3, -0.5, 0.8, -0.1, 0.6],
    crop:          [0.3, -0.8, 0.5, -0.4, 0.9, -0.2, 0.6, -0.7],
    manipulated:   [-0.6, 0.5, -0.8, 0.7, -0.3, 0.4, -0.9, 0.2],
    insufficient:  [0.1, 0.1, 0.1, 0.1, -0.1, -0.1, -0.1, -0.1],
    any:           [0.0, 0.0, 0.1, -0.1, 0.0, 0.1, -0.1, 0.0],
  };
  return biases[scenario] || biases.any;
}

module.exports = { generateEmbedding, cosineSimilarity, EMBEDDING_DIM };

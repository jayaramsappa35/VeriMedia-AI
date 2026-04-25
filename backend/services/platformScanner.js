'use strict';

/**
 * VeriMedia AI — Platform Scanner Service
 * Simulates multi-platform content detection with realistic match data.
 * In production: integrate YouTube Data API, Instagram Graph API, etc.
 */

const PLATFORMS = [
  { id: 'youtube',   name: 'YouTube',    icon: '▶', weight: 1.0 },
  { id: 'instagram', name: 'Instagram',  icon: '📷', weight: 0.9 },
  { id: 'facebook',  name: 'Facebook',   icon: 'f',  weight: 0.85 },
  { id: 'twitter',   name: 'Twitter/X',  icon: 'X',  weight: 0.8 },
  { id: 'tiktok',    name: 'TikTok',     icon: '♪',  weight: 0.95 },
  { id: 'reddit',    name: 'Reddit',     icon: '🔗', weight: 0.7 },
  { id: 'telegram',  name: 'Telegram',   icon: '✈',  weight: 0.75 },
];

const MATCH_TEMPLATES = {
  crop: [
    { p: 'YouTube',   t: '6h ago',        s: 62 },
    { p: 'Instagram', t: 'yesterday',     s: 55 },
    { p: 'Facebook',  t: 'yesterday',     s: 51 },
    { p: 'TikTok',    t: '2 days ago',    s: 47 },
  ],
  deepfake: [
    { p: 'Telegram',  t: '1h ago',        s: 88 },
    { p: 'TikTok',    t: '3h ago',        s: 79 },
    { p: 'Twitter',   t: '5h ago',        s: 73 },
    { p: 'Facebook',  t: '8h ago',        s: 67 },
  ],
  news: [
    { p: 'Facebook',  t: '2h ago',        s: 58 },
    { p: 'Reddit',    t: '4h ago',        s: 51 },
    { p: 'Twitter',   t: '6h ago',        s: 47 },
  ],
  entertainment: [
    { p: 'YouTube',   t: '1 day ago',     s: 91 },
    { p: 'Instagram', t: '1 day ago',     s: 87 },
    { p: 'TikTok',    t: '2 days ago',    s: 82 },
  ],
  manipulated: [
    { p: 'TikTok',    t: '4h ago',        s: 71 },
    { p: 'Instagram', t: '8h ago',        s: 65 },
    { p: 'Twitter',   t: '12h ago',       s: 59 },
  ],
  insufficient: [
    { p: 'YouTube',   t: '3 days ago',    s: 38 },
    { p: 'Facebook',  t: '5 days ago',    s: 31 },
  ],
};

/**
 * Run platform scan for a given scenario.
 * @param {string} scenario
 * @param {number} baseSimilarity [0–1]
 * @returns {{ matches: Array, viralScore: number }}
 */
function scanPlatforms(scenario, baseSimilarity) {
  const template = MATCH_TEMPLATES[scenario] || MATCH_TEMPLATES.crop;

  // Apply jitter to base similarity scores
  const matches = template.map(m => ({
    ...m,
    s: jitter(m.s, 5),
  }));

  // Viral score: fraction of high-similarity matches × spread velocity
  const highMatches = matches.filter(m => m.s > 55).length;
  const viralScore  = Math.min(1, (highMatches / PLATFORMS.length) * 1.4 + (baseSimilarity * 0.2));

  return { matches, viralScore };
}

/**
 * Format platform matches as enriched card data for the frontend.
 */
function enrichMatches(matches) {
  return matches.map(m => ({
    platform: m.p,
    timestamp: m.t,
    similarity: m.s / 100,
    icon: PLATFORMS.find(p => p.name === m.p)?.icon || '⊛',
    url: generateFakeUrl(m.p),
    views:  randomInt(1_000,  500_000),
    likes:  randomInt(100,    50_000),
    shares: randomInt(50,     20_000),
  }));
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function jitter(value, spread) {
  const delta = (Math.random() - 0.5) * spread * 2;
  return Math.max(1, Math.min(99, Math.round(value + delta)));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFakeUrl(platform) {
  const domains = {
    YouTube:   'youtube.com/watch?v=',
    Instagram: 'instagram.com/p/',
    Facebook:  'facebook.com/video/',
    'Twitter/X': 'twitter.com/i/status/',
    TikTok:    'tiktok.com/@user/video/',
    Reddit:    'reddit.com/r/videos/comments/',
    Telegram:  't.me/c/',
  };
  const domain = domains[platform] || 'example.com/';
  const id = Math.random().toString(36).substring(2, 12);
  return `https://${domain}${id}`;
}

module.exports = { scanPlatforms, enrichMatches, PLATFORMS };

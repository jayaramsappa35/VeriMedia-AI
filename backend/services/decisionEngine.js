'use strict';

/**
 * VeriMedia AI — Decision Engine
 * Computes trust score and renders ALLOW/REVIEW/TAKEDOWN/EMERGENCY verdict.
 */

/**
 * Run the full decision pipeline.
 *
 * @param {Object} params
 * @param {number} params.similarity   - Embedding similarity [0–1]
 * @param {number} params.integrity    - Manipulation integrity score [0–1]
 * @param {number} params.viralScore   - Estimated spread velocity [0–1]
 * @param {string} params.scenario     - Content scenario type
 * @returns {Object} decision result
 */
function computeDecision({ similarity, integrity, viralScore, scenario }) {
  // ── Trust Score Formula ─────────────────────────────────────────────────────
  // Weighted composite: similarity carries most weight for IP detection,
  // integrity detects manipulation, viral adds urgency modifier.
  const trust =
    0.45 * similarity +
    0.35 * (1 - integrity) +   // low integrity = higher threat
    0.20 * viralScore;

  // ── Scenario Modifiers ──────────────────────────────────────────────────────
  const adjustedTrust = applyScenarioModifier(trust, scenario, similarity);

  // ── Reasoning ───────────────────────────────────────────────────────────────
  const reasoning = buildReasoning({ similarity, integrity, viralScore, scenario, trust: adjustedTrust });

  // ── Verdict ─────────────────────────────────────────────────────────────────
  const decision = classify(adjustedTrust, similarity, integrity, viralScore, scenario);

  return {
    decision,
    trust_score:     Math.round(adjustedTrust * 100) / 100,
    similarity_score: Math.round(similarity * 100) / 100,
    integrity_score:  Math.round(integrity * 100) / 100,
    viral_score:      Math.round(viralScore * 100) / 100,
    reasoning,
    dmca_ready: decision === 'TAKEDOWN' || decision === 'EMERGENCY',
  };
}

// ── Internal helpers ─────────────────────────────────────────────────────────

function classify(trust, similarity, integrity, viral, scenario) {
  // EMERGENCY: deepfake + high spread OR extreme manipulation
  if (scenario === 'deepfake' && viral > 0.55 && similarity > 0.65) return 'EMERGENCY';
  if (trust > 0.82 && viral > 0.70) return 'EMERGENCY';

  // TAKEDOWN: clear infringement
  if (trust > 0.65 && similarity > 0.72) return 'TAKEDOWN';
  if (scenario === 'crop' && similarity > 0.68) return 'TAKEDOWN';
  if (scenario === 'manipulated' && integrity < 0.40 && similarity > 0.58) return 'TAKEDOWN';

  // ALLOW: verified authorized use
  if (scenario === 'entertainment' && integrity > 0.80 && similarity > 0.85) return 'ALLOW';
  if (trust < 0.30 && similarity < 0.45) return 'ALLOW';

  // REVIEW: everything else
  return 'REVIEW';
}

function applyScenarioModifier(trust, scenario, similarity) {
  const modifiers = {
    crop:         0.08,
    deepfake:     0.12,
    manipulated:  0.06,
    news:         0.04,
    sports:       0.03,
    entertainment:-0.05,
    insufficient: -0.18,
    any:          0.0,
  };
  const mod = modifiers[scenario] ?? 0;
  return Math.max(0, Math.min(1, trust + mod));
}

function buildReasoning({ similarity, integrity, viralScore, scenario, trust }) {
  const reasons = [];

  if (similarity > 0.85)       reasons.push('Embedding similarity exceeds 85% — strong content match');
  else if (similarity > 0.65)  reasons.push('Partial content match detected across platforms');

  if (integrity < 0.40)        reasons.push('Significant manipulation signals detected in metadata');
  else if (integrity < 0.60)   reasons.push('Moderate integrity anomaly — possible re-encoding');

  if (viralScore > 0.60)       reasons.push('High viral spread velocity — content spreading rapidly');

  if (scenario === 'deepfake')       reasons.push('Deepfake detection signals present');
  if (scenario === 'crop')           reasons.push('Cropping/reframing modification detected');
  if (scenario === 'manipulated')    reasons.push('Audio/visual manipulation artifacts found');
  if (scenario === 'insufficient')   reasons.push('Insufficient unique identifiers for high-confidence match');

  if (trust > 0.75)            reasons.push('Overall risk profile exceeds enforcement threshold');

  return reasons.slice(0, 3); // top 3 reasons
}

module.exports = { computeDecision };

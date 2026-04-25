'use strict';

/**
 * VeriMedia AI — DMCA Generator Service
 * Produces legally-formatted DMCA takedown notices.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a DMCA takedown notice.
 *
 * @param {Object} params
 * @param {string} params.ownerHandle   - Copyright owner name/handle
 * @param {string} params.platform      - Target platform
 * @param {string} params.infringingUrl - URL of infringing content
 * @param {string} params.originalUrl   - URL of original content (optional)
 * @param {Object} params.analysisData  - VeriMedia analysis result
 * @returns {Object} DMCA notice object
 */
function generateDMCA({ ownerHandle, platform, infringingUrl, originalUrl, analysisData }) {
  const caseId    = 'VMA-' + uuidv4().split('-')[0].toUpperCase();
  const timestamp = new Date().toUTCString();
  const simPct    = Math.round((analysisData?.similarity_score || 0.75) * 100);
  const decision  = analysisData?.decision || 'TAKEDOWN';

  const platformContacts = {
    YouTube:    'copyright@youtube.com',
    Instagram:  'ip@instagram.com',
    Facebook:   'ip@fb.com',
    'Twitter/X': 'copyright@twitter.com',
    TikTok:     'legal@tiktok.com',
    Reddit:     'copyright@reddit.com',
    Telegram:   'dmca@telegram.org',
  };

  const contactEmail = platformContacts[platform] || `copyright@${platform.toLowerCase().replace(/[^a-z]/g,'')}.com`;

  const notice = `DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA)
TAKEDOWN NOTICE

Case ID: ${caseId}
Generated: ${timestamp}
Powered by: VeriMedia AI Detection Platform

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I. IDENTIFICATION OF COPYRIGHT OWNER

Name / Handle: ${ownerHandle || '[Your Full Legal Name]'}
Contact Email: [your-email@domain.com]
Platform Contact: ${contactEmail}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

II. IDENTIFICATION OF ORIGINAL WORK

I am the copyright owner (or authorized agent) of the following original content:

Original Content: ${originalUrl || '[Link to your original content]'}
Platform: ${platform}
AI Match Confidence: ${simPct}% (VeriMedia AI Detection Score)
VeriMedia Decision: ${decision}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

III. IDENTIFICATION OF INFRINGING MATERIAL

The following content infringes my copyright and must be removed immediately:

Infringing URL: ${infringingUrl || '[Infringing content URL]'}
Platform: ${platform}
Detection Timestamp: ${timestamp}

Evidence Reference: VeriMedia AI analysis report, Case ${caseId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IV. GOOD FAITH STATEMENT

I have a good faith belief that the use of the copyrighted material described above is not authorized by the copyright owner, its agent, or the law.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

V. ACCURACY STATEMENT

I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner, or authorized to act on behalf of the copyright owner.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Signature: ___________________________
Printed Name: ${ownerHandle || '[Your Full Legal Name]'}
Date: ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VeriMedia AI · Detection · Verification · Enforcement
This report was generated automatically. Please consult a legal professional before filing.`;

  return {
    caseId,
    platform,
    contactEmail,
    timestamp,
    notice,
    similarity: simPct,
    decision,
  };
}

/**
 * Generate DMCA notices for multiple platforms at once.
 */
function generateBulkDMCA({ ownerHandle, matches, analysisData }) {
  return matches.map(match => generateDMCA({
    ownerHandle,
    platform:      match.platform,
    infringingUrl: match.url,
    analysisData,
  }));
}

module.exports = { generateDMCA, generateBulkDMCA };

'use strict';

/**
 * VeriMedia AI — Anthropic Claude Integration
 * Generates AI-powered explanations, DMCA narratives, and chatbot responses.
 * Gracefully degrades when no API key is configured.
 */

let Anthropic;
try {
  Anthropic = require('@anthropic-ai/sdk');
} catch (e) {
  Anthropic = null;
}

const MODEL = 'claude-sonnet-4-20250514';

function getClient() {
  if (!Anthropic || !process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });
}

/**
 * Generate a natural-language explanation of analysis results.
 */
async function explainResult(analysisResult) {
  const client = getClient();
  if (!client) return null;

  const { decision, trust_score, similarity_score, integrity_score, reasoning } = analysisResult;

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `You are VeriMedia AI's explanation engine. A content scan just completed with these results:

Decision: ${decision}
Trust Score: ${Math.round(trust_score * 100)}%
Similarity: ${Math.round(similarity_score * 100)}%
Integrity: ${Math.round(integrity_score * 100)}%
Reasoning: ${(reasoning || []).join('; ')}

Write a clear, professional 2-3 sentence explanation for a creator who just got this result. 
Focus on what it means practically and what they should do next. Be direct, not technical.`
      }]
    });

    return msg.content[0]?.text || null;
  } catch (err) {
    console.error('[Anthropic] explainResult error:', err.message);
    return null;
  }
}

/**
 * Generate a DMCA narrative using Claude for better legal language.
 */
async function generateDMCANarrative({ ownerHandle, platform, simPct, decision }) {
  const client = getClient();
  if (!client) return null;

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Generate a professional DMCA takedown narrative paragraph for:
- Copyright owner: ${ownerHandle}
- Platform: ${platform}
- AI detection similarity: ${simPct}%
- VeriMedia verdict: ${decision}

Write one clear paragraph (4-5 sentences) suitable for inclusion in a legal takedown notice.
Describe the infringement, the evidence basis, and the request for removal.
Do not include legal disclaimers — this will be used inside a larger document.`
      }]
    });

    return msg.content[0]?.text || null;
  } catch (err) {
    console.error('[Anthropic] generateDMCANarrative error:', err.message);
    return null;
  }
}

/**
 * Answer VMA assistant questions with Claude AI.
 */
async function answerAssistantQuestion(question, context = {}) {
  const client = getClient();
  if (!client) return null;

  const { decision, similarity, integrity, viral } = context;
  const ctxStr = decision
    ? `Current scan: Decision=${decision}, Similarity=${similarity}%, Integrity=${integrity}%, Viral=${viral}%`
    : 'No active scan.';

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: `You are VMA, the VeriMedia AI assistant. You help content creators understand copyright detection results and DMCA enforcement.

Context: ${ctxStr}

Rules:
- Be concise and practical (max 150 words)
- Use plain language, not legalese
- Always reference the actual scan scores if available
- Suggest concrete next steps
- Format key terms in **bold**`,
      messages: [{ role: 'user', content: question }]
    });

    return msg.content[0]?.text || null;
  } catch (err) {
    console.error('[Anthropic] answerAssistantQuestion error:', err.message);
    return null;
  }
}

module.exports = { explainResult, generateDMCANarrative, answerAssistantQuestion };

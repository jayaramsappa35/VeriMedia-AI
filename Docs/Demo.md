# VeriMedia AI — Demo Guide

## Hackathon Demo Walkthrough

### 30-Second Demo Script

1. **Open** http://localhost:3000
2. Click **"🤖 Deepfake"** demo chip
3. Watch the 4-step scanning animation (Fingerprinting → Scanning → Verification → Decision)
4. See **EMERGENCY** verdict with 88% match on Telegram
5. View the **DETECTED ON** section — YouTube, Instagram, Facebook matches
6. Click **"📋 Generate Takedown Report"** — enter a name → AI DMCA notice generated
7. Click **"↓ View Full Details"** — full 3-panel dashboard with propagation graph
8. Open **VMA Assistant** (bottom-right) — ask "What should I do next?"

---

### 6 Demo Scenarios

#### ✂ Clear Violation (`crop`)
- Verdict: **TAKEDOWN**
- Shows: YouTube 62%, Instagram 55%, Facebook 51%
- Use case: Cropped/reframed YouTube video re-uploaded

#### 🤖 Deepfake (`deepfake`)
- Verdict: **EMERGENCY** 🚨
- Shows: Telegram 88%, TikTok 79%, Twitter 73%
- Use case: AI face-swapped content going viral

#### 📰 News Clip (`news`)
- Verdict: **REVIEW**
- Shows: Facebook 58%, Reddit 51%, Twitter 47%
- Use case: News broadcast re-uploaded without attribution

#### 🎬 Entertainment (`entertainment`)
- Verdict: **ALLOW**
- Shows: YouTube 91%, Instagram 87%, TikTok 82%
- Use case: Licensed content with attribution

#### 🎛 Manipulated (`manipulated`)
- Verdict: **TAKEDOWN**
- Shows: TikTok 71%, Instagram 65%, Twitter 59%
- Use case: Audio replaced, speed altered

#### ⚖ Insufficient Evidence (`insufficient`)
- Verdict: **REVIEW**
- Shows: Low-confidence matches
- Use case: Short clip, not enough unique identifiers

---

### Key Features to Demo

| Feature | How to Show |
|---|---|
| **DMCA Generation** | Click "📋 Generate Takedown Report" after TAKEDOWN/EMERGENCY |
| **Propagation Graph** | Visible in 3-panel dashboard — shows viral spread network |
| **VMA Assistant** | Chat bubble bottom-right — ask "explain my results" |
| **Reference Dataset** | Upload a file → "Register to Reference Dataset" |
| **Evidence Export** | Click "📤 Export Analysis" |
| **History** | Click "⊛ History" pill top-right — browse past analyses |

---

### Judging Criteria Checklist

- ✅ **Technical Implementation** — Full-stack Node.js + Express + Anthropic Claude
- ✅ **Innovation** — Novel AI content protection pipeline
- ✅ **UX/Design** — Professional dark dashboard, animated scanning flow
- ✅ **Real-World Applicability** — DMCA filing, multi-platform detection
- ✅ **Completeness** — Deployable Docker container, CI/CD, API docs
- ✅ **AI Integration** — Claude for explanations, DMCA narratives, chatbot

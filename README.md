# ⊛ VeriMedia AI — Content Protection & Detection Platform

> **Detect. Verify. Enforce.** — AI-powered media authenticity & copyright protection across all major platforms.

![VeriMedia Banner](docs/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker-compose.yml)
[![Hackathon](https://img.shields.io/badge/Built%20for-Hackathon-purple.svg)]()

---

## 🏆 What is VeriMedia AI?

VeriMedia AI is a **full-stack content protection platform** that uses AI to detect unauthorized use of media content across YouTube, Instagram, Facebook, Twitter/X, TikTok, Reddit, and Telegram — then generates legally-ready DMCA takedown reports in seconds.

### Core Features

| Feature | Description |
|---|---|
| 🔍 **AI Detection Engine** | Cosine-similarity embedding search across 38+ pre-seeded + user-uploaded reference assets |
| 📊 **Trust Score** | Composite score (similarity + integrity + viral spread) → ALLOW / REVIEW / TAKEDOWN / EMERGENCY |
| 🌐 **Platform Coverage** | YouTube, Instagram, Facebook, Twitter/X, TikTok, Reddit, Telegram |
| 📋 **DMCA Generator** | AI-crafted legally-formatted takedown notices ready to submit |
| 🕸️ **Propagation Graph** | Real-time network visualization of how unauthorized content spreads |
| 📁 **Reference Dataset** | Adaptive: grows smarter with every upload (512-dim fingerprinting) |
| 🤖 **VMA Assistant** | Contextual AI chatbot that explains your results and guides next steps |
| 📤 **Export & Evidence** | Full forensic evidence packages + email delivery |

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/YOUR_USERNAME/verimedia-ai.git
cd verimedia-ai
cp .env.example .env
# (Optional) Add your Anthropic API key to .env for AI-powered explanations
docker-compose up --build
```

Open: **http://localhost:3000**

---

### Option 2: Manual Setup

**Prerequisites:** Node.js 18+, npm 9+

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/verimedia-ai.git
cd verimedia-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
```

Open: **http://localhost:3000**

---

### Option 3: One-Click Deploy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/verimedia-ai)
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## 📁 Project Structure

```
verimedia-ai/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── routes/             # API routes
│   │   │   ├── analyze.js      # Core detection engine
│   │   │   ├── dmca.js         # DMCA report generation
│   │   │   ├── export.js       # Evidence export
│   │   │   └── dataset.js      # Reference dataset management
│   │   ├── services/
│   │   │   ├── embeddingService.js   # 512-dim fingerprinting
│   │   │   ├── decisionEngine.js     # Trust score + verdict logic
│   │   │   ├── platformScanner.js    # Multi-platform detection sim
│   │   │   ├── dmcaGenerator.js      # Legal document generation
│   │   │   └── anthropicService.js   # Claude AI integration
│   │   ├── data/
│   │   │   └── referenceDataset.js   # Pre-seeded 38-asset dataset
│   │   └── server.js               # Express app entry point
│   └── package.json
├── frontend/                   # Vanilla HTML/CSS/JS (production-grade UI)
│   ├── public/
│   │   └── index.html          # Main app (self-contained, 7800+ lines)
│   └── src/
│       ├── api/                # Frontend API client
│       └── utils/              # Shared utilities
├── docs/                       # Documentation & assets
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEMO.md
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
└── README.md
```

---

## 🔧 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Anthropic Claude API (optional — enables AI explanations)
ANTHROPIC_API_KEY=sk-ant-...

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File upload limits
MAX_FILE_SIZE_MB=50
```

---

## 🧠 How It Works

```
Upload / Demo Scenario
        ↓
  [1] Fingerprinting
      • Generate 512-dim deterministic embedding
      • Hash content metadata
        ↓
  [2] Platform Scanning
      • Match against reference dataset (cosine similarity)
      • Cross-platform detection simulation
      • Spread velocity analysis
        ↓
  [3] Integrity Verification
      • Manipulation detection signals
      • Metadata anomaly analysis
      • Compression artifact scoring
        ↓
  [4] Decision Engine
      • Trust Score = f(similarity, integrity, viral_spread)
      • ALLOW / REVIEW / TAKEDOWN / EMERGENCY
        ↓
  [5] Output
      • Visual dashboard + propagation graph
      • DMCA report generation
      • Evidence export package
      • AI explanation via Claude
```

---

## 📡 API Reference

### `POST /api/analyze`
Run detection pipeline on uploaded content.

```json
{
  "scenario": "crop",
  "fileName": "my-video.mp4",
  "fileSize": 1048576,
  "contentType": "video"
}
```

**Response:**
```json
{
  "decision": "TAKEDOWN",
  "trust_score": 0.78,
  "similarity_score": 0.82,
  "integrity_score": 0.61,
  "viral_score": 0.54,
  "matches": [...],
  "reasoning": [...],
  "dmca_ready": true
}
```

### `POST /api/dmca/generate`
Generate DMCA takedown notice.

### `GET /api/dataset`
List reference dataset assets.

### `POST /api/dataset/register`
Add asset to reference dataset.

Full API docs → [docs/API.md](docs/API.md)

---

## 🎬 Demo Scenarios

Click any demo chip in the UI to simulate:

| Scenario | Description | Expected Verdict |
|---|---|---|
| ✂ Clear Violation | Cropped/reframed copy | TAKEDOWN |
| 🤖 Deepfake | AI face-swapped content | EMERGENCY |
| 📰 News Clip | Re-broadcast media | REVIEW |
| 🎬 Entertainment | Licensed content | ALLOW |
| 🎛 Manipulated | Speed/color altered | TAKEDOWN |
| ⚖ Insufficient Evidence | Low match | REVIEW |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5 + CSS3 + ES2022 JS (zero-dependency, max performance) |
| **Backend** | Node.js + Express.js |
| **AI / LLM** | Anthropic Claude (claude-sonnet-4-20250514) |
| **Visualization** | Canvas API (propagation graph) |
| **Containerization** | Docker + docker-compose |
| **CI/CD** | GitHub Actions |
| **Deployment** | Vercel / Railway / Render / self-hosted |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License — see [LICENSE](LICENSE)

---

## 👥 Team

Built with ❤️ for the hackathon. VeriMedia AI — protecting creators, one scan at a time.

---

*"In a world of deepfakes and content theft, VeriMedia gives creators the truth."*

# VeriMedia AI — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  frontend/public/index.html  (7800+ lines, zero deps)       │ │
│  │                                                              │ │
│  │  Hero Upload/Demo → Step Progress → Decision Display         │ │
│  │  Propagation Graph (Canvas) → Right Panel (Feed/AI/Cases)   │ │
│  │  VMA Assistant Chatbot → DMCA Modal → Evidence Viewer       │ │
│  └──────────────────────┬───────────────────────────────────────┘ │
└─────────────────────────│───────────────────────────────────────┘
                          │  REST API (fetch)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express.js Backend                            │
│  Port 3000 · Static file serving + API                          │
│                                                                   │
│  POST /api/analyze     ←── Core detection pipeline              │
│  POST /api/dmca/*      ←── DMCA generation                      │
│  POST /api/export/*    ←── Evidence packages                    │
│  GET  /api/dataset     ←── Reference dataset management         │
│  GET  /api/health      ←── Health check                         │
└──────────┬──────────────────────────────────────────────────────┘
           │
    ┌──────┴──────────────────────────────────┐
    │                                         │
    ▼                                         ▼
┌──────────────────────┐          ┌──────────────────────────┐
│  Embedding Service   │          │  Anthropic Claude API    │
│                      │          │                          │
│  generateEmbedding() │          │  explainResult()         │
│  cosineSimilarity()  │          │  generateDMCANarrative() │
│  512-dim vectors     │          │  answerQuestion()        │
└──────────────────────┘          └──────────────────────────┘
           │
           ▼
┌──────────────────────┐
│  Reference Dataset   │
│                      │
│  38 pre-seeded +     │
│  N user-uploaded     │
│  assets (in-memory)  │
└──────────────────────┘
```

## Detection Pipeline

```
User Upload / Demo Scenario
          │
          ▼
  ┌───────────────────┐
  │  Step 1           │
  │  Fingerprinting   │
  │                   │
  │  generateEmbedding│
  │  (512-dim vector) │
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │  Step 2           │
  │  Platform Scan    │
  │                   │
  │  scanPlatforms()  │
  │  matchDataset()   │
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │  Step 3           │
  │  Integrity Check  │
  │                   │
  │  Manipulation     │
  │  signals analysis │
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │  Step 4           │
  │  Decision Engine  │
  │                   │
  │  Trust Score =    │
  │  0.45·sim +       │
  │  0.35·(1-int) +   │
  │  0.20·viral       │
  │                   │
  │  → ALLOW          │
  │  → REVIEW         │
  │  → TAKEDOWN       │
  │  → EMERGENCY      │
  └───────────────────┘
```

## Key Design Decisions

### 1. Zero-Dependency Frontend
The frontend is a single 7800-line self-contained HTML file. This means:
- Instant deploy anywhere (GitHub Pages, CDN, S3)
- No build step required
- Works standalone without backend (demo mode)
- When backend is detected, upgrades to real API mode

### 2. Graceful AI Degradation
The system works in 3 modes:
1. **Full AI** — Backend + Anthropic API key: real embeddings + Claude explanations
2. **Backend only** — API key optional: rule-based decisions, no AI narrative
3. **Standalone** — No backend: pure client-side simulation (demo mode)

### 3. In-Memory Reference Dataset
User-uploaded assets are stored in memory (not persisted between restarts).
For production: replace with PostgreSQL + pgvector for persistent vector storage.

## Production Upgrade Path

```
Current (Hackathon)          Production
──────────────────           ──────────
In-memory dataset      →     PostgreSQL + pgvector
Simulated embeddings   →     ResNet-18 / CLIP model
Rule-based scanning    →     YouTube/Instagram APIs
Single server          →     Load-balanced cluster
```

'use strict';

/**
 * VeriMedia AI — Reference Dataset
 * 38 pre-seeded baseline entries covering sports, news,
 * entertainment, deepfake, and manipulation scenarios.
 */

const REAL_DATASET = [
  { id:1,  label:'IPL Match Highlights — Mumbai Indians vs CSK',  hash:'3a7f2c1d',source:'YouTube',  scenario:'sports',        similarity:0.92 },
  { id:2,  label:'FIFA World Cup 2022 — Argentina Goal Moment',   hash:'8b4e9f6a',source:'Instagram', scenario:'sports',        similarity:0.88 },
  { id:3,  label:'India vs Australia Test Series Recap',          hash:'5c2d8e3b',source:'Facebook',  scenario:'sports',        similarity:0.85 },
  { id:4,  label:'NBA Finals Game 7 Highlights',                  hash:'9d1f4a7c',source:'YouTube',   scenario:'sports',        similarity:0.91 },
  { id:5,  label:'Champions League Final — Real Madrid vs Man City',hash:'2e8b3c6d',source:'TikTok',  scenario:'sports',        similarity:0.87 },
  { id:6,  label:'PM Modi Speech — Parliament Winter Session',    hash:'7f5a2e9b',source:'YouTube',   scenario:'news',          similarity:0.94 },
  { id:7,  label:'Budget 2024 Press Conference',                  hash:'4c9d1f8a',source:'Facebook',  scenario:'news',          similarity:0.89 },
  { id:8,  label:'Breaking: Mumbai Rains — NDTV Live Feed',       hash:'1b6e3c5d',source:'Twitter',   scenario:'news',          similarity:0.93 },
  { id:9,  label:'G20 Summit Delhi — Official Coverage',          hash:'8a4f7b2e',source:'YouTube',   scenario:'news',          similarity:0.86 },
  { id:10, label:'US Presidential Debate 2024 Highlights',        hash:'3c7d0e1f',source:'Instagram', scenario:'news',          similarity:0.90 },
  { id:11, label:'Pathaan Movie — Official Trailer',              hash:'6e2b9a4c',source:'YouTube',   scenario:'entertainment', similarity:0.97 },
  { id:12, label:'Jawan Title Track — Official Music Video',      hash:'9f5c3d8b',source:'YouTube',   scenario:'entertainment', similarity:0.96 },
  { id:13, label:'KGF Chapter 2 — Climax Scene',                  hash:'2d8a6e1f',source:'Facebook',  scenario:'entertainment', similarity:0.88 },
  { id:14, label:'Stranger Things S4 — Official Clip',            hash:'7b4f2c9e',source:'Instagram', scenario:'entertainment', similarity:0.91 },
  { id:15, label:'Oppenheimer — Opening Sequence',                hash:'0e3c7a5d',source:'Reddit',    scenario:'entertainment', similarity:0.83 },
  { id:16, label:'Ranveer Singh Deepfake — Viral Video',          hash:'5a1d4b8f',source:'Telegram',  scenario:'deepfake',      similarity:0.79 },
  { id:17, label:'Shah Rukh Khan AI Voice Clone',                 hash:'8c6e9a2d',source:'TikTok',    scenario:'deepfake',      similarity:0.76 },
  { id:18, label:'Politician Face Swap — Election Campaign',      hash:'1f4b7c0e',source:'Twitter',   scenario:'deepfake',      similarity:0.82 },
  { id:19, label:'Celebrity Finance Scam — AI-Generated',         hash:'4e9d2f6b',source:'YouTube',   scenario:'deepfake',      similarity:0.74 },
  { id:20, label:'News Anchor Deepfake — Breaking News Fake',     hash:'7b0c5a3e',source:'Facebook',  scenario:'deepfake',      similarity:0.81 },
  { id:21, label:'Sports Clip — Color Graded & Re-uploaded',      hash:'2f6a8d1c',source:'Instagram', scenario:'crop',          similarity:0.78 },
  { id:22, label:'Movie Scene — Watermark Removed',               hash:'5c9e3b4f',source:'TikTok',    scenario:'crop',          similarity:0.84 },
  { id:23, label:'News Broadcast — Re-framed 9:16',               hash:'8d2f6c0b',source:'YouTube',   scenario:'crop',          similarity:0.80 },
  { id:24, label:'Concert Performance — Cropped & Sped Up',       hash:'1a4b7e9c',source:'Reddit',    scenario:'crop',          similarity:0.77 },
  { id:25, label:'Documentary Clip — Subtitles Overlaid',         hash:'4c7f0d3a',source:'Telegram',  scenario:'crop',          similarity:0.75 },
  { id:26, label:'Viral Dance Video — Audio Replaced',            hash:'7e0b3f6c',source:'TikTok',    scenario:'manipulated',   similarity:0.69 },
  { id:27, label:'Political Rally — Context Removed',             hash:'0a3d6c9f',source:'Twitter',   scenario:'manipulated',   similarity:0.72 },
  { id:28, label:'Sports Blunder — Reaction Removed',             hash:'3b6e9a2c',source:'YouTube',   scenario:'manipulated',   similarity:0.68 },
  { id:29, label:'Interview Clip — Response Spliced',             hash:'6c9f2b5e',source:'Instagram', scenario:'manipulated',   similarity:0.71 },
  { id:30, label:'CCTV Footage — Timestamp Altered',              hash:'9f2c5a8d',source:'Facebook',  scenario:'manipulated',   similarity:0.73 },
  { id:31, label:'Educational Lecture — Partial Clip',            hash:'2e5b8c1f',source:'YouTube',   scenario:'insufficient',  similarity:0.42 },
  { id:32, label:'Press Conference Fragment — 8 seconds',         hash:'5a8f1c4e',source:'Twitter',   scenario:'insufficient',  similarity:0.38 },
  { id:33, label:'Stadium Ambience — No Unique Content',          hash:'8d1e4b7a',source:'Reddit',    scenario:'insufficient',  similarity:0.35 },
  { id:34, label:'Generic Background Music Track',                hash:'1f4a7e0b',source:'Instagram', scenario:'insufficient',  similarity:0.31 },
  { id:35, label:'Public Domain Archive Footage',                 hash:'4b7d0f3c',source:'YouTube',   scenario:'any',           similarity:0.56 },
  { id:36, label:'User Tutorial — Screen Recording',              hash:'7e0a3c6f',source:'Facebook',  scenario:'any',           similarity:0.61 },
  { id:37, label:'Sports Highlights Compilation — Fair Use',      hash:'0c3f6a9d',source:'TikTok',    scenario:'any',           similarity:0.58 },
  { id:38, label:'Podcast Audio Clip — Commentary',               hash:'3f6b9d2a',source:'Telegram',  scenario:'any',           similarity:0.54 },
];

module.exports = { REAL_DATASET };

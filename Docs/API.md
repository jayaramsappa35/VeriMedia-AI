# VeriMedia AI — API Reference

Base URL: `http://localhost:3000/api`

---

## `GET /health`

Health check.

**Response:**
```json
{
  "status": "ok",
  "service": "VeriMedia AI",
  "version": "1.0.0",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "ai": true,
  "uptime": 120
}
```

---

## `POST /analyze`

Run the full detection pipeline on a piece of content.

### JSON Body (demo/scenario mode):
```json
{
  "scenario": "crop",
  "fileName": "my-video.mp4",
  "fileSize": 1048576,
  "contentType": "video"
}
```

### Multipart (real file upload):
```
POST /api/analyze
Content-Type: multipart/form-data

file: [binary]
scenario: crop
```

### Scenarios
| Value | Description |
|---|---|
| `crop` | Cropped/reframed content |
| `deepfake` | AI-manipulated face/voice |
| `news` | News broadcast re-upload |
| `entertainment` | Licensed entertainment content |
| `manipulated` | Speed/audio/color altered |
| `insufficient` | Low-confidence match |
| `any` | Generic/unknown |

### Response:
```json
{
  "decision": "TAKEDOWN",
  "trust_score": 0.78,
  "similarity_score": 0.82,
  "integrity_score": 0.61,
  "viral_score": 0.54,
  "reasoning": [
    "Embedding similarity exceeds 85% — strong content match",
    "Moderate integrity anomaly — possible re-encoding"
  ],
  "dmca_ready": true,
  "matches": [
    {
      "platform": "YouTube",
      "timestamp": "6h ago",
      "similarity": 0.62,
      "icon": "▶",
      "url": "https://youtube.com/watch?v=abc123",
      "views": 42000,
      "likes": 1800,
      "shares": 450
    }
  ],
  "topMatches": [
    {
      "label": "IPL Match Highlights — Mumbai Indians vs CSK",
      "source": "YouTube",
      "scenario": "sports",
      "similarity": 82
    }
  ],
  "aiExplanation": "Your content shows a strong 82% similarity match...",
  "analysisId": "uuid-here",
  "processedAt": "2025-01-01T00:00:00.000Z"
}
```

---

## `POST /dmca/generate`

Generate a DMCA takedown notice.

### Body:
```json
{
  "ownerHandle": "John Creator",
  "platform": "YouTube",
  "infringingUrl": "https://youtube.com/watch?v=xxx",
  "originalUrl": "https://youtube.com/watch?v=original",
  "analysisData": {
    "decision": "TAKEDOWN",
    "similarity_score": 0.82,
    "trust_score": 0.78
  }
}
```

### Response:
```json
{
  "caseId": "VMA-A1B2C3D4",
  "platform": "YouTube",
  "contactEmail": "copyright@youtube.com",
  "timestamp": "Mon, 01 Jan 2025 00:00:00 GMT",
  "notice": "DIGITAL MILLENNIUM COPYRIGHT ACT...",
  "similarity": 82,
  "decision": "TAKEDOWN",
  "aiNarrative": "AI-enhanced legal narrative..."
}
```

---

## `POST /dmca/bulk`

Generate DMCA notices for multiple platforms.

### Body:
```json
{
  "ownerHandle": "John Creator",
  "matches": [
    { "platform": "YouTube", "url": "https://youtube.com/watch?v=xxx" },
    { "platform": "Instagram", "url": "https://instagram.com/p/yyy" }
  ],
  "analysisData": { "decision": "TAKEDOWN", "similarity_score": 0.82 }
}
```

---

## `GET /dataset`

List all reference dataset assets.

### Response:
```json
{
  "total": 40,
  "preSeeded": 38,
  "userUploaded": 2,
  "assets": [...]
}
```

---

## `POST /dataset/register`

Register a new asset to the reference dataset.

### Body:
```json
{
  "label": "My Original Video",
  "contentType": "entertainment",
  "tags": ["movie", "original"],
  "fileName": "my-video.mp4",
  "fileSize": 10485760,
  "ownership": true
}
```

---

## `POST /export/analysis`

Generate a structured evidence export package.

---

## Error Responses

All errors return:
```json
{
  "error": "Human-readable error message"
}
```

| Code | Meaning |
|---|---|
| 400 | Bad request / missing required field |
| 413 | File too large |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

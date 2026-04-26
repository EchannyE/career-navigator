# Career Coach Navigator ⚡

> **3MTT Mentorship Programme · Cohort 2 · Generative AI Track**  
> Mentor: Saviour Henry · Team Alpha · Project P5

An AI-powered career coaching web application that scrapes job listings, compares them against a candidate's resume, and generates a personalised skill gap analysis and learning roadmap using a 3-chain Gemini AI pipeline — all automated through n8n.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [n8n Workflow](#n8n-workflow)
- [Frontend Screens](#frontend-screens)
- [AI Pipeline — 3-Chain Design](#ai-pipeline--3-chain-design)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Career Coach Navigator solves a real problem: job seekers don't know exactly what skills they're missing for a specific role or what to do about it.

A candidate pastes their resume and a job URL into the app. The system:

1. Scrapes the job listing page
2. Extracts the clean job description using AI (Chain 1)
3. Compares the resume against the job and scores the match (Chain 2)
4. Generates a prioritised, resource-linked learning roadmap (Chain 3)
5. Logs every report to a Google Sheet for tracking

The backend is a fully automated **n8n workflow** — no Express server, no traditional backend code.

---

## Live Demo

| Layer | URL |
|---|---|
| Frontend | `https://career-coach-navigator.vercel.app` |
| n8n Webhook | `https://your-n8n-instance.cloud/webhook/your-id` |

---

## Features

- **Job URL scraping** — fetches live job listings from Lever, Greenhouse, LinkedIn, and similar platforms
- **Manual paste fallback** — for JS-rendered pages (Google, Amazon, Meta) that block scrapers
- **3-chain AI pipeline** — three sequentially chained Gemini prompts at different temperatures for extraction, analysis, and planning
- **Match score ring** — animated SVG gauge showing 0–100% match with colour-coded feedback
- **Gap analysis** — matched skills, skill gaps, experience gaps, and missing keywords
- **Action plan** — high/medium priority skills with specific free learning resources and time estimates
- **Google Sheets logging** — every analysis is appended as a row to a shared spreadsheet
- **Dark / light mode** — persisted to `localStorage`, toggleable from the header
- **Report download** — exports the full analysis as a `.txt` file
- **Responsive layout** — desktop-first design built with Tailwind CSS

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS v3 | Utility-first styling |
| Bricolage Grotesque | Display / heading font |
| DM Sans | Body font |
| DM Mono | Monospace / code font |

### Backend (Automation)
| Technology | Purpose |
|---|---|
| n8n | Workflow automation platform |
| Google Gemini 2.0 Flash | AI language model (all 3 chains) |
| Google Sheets API | Report logging |
| HTTP Request Node | Job page scraping |

---

## Architecture

```
[React Frontend]
       │
       │  POST { resume, jobUrl }
       ▼
[n8n Chat Trigger Webhook]
       │
       ▼
[HTTP Request Node]  ──── GET ────▶  Job listing URL
       │
       │  raw HTML
       ▼
[Chain 1 — Job Content Extractor]  (Gemini, temp 0.2)
       │  JOB TITLE, COMPANY NAME, JOB DESCRIPTION
       ▼
[Chain 2 — Gap Analyzer]  (Gemini, temp 0.4)
       │  MATCH SCORE, MATCHED SKILLS, SKILL GAPS,
       │  EXPERIENCE GAPS, MISSING KEYWORDS, ASSESSMENT
       ▼
[Chain 3 — Action Plan Generator]  (Gemini, temp 0.7)
       │  HIGH PRIORITY, MEDIUM PRIORITY, QUICK WINS,
       │  RESUME TIPS, ENCOURAGEMENT
       ▼
[Code Node — Assemble Report]
       │
       ├──▶  [Google Sheets — Append Row]
       │
       └──▶  JSON response to frontend
```

---

## Project Structure

```
career-coach-navigator/
│
├── career-coach-frontend/              # React + Tailwind frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx                    # React 18 entry point
│       ├── App.jsx                     # Root — wires hooks to screens
│       │
│       ├── constants/
│       │   └── index.js                # Screens, steps, tabs, score bands, model config
│       │
│       ├── styles/
│       │   └── globals.css             # Tailwind directives + @layer components
│       │
│       ├── api/
│       │   └── coachApi.js             # callClaude(), fetchJobPage(), callN8nWebhook()
│       │
│       ├── hooks/
│       │   ├── useAnalysis.js          # Pipeline logic, form state, chain orchestration
│       │   └── useDarkMode.js          # Dark/light toggle + localStorage persistence
│       │
│       ├── utils/
│       │   ├── reportParser.js         # Parse raw AI text → clean JS objects
│       │   └── downloadReport.js       # Browser file download utility
│       │
│       └── components/
│           ├── layout/
│           │   ├── Layout.jsx          # Full-viewport wrapper
│           │   └── Header.jsx          # Sticky nav — logo, dark toggle, right slot
│           │
│           ├── ui/                     # Reusable primitives (zero business logic)
│           │   ├── Button.jsx          # Primary and ghost variants
│           │   ├── Card.jsx            # Surface card with optional accent border
│           │   ├── Tag.jsx             # Pill badge with dynamic color
│           │   ├── BulletList.jsx      # Styled bullet point list
│           │   ├── ScoreRing.jsx       # Animated SVG circular gauge
│           │   └── SectionLabel.jsx    # Uppercase eyebrow label
│           │
│           └── features/              # Screen-level feature components
│               ├── InputForm/
│               │   ├── ResumeInput.jsx
│               │   ├── JobInput.jsx
│               │   └── InputForm.jsx
│               ├── Processing/
│               │   └── ProcessingView.jsx
│               └── Results/
│                   ├── OverviewTab.jsx
│                   ├── TextTabs.jsx    # GapAnalysisTab, ActionPlanTab, FullReportTab
│                   └── ResultsDashboard.jsx
│
└── career-coach-navigator-workflow.json  # n8n workflow — import directly into n8n
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- An n8n instance (cloud or self-hosted)
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com)
- A Google Sheet with the columns below (for logging)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/career-coach-navigator.git
cd career-coach-navigator
```

### 2. Install frontend dependencies

```bash
cd career-coach-frontend
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values (see [Environment Variables](#environment-variables) below).

### 4. Start the development server

```bash
npm run dev
# Frontend runs at http://localhost:5173
```

### 5. Import the n8n workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Select `career-coach-navigator-workflow.json`
4. In the workflow, replace the placeholder credential IDs:
   - `REPLACE_WITH_YOUR_GEMINI_CREDENTIAL_ID` (3 Gemini sub-nodes)
   - `REPLACE_WITH_YOUR_SHEETS_CREDENTIAL_ID` (Google Sheets node)
   - `REPLACE_WITH_YOUR_SPREADSHEET_ID` (Google Sheets node)
5. Activate the workflow
6. Copy the **Chat Trigger webhook URL** and add it to your `.env` as `VITE_N8N_WEBHOOK_URL`

---

## Environment Variables

Create a `.env` file in `career-coach-frontend/` with the following:

```env
# ── n8n Webhook ──────────────────────────────────────────────────────────────
# Your n8n Chat Trigger public webhook URL
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.cloud/webhook/your-webhook-id
```

> **Note:** All variables must be prefixed with `VITE_` to be exposed to the Vite build.

---

## n8n Workflow

The file `career-coach-navigator-workflow.json` contains the complete n8n workflow. Import it directly into n8n — no manual node wiring required.

### Nodes

| # | Node | Type | Role |
|---|---|---|---|
| 1 | Chat Trigger | `chatTrigger` | Public webhook — receives resume + job URL |
| 2 | HTTP Request — Job Page Scraper | `httpRequest` | GET request to scrape the job listing HTML |
| 3 | Chain 1 — Job Content Extractor | `chainLlm` | Strips HTML and extracts structured job info |
| 4 | Gemini — Job Extractor | `lmChatGoogleGemini` | temp `0.2`, 1024 tokens |
| 5 | Chain 2 — Gap Analyzer | `chainLlm` | Compares resume vs job, outputs match score |
| 6 | Gemini — Gap Analyzer | `lmChatGoogleGemini` | temp `0.4`, 1500 tokens |
| 7 | Chain 3 — Action Plan Generator | `chainLlm` | Builds prioritised learning roadmap |
| 8 | Gemini — Action Plan | `lmChatGoogleGemini` | temp `0.7`, 2000 tokens |
| 9 | Code Node — Prepare Final Output | `code` | Assembles structured report JSON |
| 10 | Google Sheets — Append Row | `googleSheets` | Logs the report to a tracking spreadsheet |

### Google Sheets setup

Create a sheet named **Career Coach Log** with these headers in Row 1:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Timestamp | Job Title | Company | Job URL | Match Score | Full Report |

---

## Frontend Screens

### Screen 1 — Input
- Hero heading with gradient text
- Resume textarea with character counter
- Job URL input with URL/paste toggle
- Amber warning tip for JS-rendered pages
- Optional paste fallback when using URL mode
- Primary CTA button with glow shadow

### Screen 2 — Processing
- Animated spinner ring with logo centre
- Live 4-step chain tracker (Queued / Running / Done)
- Progress bar filling as each step completes
- Step labels with colour-coded status badges

### Screen 3 — Results Dashboard
- Animated SVG score ring (green / amber / red by threshold)
- Job title, company name, and overall assessment
- Three stat tiles: Matched · Gaps · Keywords
- Four-tab navigation:
  - **Overview** — 2×2 grid of matched skills, gaps, keywords, experience gaps
  - **Gap Analysis** — full raw Chain 2 output
  - **Action Plan** — full raw Chain 3 output
  - **Full Report** — combined report with download button
- Run Another Analysis and Download buttons

---

## AI Pipeline — 3-Chain Design

The pipeline uses **prompt chaining** — each chain's output is the next chain's input.

### Chain 1 — Job Content Extractor
- **Temperature:** `0.2` (low — precise factual extraction)
- **Max tokens:** `1024`
- **Input:** Raw HTML from the scraped job page
- **Output:** Structured text with `JOB TITLE`, `COMPANY NAME`, `JOB DESCRIPTION`

### Chain 2 — Gap Analyzer
- **Temperature:** `0.4` (medium — analytical and balanced)
- **Max tokens:** `1500`
- **Input:** Candidate resume + Chain 1 output
- **Output:** `MATCH SCORE`, `MATCHED SKILLS`, `SKILL GAPS`, `EXPERIENCE GAPS`, `MISSING KEYWORDS`, `OVERALL ASSESSMENT`

### Chain 3 — Action Plan Generator
- **Temperature:** `0.7` (higher — creative and motivating)
- **Max tokens:** `2000`
- **Input:** Chain 2 output
- **Output:** `HIGH PRIORITY` skills, `MEDIUM PRIORITY` skills, `QUICK WINS`, `RESUME IMPROVEMENT TIPS`, `ENCOURAGEMENT`

---

## Separation of Concerns (SOC)

The frontend enforces strict layer separation:

| Layer | File(s) | Responsibility |
|---|---|---|
| API | `api/coachApi.js` | All `fetch()` calls — nothing else |
| Business Logic | `hooks/useAnalysis.js` | Pipeline orchestration, validation, state |
| Theme | `hooks/useDarkMode.js` | Dark/light toggle + localStorage |
| Parsing | `utils/reportParser.js` | Extract fields from raw AI text |
| Download | `utils/downloadReport.js` | File download DOM side-effect |
| Constants | `constants/index.js` | All magic strings, config values |
| UI Primitives | `components/ui/` | Rendering only — zero logic |
| Feature Screens | `components/features/` | Composition only — receive props, render |
| Root | `App.jsx` | Wires hooks to screens — no logic, no styling |

---

## Deployment

### Frontend → Vercel

```bash
# Build
cd career-coach-frontend
npm run build

# Deploy via Vercel CLI
npx vercel --prod
```

Or connect the GitHub repository to Vercel and set the root directory to `career-coach-frontend/`. Add `VITE_N8N_WEBHOOK_URL` in the Vercel dashboard under **Settings → Environment Variables**.

### n8n Workflow → n8n Cloud

1. Go to [n8n.io](https://n8n.io) and create a free cloud account
2. Create a new workflow and import `career-coach-navigator-workflow.json`
3. Connect your Google Gemini and Google Sheets credentials
4. Activate the workflow — n8n will provide a public webhook URL
5. Add that URL to your Vercel environment as `VITE_N8N_WEBHOOK_URL`

---

## Known Limitations

- **JS-rendered job pages** — sites like Google Careers, Amazon Jobs, and Meta Careers render listings client-side. The HTTP scraper receives empty HTML. Solution: use the manual paste fallback.
- **Rate limits** — Gemini free-tier has request quotas. Errors from quota exhaustion surface as `Analysis failed` in the UI.
- **Google Sheets append** — if the Sheets credential is invalid, the append step fails silently. The analysis still returns successfully to the user.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow the existing file and naming conventions, and keep each file's responsibility to a single concern.

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Acknowledgements

- [3MTT Nigeria](https://3mtt.nitda.gov.ng) — for the mentorship programme framework
- [Saviour Henry](https://github.com/saviour-henry) — Team Alpha mentor
- [Google AI Studio](https://aistudio.google.com) — Gemini 2.0 Flash API
- [n8n](https://n8n.io) — workflow automation platform
- [Anthropic Claude](https://anthropic.com) — development assistance

---

<div align="center">
  <strong>Career Coach Navigator</strong> · Built for 3MTT Cohort 2 · Generative AI Track<br/>
  Made with ⚡ by Team Alpha
</div>

# ClearHealth

ClearHealth is an agentic patient-advocate prototype that helps users ingest medical data, simulate multi-step analysis, and review a structured health report with a conversational assistant interface.

The app currently focuses on polished product UX and interaction flow. It uses mock analysis output in the frontend and is ready to be extended with real OCR, document parsing, retrieval, and Gemini-backed responses.

## Overview

ClearHealth implements a 3-stage user journey:

1. Data ingestion: users can paste report text, upload files, or capture an image.
2. Agentic processing: users see a staged analysis pipeline.
3. Insight dashboard: users review key metrics and ask questions in a chat interface.

This repository is a Vite + React + TypeScript app with Tailwind CSS 4.

## Current Status

This build is a frontend prototype.

- The analysis report and metric values are mocked in code.
- Chat answers are simulated with keyword-based logic.
- The environment variable `GEMINI_API_KEY` is wired in Vite config for future API integration, but no live Gemini request is currently executed.

## Key Features

- Medical data intake with text entry and multi-file upload.
- Optional camera capture flow for document images.
- Multi-step processing UI to represent orchestration stages.
- Report dashboard with flagged vs normal health markers.
- Consultation-style chat panel with suggestion chips.
- Responsive layout for desktop and mobile.

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Lucide React (icons)
- Motion (installed, available for richer animation)
- Google GenAI SDK dependency included for future model integration

## Project Structure

```text
.
├─ index.html
├─ metadata.json
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ .env.example
└─ src/
   ├─ App.tsx
   ├─ main.tsx
   └─ index.css
```

## Application Architecture

The primary UI is contained in `src/App.tsx` and organized into local view components:

- `App`: top-level view state controller.
- `IngestionView`: input form, file attach/camera capture, start trigger.
- `ProcessingView`: timed step progression to mimic multi-agent analysis.
- `DashboardView`: split layout with report and chat context.
- `ChatInterface`: local message history and simulated assistant responses.

### State and Flow

- `view` state controls progression: `ingestion -> processing -> dashboard`.
- `IngestionView` tracks free text and selected files.
- `ProcessingView` advances through 4 staged tasks using `setTimeout`.
- `ChatInterface` appends user/agent messages and renders typing state.

## Environment Variables

Copy from `.env.example` and create a local environment file (for example, `.env.local`).

### Required

- `GEMINI_API_KEY`
  - Used for Gemini API calls once backend/client integration is implemented.
  - In AI Studio, this can be provided via the Secrets panel.

### Platform-Injected (AI Studio)

- `APP_URL`
  - Runtime URL of the hosted app/service.
  - Useful for callbacks, self-links, and API endpoint construction.

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 LTS recommended)
- npm

### Install

```bash
npm install
```

### Configure env

macOS/Linux:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Then set:

```dotenv
GEMINI_API_KEY="your_key_here"
APP_URL="http://localhost:3000"
```

### Run development server

```bash
npm run dev
```

Default local URL: `http://localhost:3000`

## Available Scripts

- `npm run dev`: starts Vite dev server on `0.0.0.0:3000`.
- `npm run build`: creates production bundle in `dist/`.
- `npm run preview`: previews the production build locally.
- `npm run lint`: runs TypeScript type-check (`tsc --noEmit`).
- `npm run clean`: removes `dist/` (currently uses `rm -rf`, which is Unix-style).

## Deployment

### AI Studio

This app is compatible with AI Studio app hosting. Configure secrets there (notably `GEMINI_API_KEY`) and deploy through AI Studio workflow.

### Generic Static Hosting

You can also deploy the built `dist/` output to platforms like:

- Firebase Hosting
- Vercel (static output)
- Netlify
- Cloudflare Pages

Build command:

```bash
npm run build
```

Publish directory: `dist`

## Extending to Real AI Workflows

Suggested next implementation steps:

1. Replace mocked report data with parsed output from uploaded files.
2. Add OCR/document extraction pipeline for images and PDFs.
3. Integrate Gemini API calls with structured JSON output for health metrics.
4. Add retrieval context to improve chat grounding and explainability.
5. Move sensitive API operations to a backend service layer.
6. Add validation, error handling, and medical safety disclaimers.

## Known Limitations

- No production backend in this repository.
- No persisted user sessions or storage.
- No real LLM inference in current UI behavior.
- `clean` script is not Windows-native as written.

## License

No license file is currently included. Add a `LICENSE` file if you plan to distribute this project.

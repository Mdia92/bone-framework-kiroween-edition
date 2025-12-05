# Bone Framework – Kiroween Edition 🎃🦴

**One undead SOP skeleton. Two digital daemons. Zero forgotten rituals.**

Bone Framework – Kiroween Edition is a **Skeleton Crew** project for the Kiroween hackathon.  
It turns chaotic operational knowledge (incidents, onboarding, etc.) into **structured rituals** powered by a shared SOP skeleton.

- **Spine** → a shared SOP schema and AI pipeline (Bone Framework).
- **Ribs** → pluggable modules like incident response and onboarding.
- **Bone marrow** → an AI layer (Amazon Bedrock) that can synthesize SOPs from raw text.
- **Digital daemons** → small, focused apps built on the same skeleton.

This repo ships **two apps from one skeleton**:

1. **Incident Exorcist** – turns messy incident threads into structured incident runbooks.  
2. **Onboarding Ritual** – weaves 30/60/90 day onboarding plans from a simple role description.

The UI is fully Kiroween-themed: skulls, summoning circles, ghosts, X-Ray bone health, and ritual simulators – while staying usable for real SRE / ops teams.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Apps](#apps)
  - [Incident Exorcist](#incident-exorcist)
  - [Onboarding Ritual](#onboarding-ritual)
- [LLM Usage](#llm-usage)
- [How Kiro Was Used](#how-kiro-was-used)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone & Install](#clone--install)
  - [Environment Variables](#environment-variables)
  - [Run Dev Servers](#run-dev-servers)
- [Project Structure](#project-structure)
- [What’s Next](#whats-next)
- [License](#license)

---

## Architecture Overview

This repo is a **TypeScript monorepo** built around a reusable Bone Framework:

- `packages/bone-framework`  
  Core SOP skeleton:
  - Shared SOP types
  - Classifier → Synthesizer → Validator pipeline
  - AI integration and safe fallback logic

- `packages/shared`  
  Shared interfaces/types (`SOP`, `SOPStep`, `SOPCategory`, `RawInput`, `DigitalDaemonConfig`).

- `apps/incident-exorcist`  
  Web app that uses the skeleton for **incident** SOPs.

- `apps/onboarding-ritual`  
  Web app that uses the same skeleton for **onboarding** SOPs.

- `.kiro/`  
  Kiro configuration:
  - Specs (`.kiro/specs`) – define the SOP “spine” and modules.
  - Steering docs (`.kiro/steering`) – enforce the skeleton + Halloween metaphor.
  - Hooks (`.kiro/hooks`) – automate docs sync and workflows.
  - MCP settings (`.kiro/settings`) – filesystem MCP integration for live file access.

---

## Apps

### Incident Exorcist

**Use case:** recurring incidents with tribal knowledge (e.g. “DB latency spike – api-prod”).

**Flow:**

1. Paste a messy incident thread (PagerDuty/Slack-style) into the **Summoning Circle**.
2. Click **“Summon SOP”**.
3. The Bone Framework creates a structured SOP with:
   - Context & triggers
   - Steps with owners and estimated durations
   - Guardrails (“never restart the DB during business hours”)
   - X-Ray Mode (bone health / fallback status)
   - “Ghosts of Incidents Past” – previous SOP versions

When AI is enabled, you’ll see `[LLM]` in the SOP title.  
When running in stub mode, you’ll see `[STUB]` and a friendly fallback message.

---

### Onboarding Ritual

**Use case:** onboarding a new hire (e.g. Junior SRE) without reinventing the plan each time.

**Flow:**

1. Fill in:
   - Role
   - Tools & access
   - Success goals
2. Click **“Cast Onboarding Ritual”**.
3. The Bone Framework generates a **30 / 60 / 90 day onboarding SOP**, with:
   - Phases: First 30 days, Days 31–60, Days 61–90
   - Owners (New Hire / Buddy / Manager)
   - Required artifacts (e.g. merged PR, published runbook)
4. A **Ritual Simulator** lets you step through each action and artifact one by one.

Again, AI-based rituals are marked `[LLM]`, and stub-mode outputs are clearly labeled as `[STUB]` with “Fallback Mode: No API key detected”.

---

## LLM Usage

Bone Framework has an **optional AI “bone marrow”** that runs through Amazon Bedrock.

- The core pipeline calls `callLLMForSOP({ rawInputText, mode })` when LLM mode is available.
- The model is expected to return **JSON only**, matching the shared SOP schema.
- The UI marks these as `[LLM]` in the SOP title.

**No credentials set? No problem.**

- If there is no valid Bedrock configuration (or calls fail), the pipeline:
  - Logs a short warning
  - Falls back to deterministic `[STUB]` SOPs
- The UI clearly shows:
  - `STABLE SKELETON (Fallback Mode)`
  - `🎃 Fallback Mode: No API key detected`
- This means:
  - Judges and users can run the app **without any AWS setup**.
  - The skeleton remains fully usable even without live AI calls.

Configuration details are controlled via environment variables (see [Environment Variables](#environment-variables)).

---

## How Kiro Was Used

This project is intentionally built to showcase **Kiro as the “necromancer” of the skeleton**.

**Vibe coding**

- Monorepo scaffolding (apps + packages)
- React UIs for Incident Exorcist and Onboarding Ritual
- The AI pipeline structure and interfaces

were all iterated via **natural language chats** with Kiro.

**Spec-driven development**

- `.kiro/specs` defines the **SOP spine**:
  - shared schema
  - modules for incidents and onboarding
- Kiro used these specs to generate and refactor TypeScript code safely.
- This made it easy to grow multiple apps from a single skeleton.

**Steering docs**

- `.kiro/steering/project.md` encodes the metaphor:
  - spine, ribs, bone marrow, digital daemons, rituals
- This ensures Kiro’s responses stay thematically consistent (Kiroween tone + Skeleton Crew structure).

**Agent hooks**

- A hook (e.g. in `.kiro/hooks`) watches `packages/bone-framework/core/pipeline.ts`.
- On changes, Kiro:
  - Re-reads the pipeline
  - Updates `docs/ARCHITECTURE.md`
- Result: architecture docs stay aligned with the actual skeleton implementation.

**MCP filesystem integration**

- `.kiro/settings/mcp.json` wires in a **filesystem MCP server**.
- This allows Kiro to:
  - Read project files directly
  - Cross-reference code, docs, and future runbooks as live context

Kiro wasn’t just used to write snippets – it was used to grow and maintain the entire skeleton.

---

## Tech Stack

- **Languages**  
  - TypeScript  
  - JavaScript  
  - HTML  
  - CSS  

- **Frontend**  
  - React (TypeScript SPA for both apps)  
  - Vite (dev server + bundler)  

- **Runtime / Tooling**  
  - Node.js  
  - npm  

- **AI & Dev Tools**  
  - Kiro (AI IDE: vibe coding, specs, steering, hooks, MCP)  
  - Model Context Protocol (MCP) – filesystem server for live context  
  - Amazon Bedrock (optional, for LLM-based SOP generation)

---

## Getting Started

### Prerequisites

- **Node.js** (LTS, e.g. 18+)
- **npm**

### Clone & Install

```bash
git clone https://github.com/YOUR-USERNAME/bone-framework-kiroween-edition.git
cd bone-framework-kiroween-edition
npm install
Environment Variables

By default, the apps run in stub mode with deterministic SOPs and no external AI calls.

To enable live LLM SOP generation via Amazon Bedrock, create a .env.local file at the project root:

AWS_REGION=YOUR_AWS_REGION_HERE
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID_HERE
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY_HERE


Important: Do not commit .env.local.
Use .env.example as a reference template.

If these variables are missing or invalid, the UI will fall back gracefully and clearly label outputs as [STUB] and “Fallback Mode: No API key detected”.

Run Dev Servers

To run the development server (both apps are served via the main Vite entry):

npm run dev


Then open the printed URL (usually http://localhost:5173) in your browser.

From the landing page, you can open:

Incident Exorcist

Onboarding Ritual

Project Structure

High-level file structure:

.
├─ .kiro/
│  ├─ specs/
│  ├─ steering/
│  ├─ hooks/
│  └─ settings/
├─ apps/
│  ├─ incident-exorcist/
│  │  ├─ IncidentApp.tsx
│  │  └─ api.ts
│  └─ onboarding-ritual/
│     ├─ OnboardingApp.tsx
│     └─ api.ts
├─ packages/
│  ├─ bone-framework/
│  │  ├─ core/
│  │  │  ├─ interfaces.ts
│  │  │  └─ pipeline.ts
│  │  ├─ hooks/
│  │  └─ services/
│  └─ shared/
│     └─ types.ts
├─ docs/
│  ├─ README.md
│  └─ ARCHITECTURE.md
├─ index.tsx
├─ index.html
├─ index.css
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ .env.example

What’s Next

Some obvious next “ribs” and organs for this skeleton:

Automatic ingestion instead of copy-paste
Use real connectors (Slack incident channels, ops email inboxes, PDFs, wikis) to feed RawInput automatically.

More modules on the same spine
Change management rituals, maintenance playbooks, compliance checks – all as additional SOP modules.

Smarter digital daemons
Move from passive guidance to safe tool calls:

Open / update tickets

Attach relevant metrics

Propose SOP revisions after each run

Multi-tenant SaaS skeleton
Turn this into a hosted skeleton where teams can:

Manage their own grimoires

Share rituals across squads

Use Kiro to keep code, SOPs, and docs in sync as systems evolve.

License

This project is licensed under the MIT License.
See the LICENSE
 file for details.

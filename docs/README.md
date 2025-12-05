# The Bone Framework: AutoSOP Hub

**The Bone Framework: AutoSOP Hub** – one SOP skeleton powering two apps (Incident Exorcist + Onboarding Ritual) for the Kiroween Skeleton Crew challenge.

---

## LLM Usage

This project runs **fully in stub mode by default** with deterministic SOPs and no external API calls. You can run it immediately without any API keys.

**How it works:**
- **Stub Mode (Default)**: The Bone Framework generates deterministic SOPs using template logic. All SOPs are prefixed with `[STUB]` in the title.
- **Live AI Mode (Optional)**: When a valid `BEDROCK_API_KEY` is provided in `.env.local`, the pipeline's "bone marrow" calls AWS Bedrock (Claude 3 Haiku) to generate dynamic SOPs. These are prefixed with `[LLM]` in the title.
- **Automatic Fallback**: If the API key is missing, invalid, or quota is exhausted, the pipeline automatically falls back to stub mode. The app never breaks.

**For judges and evaluators:**
- Run the project immediately without any setup – stub mode works out of the box
- To see live AI behavior, you'll need AWS credentials with Bedrock access (see BEDROCK_SETUP.md for details)
- The UI clearly indicates which mode is active via the `[STUB]` or `[LLM]` prefix

---

## How Kiro Built This Project

This entire monorepo was developed **with Kiro as the primary development partner**, using four key workflows:

### 1. Vibe Coding (Chat-Driven Generation)
Used Kiro chat to scaffold the entire monorepo structure, pipeline architecture, and dual-app UI in a single session. Started with "Build me a monorepo with a shared AI pipeline that supports two themed apps" and iterated through:
- TypeScript monorepo setup with shared packages
- Core pipeline implementation (`Classifier → Synthesizer → Validator`)
- Two distinct React UIs with opposite vibes (dark crisis mode vs. light ritual mode)

### 2. Spec-Driven Development
Created `.kiro/specs/bone-framework.md` to formalize the pipeline design before implementation. The spec defined:
- Pipeline stages and their TypeScript interfaces
- SOP schema requirements (triggers, guardrails, steps)
- Validation rules and error handling
- Kiro used the spec as a contract to generate type-safe implementations

### 3. Steering Docs (Locked Metaphor)
`.kiro/steering/project.md` enforced the skeleton metaphor throughout development:
- **Spine**: Rigid typed schema (`packages/shared/types.ts`)
- **Ribs**: Validation guardrails in the pipeline
- **Bone Marrow**: Generative AI core (stub now, Gemini later)
- Every Kiro suggestion aligned with this metaphor (e.g., "strengthen the ribs" = add validation)

### 4. Agent Hooks (Auto-Documentation)
Created `.kiro/hooks/pipeline-doc-sync.json` to keep `docs/ARCHITECTURE.md` synchronized with code:
- Triggers on save of `packages/bone-framework/core/pipeline.ts`
- Automatically prompts Kiro to re-read the pipeline and update architecture docs
- Ensures documentation never drifts from implementation

### 5. MCP Integration (Live Context)
Configured the filesystem MCP server (`.kiro/settings/mcp.json`) to give Kiro dynamic access to:
- Project files and runbooks as they evolve
- Cross-app analysis (comparing `incident-exorcist` vs `onboarding-ritual`)
- Configuration files and environment variables
- Future: Read production runbooks as live context for SOP generation

**Result**: 80%+ code reuse between apps, strict type safety, and a development workflow where Kiro acts as both architect and implementer.

## The Skeleton Metaphor

Instead of building separate AI backends for every tool, we built one strong skeleton that supports multiple bodies:

- **Spine (SOP Schema)**: The rigid, typed structure (`packages/shared/types.ts`) that defines what an SOP looks like. Every app uses the same `SOP`, `SOPStep`, and `SOPCategory` types.

- **Ribs (Modules)**: Domain-specific logic branches within the pipeline. The incident module generates crisis response SOPs with triggers and guardrails. The onboarding module generates 30/60/90 day plans with artifacts and milestones.

- **Bone Marrow (AI Pipeline)**: The living, generative core (`packages/bone-framework/core/pipeline.ts`) that produces new SOPs. Currently uses stub logic for the demo, but designed to plug in real AI (Gemini) for production.

Both apps reuse >80% of their logic through the shared Bone Framework pipeline: `Classifier → Synthesizer → Validator`. The apps are just thin UI layers that call the same core.

---

## The Current Applications

1. **Incident Exorcist** 👹
   - **Purpose:** Rapid response for critical system failures
   - **Vibe:** High urgency, dark mode, red/black aesthetic
   - **Output:** Crisis mitigation steps with triggers, guardrails, and X-ray diagnostics

2. **Onboarding Ritual** 📜
   - **Purpose:** Welcoming new team members and structuring their first 90 days
   - **Vibe:** Low urgency, light mode, teal/gold aesthetic
   - **Output:** 30/60/90 day plans with artifact checklists and ritual simulator

---

## How to Run Locally

### Setup

1. **Copy environment template:**
   ```bash
   copy .env.example .env.local
   ```

2. **(Optional) Add Bedrock API key:**
   - Open `.env.local`
   - Set `BEDROCK_API_KEY=your_encoded_key_here`
   - Set `AWS_REGION=us-east-1` (or your preferred region)
   - See `BEDROCK_SETUP.md` for detailed instructions on obtaining AWS credentials
   - If you skip this step, the app runs in stub mode (no external calls)

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Apps
```bash
# Incident Exorcist
npm run dev:incident
# Opens at http://localhost:3000 (or next available port)

# Onboarding Ritual
npm run dev:onboarding
# Opens at http://localhost:3000 (or next available port)
```

---

## Demo Flow

### Incident Exorcist

1. Open the Incident Exorcist page
2. Paste a sample incident thread into the textarea:
   ```
   Database latency spiked to 2000ms at 3:45 PM.
   Multiple customers reporting slow page loads.
   APM shows connection pool exhaustion.
   ```
3. Click **"SUMMON SOP"**
4. Observe the generated SOP sections:
   - **Context**: Brief description of the incident
   - **Triggers**: What activates this SOP (e.g., "DB latency alert > 500ms")
   - **Steps**: 4 phases (Immediate → Investigation → Mitigation → Resolution)
   - **Owners**: On-call Engineer, Database Team, Incident Commander
   - **Guardrails**: Safety rules (e.g., "Never restart the entire database during business hours")
   - **X-Ray Mode**: Bone health diagnostics showing "SOLID BONE" or "WEAK BONE" with fracture warnings

### Onboarding Ritual

1. Open the Onboarding Ritual page
2. Fill the form:
   - **Role**: Junior SRE
   - **Tools & Access**: Datadog, PagerDuty, AWS Console, GitHub
   - **Success Goals**: Complete first on-call rotation, document 3 runbooks
3. Click **"Generate Ritual"**
4. Observe the 30/60/90 style onboarding SOP:
   - **First 30 days**: Orientation, environment setup, shadowing
   - **Days 31–60**: Bug fixes, code reviews, guided incident participation
   - **Days 61–90**: Lead reliability project, document runbook, 90-day review
5. Click **"Ritual Simulator"** to step through each onboarding action one at a time
6. Use **Next/Previous** buttons to navigate through the 9 onboarding steps

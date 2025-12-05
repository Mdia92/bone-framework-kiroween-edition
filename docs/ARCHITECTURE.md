# Architecture: The Bone Framework

## Monorepo Structure

```
bone-framework-kiroween/
├── packages/
│   ├── bone-framework/          # The Skeleton (shared core logic)
│   │   ├── core/
│   │   │   ├── pipeline.ts      # Main pipeline: Classifier → Synthesizer → Validator
│   │   │   └── interfaces.ts    # TypeScript interfaces for pipeline components
│   │   ├── hooks/
│   │   │   └── useDigitalDaemon.ts
│   │   └── services/
│   │       └── geminiService.ts # AI integration (currently unused in stub mode)
│   └── shared/
│       └── types.ts             # Universal SOP schema (Spine)
├── apps/
│   ├── incident-exorcist/       # Body #1: Crisis response app
│   │   ├── api.ts               # API handler for incident SOPs
│   │   └── IncidentApp.tsx      # Dark mode UI with X-ray diagnostics
│   └── onboarding-ritual/       # Body #2: New hire onboarding app
│       ├── api.ts               # API handler for onboarding SOPs
│       └── OnboardingApp.tsx    # Light mode UI with ritual simulator
├── .kiro/                       # Kiro IDE configuration
└── docs/                        # Documentation
```

## Data Flow

The Bone Framework follows a strict unidirectional pipeline:

```
Raw Input (text)
    ↓
[Classifier] → Determines SOPCategory (INCIDENT | ONBOARDING)
    ↓
[Synthesizer] → Generates SOP based on category
    ↓         → Incident: triggers, guardrails, crisis steps
    ↓         → Onboarding: 30/60/90 phases, artifacts, milestones
    ↓
[Validator] → Checks structural integrity (steps, title, etc.)
    ↓
BonePipelineResult {
  sop: SOP,
  configUsed: DigitalDaemonConfig,
  validationErrors: string[],
  success: boolean
}
    ↓
Displayed in App UI
```

### Pipeline Components

**1. Classifier** (`StubClassifier`)
- **Input**: `RawInput` (text + context metadata)
- **Output**: `SOPCategory` (INCIDENT | ONBOARDING)
- **Current Implementation**: Stub logic that defaults based on forced category from API
- **Future**: LLM-based intent detection

**2. Synthesizer** (`StubSynthesizer`)
- **Input**: `RawInput`, `SOPCategory`, optional `DigitalDaemonConfig`
- **Action**: Branches by category to generate domain-specific SOPs
  - `generateIncidentSOP()`: Creates crisis response with triggers/guardrails
  - `generateOnboardingSOP()`: Creates 30/60/90 day plan with artifacts
- **Output**: Fully structured `SOP` object
- **Current Implementation**: Pure stub logic with hardcoded demo data
- **Future**: Calls `geminiService.ts` for real AI generation

**3. Validator** (`StubValidator`)
- **Input**: `SOP` object
- **Action**: Validates required fields (title, steps, etc.)
- **Output**: `{ valid: boolean, errors: string[] }`
- **Current Implementation**: Basic structural checks
- **Future**: Semantic validation (circular dependencies, safety checks)

## The Universal SOP Schema

Defined in `packages/shared/types.ts`, the `SOP` type is the spine that both apps share:

```typescript
interface SOP {
  id: string;
  title: string;
  category: SOPCategory;           // INCIDENT | ONBOARDING
  summary: string;                 // Context/description
  triggers: string[];              // What activates this SOP
  guardrails: string[];            // Safety rules
  steps: SOPStep[];                // Ordered actions
  generatedAt: string;
  tags: string[];
}

interface SOPStep {
  id: string;
  order: number;
  phase: string;                   // "Immediate" | "First 30 days" | etc.
  action: string;                  // The instruction
  owner: string;                   // Who performs it
  tools?: string[];
  estimatedDuration?: string;
  warning?: string;                // For incidents
  artifact?: string;               // For onboarding
}
```

## Application Integration

The apps are thin UI clients with no business logic about *how* SOPs are generated:

**Incident Exorcist** (`apps/incident-exorcist/`)
1. User pastes incident thread into textarea
2. `api.ts` calls `runBonePipeline(input, SOPCategory.INCIDENT)`
3. Receives `IncidentResponse` with SOP + bone health diagnostics
4. `IncidentApp.tsx` displays triggers, steps, guardrails, and X-ray mode

**Onboarding Ritual** (`apps/onboarding-ritual/`)
1. User fills form with role, tools, goals
2. `api.ts` calls `runBonePipeline(input, SOPCategory.ONBOARDING)`
3. Receives `SOP` with 30/60/90 day structure
4. `OnboardingApp.tsx` groups steps by phase and provides ritual simulator

This separation ensures >80% code reuse. Swapping the AI model or validation logic in `bone-framework` requires zero changes to the app UIs.

# Project Steering: The Kiroween Skeleton Crew

## The Goal
To prove that a single, well-architected AI pipeline (**The Skeleton**) can support multiple distinct, high-fidelity user experiences (**The Bodies**).

## The Metaphor

We are building a **Skeleton**.

*   **Spine (The Framework):** The central structural support. If this breaks, everything is paralyzed. It must be rigid and typed.
*   **Ribs (Guardrails):** Protection for vital organs. Validation logic that prevents the AI from hallucinating dangerous instructions.
*   **Bone Marrow (Generative AI):** The living tissue inside the bone that produces new cells (content). It is fluid and dynamic.

## Success Metrics

1.  **Code Reuse:** `apps/incident-exorcist` and `apps/onboarding-ritual` should share >80% of their logic.
2.  **Type Safety:** The input entering the AI and the output leaving it must be strictly typed. No `any` allowed in the pipeline.
3.  **Theme Separation:** The "Vibe" of the apps must be distinct. One shouldn't know the other exists.

## How Kiro Was Used

This project demonstrates **Kiro as a full-stack development partner**, not just a code generator:

### Vibe Coding (Chat-Driven Scaffolding)
- Generated the entire monorepo structure in one chat session
- Iterated on pipeline architecture through conversational refinement
- Created two distinct UI themes (dark crisis vs. light ritual) with opposite aesthetics
- **Key Insight**: Kiro maintained architectural consistency across 12+ files while adapting to vibe requests

### Spec-Driven Development
- `.kiro/specs/bone-framework.md` defined the pipeline contract before implementation
- Kiro used the spec to generate type-safe interfaces (`packages/bone-framework/core/interfaces.ts`)
- Spec enforced the `Classifier → Synthesizer → Validator` pattern across both apps
- **Key Insight**: Specs act as a "design lock" that prevents architectural drift during rapid iteration

### Steering Docs (Metaphor Enforcement)
- This file (`.kiro/steering/project.md`) locked in the skeleton metaphor
- Every Kiro suggestion aligned with spine/ribs/bone marrow terminology
- Prevented generic AI responses like "add error handling" → became "strengthen the ribs"
- **Key Insight**: Steering docs turn Kiro into a domain-specific expert for your project

### Agent Hooks (Auto-Documentation)
- `.kiro/hooks/pipeline-doc-sync.json` keeps `docs/ARCHITECTURE.md` synchronized with code
- Triggers on save of `packages/bone-framework/core/pipeline.ts`
- Automatically prompts Kiro to update docs when implementation changes
- **Key Insight**: Hooks eliminate documentation debt by making Kiro a proactive maintainer

### MCP Integration (Live Context)
- Filesystem MCP server (`.kiro/settings/mcp.json`) gives Kiro dynamic file access
- Used for cross-app analysis (comparing `incident-exorcist` vs `onboarding-ritual`)
- Future: Read production runbooks as live context for SOP generation
- **Key Insight**: MCP turns Kiro into a context-aware agent that grows with your codebase

## Future Roadmap

*   [ ] **Connect Real Muscles:** Replace Stub Classifiers with actual intent detection.
*   [ ] **Grow More Limbs:** Add a "Compliance Audit" app using the same skeleton.
*   [ ] **Nervous System:** Implement real-time streaming for SOP generation.

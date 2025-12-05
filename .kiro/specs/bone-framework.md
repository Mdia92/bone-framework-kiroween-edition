# Spec: Bone Framework Core

## 1. The SOP Schema

The Standard Operating Procedure (SOP) is the atomic unit of the system.

```typescript
interface SOP {
  id: string;
  title: string;
  category: 'INCIDENT' | 'ONBOARDING';
  summary: string;
  steps: SOPStep[];
  // Context specific
  triggers?: string[];   // Incident only
  guardrails?: string[]; // Incident only
  tags: string[];
}

interface SOPStep {
  phase: string;         // Grouping (e.g., "Immediate", "Day 30")
  action: string;        // The instruction
  owner: string;         // Role responsible
  warning?: string;      // Hazard flag
  artifact?: string;     // Output requirement
}
```

## 2. The AI Contract

The `Synthesizer` must adhere to the following contract:

1.  **Input:** Unstructured text + Category Context.
2.  **System Prompt:** Must enforce the role of "Digital Daemon".
3.  **Output:** Strict JSON. Markdown or free text is considered a failure.
4.  **Latency:** Target < 5s for generation.

## 3. Pipeline Stages

| Stage | Component | Responsibility | Status |
| :--- | :--- | :--- | :--- |
| 1 | Classifier | Identify intent from raw text | Stubbed |
| 2 | Synthesizer | Generate content via Gemini | **Active** |
| 3 | Validator | Ensure JSON schema compliance | Basic |

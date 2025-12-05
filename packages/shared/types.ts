// Shared domain types for the Bone Framework

export enum SOPCategory {
  INCIDENT = 'INCIDENT',
  ONBOARDING = 'ONBOARDING'
}

export interface DigitalDaemonConfig {
  temperature: number;
  model: string;
  maxTokens?: number;
}

export interface RawInput {
  content: string;
  context?: Record<string, any>; // JSON metadata
}

export interface SOPStep {
  id: string;
  order: number;
  phase: string; // e.g., "Containment", "Day 30"
  action: string;
  owner: string; // Role responsible
  tools?: string[];
  estimatedDuration?: string;
  warning?: string; // Critical for incidents
  artifact?: string; // Critical for onboarding
}

export interface SOP {
  id: string;
  title: string;
  category: SOPCategory;
  summary: string; // Description/Context
  triggers: string[]; // For Incidents
  guardrails: string[]; // For Incidents (Safety checks)
  steps: SOPStep[];
  generatedAt: string;
  tags: string[];
  source?: 'llm' | 'stub'; // Track whether this came from AI or fallback
}

import { runBonePipeline } from '../../packages/bone-framework/core/pipeline';
import { RawInput, SOPCategory, SOP } from '../../packages/shared/types';

export interface IncidentResponse {
  sop: SOP;
  boneHealth: {
    status: 'SOLID' | 'FRACTURED';
    diagnostics: string[];
  };
}

// In a real app, this would be an Express/Fastify route handler.
// POST /api/incidents/generate-sop
export const generateIncidentSOP = async (rawContext: string): Promise<IncidentResponse> => {
  console.log("[API] Received Incident Generation Request");
  
  try {
    const input: RawInput = {
      content: rawContext,
      context: { source: 'web-terminal', priority: 'high' }
    };

    const result = await runBonePipeline(input, SOPCategory.INCIDENT);
    
    // If pipeline failed, this shouldn't happen anymore since we have fallback in synthesizer
    if (!result.success || !result.sop) {
      console.warn("[API] Pipeline validation failed unexpectedly");
      const fallbackSOP: SOP = {
        id: `fallback-${Date.now()}`,
        title: '[STUB] Fallback Incident SOP',
        category: SOPCategory.INCIDENT,
        summary: 'This is a fallback SOP generated due to pipeline validation errors.',
        triggers: ['Manual trigger'],
        guardrails: ['Review before executing'],
        steps: [
          {
            id: 'step-0',
            order: 1,
            phase: 'Assessment',
            action: 'Review the incident details and gather initial information',
            owner: 'On-call Engineer',
            estimatedDuration: '5 minutes'
          }
        ],
        generatedAt: new Date().toISOString(),
        tags: ['fallback'],
        source: 'stub'
      };
      
      return {
        sop: fallbackSOP,
        boneHealth: {
          status: 'SOLID',
          diagnostics: []
        }
      };
    }

    // --- X-RAY DIAGNOSTICS (Simulated Backend Logic) ---
    const diagnostics: string[] = [];
    
    // Check Bone Density (Guardrails)
    if (!result.sop.guardrails || result.sop.guardrails.length < 2) {
      diagnostics.push("Weak bone density: Insufficient guardrails defined.");
    }
    
    // Check Structure (Steps)
    if (result.sop.steps.length < 3) {
      diagnostics.push("Hairline fracture: Procedure too short for incident class.");
    }
    
    // Check Cartilage (Triggers)
    if (!result.sop.triggers || result.sop.triggers.length === 0) {
      diagnostics.push("Structural integrity compromised: No activation triggers.");
    }

    const status = diagnostics.length > 0 ? 'FRACTURED' : 'SOLID';

    return {
      sop: result.sop,
      boneHealth: {
        status,
        diagnostics
      }
    };
  } catch (error) {
    console.error("[API] Unexpected error in generateIncidentSOP:", error);
    
    // Always return a valid response, never throw
    const emergencySOP: SOP = {
      id: `emergency-${Date.now()}`,
      title: '[STUB] Emergency Fallback SOP',
      category: SOPCategory.INCIDENT,
      summary: `An error occurred while generating the SOP. Input was: "${rawContext.substring(0, 100)}"`,
      triggers: ['System error'],
      guardrails: ['Investigate the error before proceeding'],
      steps: [
        {
          id: 'step-0',
          order: 1,
          phase: 'Emergency',
          action: 'Contact system administrator to investigate SOP generation failure',
          owner: 'On-call Engineer',
          estimatedDuration: '10 minutes',
          warning: 'SOP generation system is experiencing issues'
        }
      ],
      generatedAt: new Date().toISOString(),
      tags: ['emergency', 'error'],
      source: 'stub'
    };
    
    return {
      sop: emergencySOP,
      boneHealth: {
        status: 'SOLID',
        diagnostics: []
      }
    };
  }
};
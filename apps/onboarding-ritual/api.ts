import { runBonePipeline } from '../../packages/bone-framework/core/pipeline';
import { RawInput, SOPCategory, SOP } from '../../packages/shared/types';

// POST /api/onboarding/generate-plan
export const generateOnboardingPlan = async (role: string, tools: string, goals: string): Promise<SOP> => {
  console.log("[API] Received Onboarding Ritual Request");
  
  try {
    const rawContext = `
    Role: ${role}
    Tools Required: ${tools}
    Key Goals: ${goals}
  `;

    const input: RawInput = {
      content: rawContext,
      context: { source: 'ritual-form', type: 'new-hire' }
    };

    const result = await runBonePipeline(input, SOPCategory.ONBOARDING);
    
    // If pipeline failed, this shouldn't happen anymore since we have fallback in synthesizer
    if (!result.success || !result.sop) {
      console.warn("[API] Pipeline validation failed unexpectedly");
      const fallbackSOP: SOP = {
        id: `fallback-${Date.now()}`,
        title: `[STUB] Onboarding Plan for ${role}`,
        category: SOPCategory.ONBOARDING,
        summary: 'This is a fallback onboarding plan generated due to pipeline validation errors.',
        triggers: ['New hire start date'],
        guardrails: ['Complete orientation before system access'],
        steps: [
          {
            id: 'step-0',
            order: 1,
            phase: 'First 30 days',
            action: 'Complete initial orientation and setup',
            owner: 'New Hire',
            estimatedDuration: '1 week'
          }
        ],
        generatedAt: new Date().toISOString(),
        tags: ['fallback', 'onboarding'],
        source: 'stub'
      };
      
      return fallbackSOP;
    }

    return result.sop;
  } catch (error) {
    console.error("[API] Unexpected error in generateOnboardingPlan:", error);
    
    // Always return a valid SOP, never throw
    const emergencySOP: SOP = {
      id: `emergency-${Date.now()}`,
      title: `[STUB] Emergency Onboarding Plan for ${role}`,
      category: SOPCategory.ONBOARDING,
      summary: `An error occurred while generating the onboarding plan. Role: ${role}, Tools: ${tools}`,
      triggers: ['System error'],
      guardrails: ['Contact HR to investigate onboarding system issues'],
      steps: [
        {
          id: 'step-0',
          order: 1,
          phase: 'First 30 days',
          action: 'Contact HR and IT to manually set up onboarding process',
          owner: 'Hiring Manager',
          estimatedDuration: '1 day',
          warning: 'Onboarding system is experiencing issues'
        }
      ],
      generatedAt: new Date().toISOString(),
      tags: ['emergency', 'error', 'onboarding'],
      source: 'stub'
    };
    
    return emergencySOP;
  }
};

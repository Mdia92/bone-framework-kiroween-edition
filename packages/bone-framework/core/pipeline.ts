import { RawInput, SOPCategory, SOP, DigitalDaemonConfig, SOPStep } from '../../shared/types';
import { Classifier, Synthesizer, Validator, BonePipelineResult } from './interfaces';
import { callLLMForSOP } from '../services/llmClient';

// --- STEP GROUPING UTILITIES ---

/**
 * Groups fine-grained SOP steps into larger, meaningful chunks.
 * Ensures the final SOP has at most 12 steps while preserving phase structure.
 * 
 * Strategy:
 * - If steps <= 12, return as-is
 * - If steps > 12, merge similar steps within the same phase
 * - Preserve phase labels (First 30 days, Days 31-60, Days 61-90)
 */
function groupSOPSteps(steps: SOPStep[], maxSteps: number = 12): SOPStep[] {
  if (steps.length <= maxSteps) {
    return steps;
  }

  // Group steps by phase
  const phaseGroups = new Map<string, SOPStep[]>();
  steps.forEach(step => {
    const phase = step.phase || 'General';
    if (!phaseGroups.has(phase)) {
      phaseGroups.set(phase, []);
    }
    phaseGroups.get(phase)!.push(step);
  });

  // Calculate how many steps each phase should contribute
  const totalSteps = steps.length;
  const targetStepsPerPhase = new Map<string, number>();
  
  phaseGroups.forEach((phaseSteps, phase) => {
    const proportion = phaseSteps.length / totalSteps;
    const targetCount = Math.max(1, Math.round(proportion * maxSteps));
    targetStepsPerPhase.set(phase, targetCount);
  });

  // Adjust to ensure we don't exceed maxSteps
  let totalAllocated = Array.from(targetStepsPerPhase.values()).reduce((a, b) => a + b, 0);
  if (totalAllocated > maxSteps) {
    // Reduce from largest phases first
    const sortedPhases = Array.from(targetStepsPerPhase.entries())
      .sort((a, b) => b[1] - a[1]);
    
    while (totalAllocated > maxSteps) {
      for (const [phase, count] of sortedPhases) {
        if (count > 1 && totalAllocated > maxSteps) {
          targetStepsPerPhase.set(phase, count - 1);
          totalAllocated--;
        }
      }
    }
  }

  // Merge steps within each phase
  const groupedSteps: SOPStep[] = [];
  let globalOrder = 1;

  phaseGroups.forEach((phaseSteps, phase) => {
    const targetCount = targetStepsPerPhase.get(phase) || 1;
    const stepsPerGroup = Math.ceil(phaseSteps.length / targetCount);

    for (let i = 0; i < phaseSteps.length; i += stepsPerGroup) {
      const group = phaseSteps.slice(i, i + stepsPerGroup);
      
      if (group.length === 1) {
        // Single step, keep as-is
        groupedSteps.push({
          ...group[0],
          order: globalOrder++
        });
      } else {
        // Merge multiple steps
        const mergedStep: SOPStep = {
          id: `step-${globalOrder - 1}`,
          order: globalOrder++,
          phase: phase,
          action: group.map(s => s.action).join('; '),
          owner: group[0].owner,
          tools: Array.from(new Set(group.flatMap(s => s.tools || []))),
          estimatedDuration: group[0].estimatedDuration,
          warning: group.find(s => s.warning)?.warning,
          artifact: group.find(s => s.artifact)?.artifact
        };
        groupedSteps.push(mergedStep);
      }
    }
  });

  return groupedSteps.slice(0, maxSteps);
}

// --- STUB IMPLEMENTATIONS FOR FRAMEWORK SKELETON ---

class StubClassifier implements Classifier {
  async classify(input: RawInput): Promise<SOPCategory> {
    // TODO: Implement LLM-based intent detection
    // return ai.classify(input.content);
    console.log("StubClassifier: Defaulting to INCIDENT based on context clues (mock).");
    return SOPCategory.INCIDENT; 
  }
}

class StubSynthesizer implements Synthesizer {
  async synthesize(input: RawInput, category: SOPCategory, config?: DigitalDaemonConfig): Promise<SOP> {
    console.log(`StubSynthesizer: Synthesizing ${category} SOP...`);
    
    // Try LLM first, fall back to stub logic if it fails
    const mode = category === SOPCategory.ONBOARDING ? 'onboarding' : 'incident';
    
    try {
      console.log(`🎃 Synthesizer: Calling Gemini for ${mode}...`);
      console.log(`📝 Input content: "${input.content.substring(0, 100)}..."`);
      
      const llmSOP = await callLLMForSOP({ 
        rawInputText: input.content, 
        mode 
      });
      
      console.log(`✅ Synthesizer: Gemini returned SOP`);
      let sop = this.ensureSOPDefaults(llmSOP);
      
      // Post-process onboarding SOPs: group steps if > 12
      if (category === SOPCategory.ONBOARDING && sop.steps.length > 12) {
        console.log(`🎃 Synthesizer: Grouping ${sop.steps.length} steps into max 12 chunks...`);
        sop.steps = groupSOPSteps(sop.steps, 12);
        console.log(`✅ Synthesizer: Grouped to ${sop.steps.length} steps`);
      }
      
      return sop;
    } catch (error) {
      console.warn(`⚠️ Synthesizer: Gemini failed, falling back to stub mode`);
      console.warn(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Generate stub SOP based on category
      const id = crypto.randomUUID();
      const stubSOP = category === SOPCategory.INCIDENT 
        ? this.generateIncidentSOP(id, input)
        : this.generateOnboardingSOP(id, input);
      
      return stubSOP;
    }
  }

  /**
   * Ensures the SOP has all required fields with reasonable defaults
   */
  private ensureSOPDefaults(sop: SOP): SOP {
    return {
      ...sop,
      triggers: sop.triggers && sop.triggers.length > 0 ? sop.triggers : ['Manual trigger'],
      guardrails: sop.guardrails && sop.guardrails.length > 0 ? sop.guardrails : ['Follow standard safety procedures'],
      tags: sop.tags && sop.tags.length > 0 ? sop.tags : ['generated'],
      steps: sop.steps.map((step, idx) => ({
        ...step,
        id: step.id || `step-${idx}`,
        order: step.order || idx + 1,
        tools: step.tools && step.tools.length > 0 ? step.tools : ['Standard tools'],
        estimatedDuration: step.estimatedDuration || 'TBD'
      }))
    };
  }

  private generateIncidentSOP(id: string, input: RawInput): SOP {
    const steps: SOPStep[] = [
      {
        id: 'step-0',
        order: 1,
        phase: 'Immediate',
        action: 'Check database metrics and identify latency spike patterns',
        owner: 'On-call Engineer',
        tools: ['Datadog', 'CloudWatch', 'PgHero'],
        estimatedDuration: '5 minutes',
        warning: 'Do not restart services before collecting metrics'
      },
      {
        id: 'step-1',
        order: 2,
        phase: 'Investigation',
        action: 'Identify noisy tenant or problematic queries causing the spike',
        owner: 'Database Team',
        tools: ['pg_stat_statements', 'Query Analyzer'],
        estimatedDuration: '10 minutes'
      },
      {
        id: 'step-2',
        order: 3,
        phase: 'Mitigation',
        action: 'Restart connection pool or kill long-running queries',
        owner: 'On-call Engineer',
        tools: ['pgBouncer', 'pg_terminate_backend'],
        estimatedDuration: '5 minutes',
        warning: 'Verify no critical transactions are in progress'
      },
      {
        id: 'step-3',
        order: 4,
        phase: 'Resolution',
        action: 'Verify latency has returned to normal and document incident',
        owner: 'Incident Commander',
        tools: ['Incident.io', 'Confluence'],
        estimatedDuration: '15 minutes'
      }
    ];
    
    return {
      id,
      title: '[STUB] Database Latency Spike – Demo SOP',
      category: SOPCategory.INCIDENT,
      summary: `Generated from input: "${input.content.substring(0, 100)}${input.content.length > 100 ? '...' : ''}"`,
      triggers: [
        'DB latency alert > 500ms',
        'Customer reports slow page loads',
        'APM shows database as bottleneck'
      ],
      guardrails: [
        'Never restart the entire database during business hours',
        'Always collect metrics before making changes',
        'Notify #incidents channel before any production changes'
      ],
      steps,
      generatedAt: new Date().toISOString(),
      tags: ['database', 'latency', 'incident-response', 'demo'],
      source: 'stub'
    };
  }

  private generateOnboardingSOP(id: string, input: RawInput): SOP {
    // Extract role and tools from input if possible
    const roleMatch = input.content.match(/Role:\s*(.+)/i);
    const toolsMatch = input.content.match(/Tools Required:\s*(.+)/i);
    const role = roleMatch ? roleMatch[1].trim() : 'New Team Member';
    const tools = toolsMatch ? toolsMatch[1].trim() : 'Standard toolset';

    const steps: SOPStep[] = [
      {
        id: 'step-0',
        order: 1,
        phase: 'First 30 days',
        action: 'Complete orientation, set up development environment, and read existing runbooks',
        owner: 'New Hire',
        tools: ['Confluence', 'GitHub', 'Slack'],
        estimatedDuration: '2 weeks',
        artifact: 'Signed onboarding checklist and environment setup confirmation'
      },
      {
        id: 'step-1',
        order: 2,
        phase: 'First 30 days',
        action: 'Shadow team members during on-call shifts and incident response',
        owner: 'Buddy / Mentor',
        tools: ['PagerDuty', 'Incident.io', 'Datadog'],
        estimatedDuration: '1 week'
      },
      {
        id: 'step-2',
        order: 3,
        phase: 'First 30 days',
        action: 'Complete security training and obtain necessary access credentials',
        owner: 'Hiring Manager',
        tools: ['Okta', 'AWS Console', '1Password'],
        estimatedDuration: '3 days',
        artifact: 'Security training certificate'
      },
      {
        id: 'step-3',
        order: 4,
        phase: 'Days 31–60',
        action: 'Take ownership of small bug fixes and participate in code reviews',
        owner: 'New Hire',
        tools: ['GitHub', 'Linear', 'VS Code'],
        estimatedDuration: '4 weeks',
        artifact: 'First merged pull request'
      },
      {
        id: 'step-4',
        order: 5,
        phase: 'Days 31–60',
        action: 'Participate in incidents with guidance from senior engineers',
        owner: 'New Hire',
        tools: ['Incident.io', 'Slack', 'Datadog'],
        estimatedDuration: '3 weeks',
        warning: 'All incident actions must be reviewed by a senior engineer'
      },
      {
        id: 'step-5',
        order: 6,
        phase: 'Days 31–60',
        action: 'Deliver first feature or improvement to production',
        owner: 'New Hire',
        tools: ['GitHub', 'CI/CD Pipeline', 'Monitoring'],
        estimatedDuration: '2 weeks',
        artifact: 'Feature deployment confirmation and metrics'
      },
      {
        id: 'step-6',
        order: 7,
        phase: 'Days 61–90',
        action: 'Lead a small reliability improvement project',
        owner: 'New Hire',
        tools: ['Datadog', 'GitHub', 'Confluence'],
        estimatedDuration: '3 weeks',
        artifact: 'Project completion report with metrics'
      },
      {
        id: 'step-7',
        order: 8,
        phase: 'Days 61–90',
        action: 'Document a new runbook or update existing operational procedures',
        owner: 'New Hire',
        tools: ['Confluence', 'Mermaid', 'Markdown'],
        estimatedDuration: '1 week',
        artifact: 'Published runbook reviewed by team'
      },
      {
        id: 'step-8',
        order: 9,
        phase: 'Days 61–90',
        action: 'Complete 90-day review and set goals for next quarter',
        owner: 'Hiring Manager',
        tools: ['Performance Review System', 'Goals Framework'],
        estimatedDuration: '1 day',
        artifact: '90-day review document and Q2 goals'
      }
    ];
    
    return {
      id,
      title: '[STUB] Onboarding Plan – Demo SOP',
      category: SOPCategory.ONBOARDING,
      summary: `Onboarding plan for ${role} using tools: ${tools}`,
      triggers: [
        'New hire accepted offer',
        'Onboarding start date reached',
        'HR completes pre-boarding checklist'
      ],
      guardrails: [
        'Do not put the new hire on solo on-call in the first 30 days',
        'All changes must be reviewed by a senior engineer',
        'New hire must complete security training before accessing production systems',
        'Weekly 1:1 check-ins required with manager during first 90 days'
      ],
      steps,
      generatedAt: new Date().toISOString(),
      tags: ['onboarding', '30-60-90', 'new-hire', 'demo'],
      source: 'stub'
    };
  }
}

class StubValidator implements Validator {
  async validate(sop: SOP): Promise<{ valid: boolean; errors: string[] }> {
    // TODO: Implement semantic validation (e.g., checking for circular dependencies in steps)
    const errors = [];
    if (sop.steps.length === 0) errors.push("SOP has no steps.");
    if (!sop.title) errors.push("SOP missing title.");
    
    return { valid: errors.length === 0, errors };
  }
}

// --- CORE RUNTIME ---

const defaultClassifier = new StubClassifier();
const defaultSynthesizer = new StubSynthesizer();
const defaultValidator = new StubValidator();

export const runBonePipeline = async (
  input: RawInput,
  forcedCategory?: SOPCategory
): Promise<BonePipelineResult> => {
  console.log("BonePipeline: Initiating sequence...");

  // 1. CLASSIFY
  const category = forcedCategory || await defaultClassifier.classify(input);
  console.log(`BonePipeline: Category determined -> ${category}`);

  // 2. SYNTHESIZE
  // TODO: Fetch config from a steering policy database
  const config = { temperature: 0.3, model: 'gemini-2.5-flash' }; 
  let sop: SOP | null = null;
  let validationResult = { valid: false, errors: [] as string[] };

  try {
    sop = await defaultSynthesizer.synthesize(input, category, config);

    // 3. VALIDATE
    if (sop) {
      validationResult = await defaultValidator.validate(sop);
    }

  } catch (error) {
    console.error("BonePipeline: Fatal Error", error);
    // In a real framework, we would trigger a fallback routine or human-in-the-loop request
  }

  return {
    sop,
    configUsed: config,
    validationErrors: validationResult.errors,
    success: validationResult.valid
  };
};
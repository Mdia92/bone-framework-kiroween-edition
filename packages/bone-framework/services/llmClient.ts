import { SOP, SOPCategory } from '../../shared/types';
import { generateSOPFromRawBedrock } from './bedrockService';

interface LLMCallParams {
  rawInputText: string;
  mode: 'incident' | 'onboarding';
}

/**
 * 🎃 The Bone Marrow - Bedrock-Only Architecture
 * 
 * Calls AWS Bedrock (Claude) to generate SOPs.
 * This is the unified entry point for the Bone Framework's generative AI.
 * 
 * @throws {Error} If Bedrock fails
 */
export async function callLLMForSOP(params: LLMCallParams): Promise<SOP> {
  const { rawInputText, mode } = params;

  // Map mode to SOPCategory
  const category = mode === 'incident' ? SOPCategory.INCIDENT : SOPCategory.ONBOARDING;

  console.log(`🎃 LLMClient: Summoning Bedrock daemon (Claude) for ${mode}...`);
  console.log(`📝 LLMClient: Input length: ${rawInputText.length} chars`);

  try {
    const sop = await generateSOPFromRawBedrock(rawInputText, category);
    console.log(`✅ LLMClient: Bedrock returned SOP: "${sop.title}"`);
    console.log(`📊 LLMClient: SOP has ${sop.steps.length} steps`);
    return sop;
  } catch (error) {
    console.error(`❌ LLMClient: Bedrock failed!`, error);
    if (error instanceof Error) {
      console.error(`❌ LLMClient: Error message: ${error.message}`);
      console.error(`❌ LLMClient: Error stack:`, error.stack);
    }
    throw error;
  }
}

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { SOPCategory, SOP } from '../../shared/types';

// Type declaration for Vite-injected process.env
declare const process: { 
  env: { 
    AWS_REGION?: string;
    BEDROCK_API_KEY?: string;
  } 
};

const getBedrockClient = () => {
  console.log(`🔑 BedrockService: Checking for API key...`);
  const region = process.env.AWS_REGION || 'us-east-1';
  const apiKey = process.env.BEDROCK_API_KEY;

  if (!apiKey) {
    console.error('❌ BedrockService: BEDROCK_API_KEY is undefined!');
    console.error('Available process.env keys:', Object.keys(process.env));
    throw new Error('🎃 BEDROCK_API_KEY not found in the crypt (.env.local)');
  }
  
  console.log(`✅ BedrockService: API key found (length: ${apiKey.length})`);
  console.log(`🎃 BedrockService: Creating Bedrock client for region ${region}...`);

  // Decode the base64-encoded API key to extract access key ID and secret
  // Format: ABSK<base64(accessKeyId:secretAccessKey)>
  try {
    const base64Part = apiKey.replace(/^ABSK/, '');
    const decoded = atob(base64Part);
    const [accessKeyId, secretAccessKey] = decoded.split(':');

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Invalid Bedrock API key format - missing credentials');
    }

    return new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  } catch (decodeError) {
    throw new Error(`Failed to decode Bedrock API key: ${decodeError instanceof Error ? decodeError.message : String(decodeError)}`);
  }
};

export const generateSOPFromRawBedrock = async (
  rawText: string,
  category: SOPCategory
): Promise<SOP> => {
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";

  // Dynamic system prompt based on category
  const incidentPrompt = `
    Focus on INCIDENT RESPONSE - the dark arts of chaos containment.
    Structure steps into phases: "Immediate", "Mitigation", "Resolution".
    Identify "triggers" (what summons this ritual) and "guardrails" (forbidden actions).
    Role is usually "On-Call Exorcist", "Incident Commander", "Tech Necromancer".
  `;

  const onboardingPrompt = `
    Focus on ONBOARDING RITUALS - the sacred rites of initiation.
    Structure steps into phases: "First 30 days", "Days 31–60", "Days 61–90".
    Identify "artifacts" (cursed documents, enchanted hardware, mystical accounts) needed.
    Role is usually "New Acolyte", "Spirit Guide", "IT Warlock".
  `;

  const systemInstruction = `
    You are a Digital Daemon of the Bone Framework - a spectral entity that weaves chaos into order.
    Convert raw mortal input into a structured SOP (Standard Operating Procedure).
    
    Category: ${category}
    ${category === SOPCategory.INCIDENT ? incidentPrompt : onboardingPrompt}
    
    Speak in clear, professional language but embrace the Halloween aesthetic in your phrasing.
    
    Return ONLY valid JSON matching this schema:
    {
      "title": "string",
      "summary": "string",
      "tags": ["string"],
      "triggers": ["string"],
      "guardrails": ["string"],
      "steps": [
        {
          "phase": "string",
          "action": "string",
          "owner": "string",
          "tools": ["string"],
          "estimatedDuration": "string",
          "warning": "string (optional)",
          "artifact": "string (optional)"
        }
      ]
    }
  `;

  try {
    const client = getBedrockClient();
    
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      temperature: 0.3,
      system: systemInstruction,
      messages: [
        {
          role: "user",
          content: rawText
        }
      ]
    };

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload)
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract text from Claude response
    const textContent = responseBody.content?.[0]?.text;
    if (!textContent) {
      throw new Error("No text content in Bedrock response");
    }

    // Parse the JSON from the response
    const rawData = JSON.parse(textContent);

    // Map to Type-Safe SOP Object
    return {
      id: crypto.randomUUID(),
      title: `[LLM] ${rawData.title}`,
      category: category,
      summary: rawData.summary,
      triggers: rawData.triggers || [],
      guardrails: rawData.guardrails || [],
      tags: rawData.tags || [],
      generatedAt: new Date().toISOString(),
      source: 'llm' as const,
      steps: rawData.steps.map((s: any, idx: number) => ({
        id: `step-${idx}`,
        order: idx + 1,
        phase: s.phase,
        action: s.action,
        owner: s.owner || s.role,
        tools: s.tools || [],
        estimatedDuration: s.estimatedDuration,
        warning: s.warning,
        artifact: s.artifact
      }))
    };

  } catch (error) {
    console.error("Bedrock Service Error:", error);
    throw error;
  }
};

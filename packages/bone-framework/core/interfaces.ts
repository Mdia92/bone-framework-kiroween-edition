import { RawInput, SOP, SOPCategory, DigitalDaemonConfig } from '../../shared/types';

export interface Classifier {
  classify(input: RawInput): Promise<SOPCategory>;
}

export interface Synthesizer {
  synthesize(input: RawInput, category: SOPCategory, config?: DigitalDaemonConfig): Promise<SOP>;
}

export interface Validator {
  validate(sop: SOP): Promise<{ valid: boolean; errors: string[] }>;
}

export interface BonePipelineResult {
  sop: SOP | null;
  configUsed: DigitalDaemonConfig;
  validationErrors: string[];
  success: boolean;
}

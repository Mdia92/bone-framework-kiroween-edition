import { useState, useCallback } from 'react';
import { generateSOPFromRaw } from '../services/geminiService';
import { SOP, SOPCategory } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid'; // Simulation of UUID, actually we'll use simple math random for this demo if uuid pkg missing, but let's assume standard crypto.randomUUID

export const useDigitalDaemon = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exorciseEntropy = useCallback(async (rawText: string, category: SOPCategory): Promise<SOP | null> => {
    setLoading(true);
    setError(null);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY is missing. Please connect to Google Gemini.");
      }

      // generateSOPFromRaw already returns a complete SOP object
      const sop = await generateSOPFromRaw(rawText, category);
      
      return sop;
    } catch (err: any) {
      setError(err.message || "The Daemon failed to process the request.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exorciseEntropy,
    loading,
    error
  };
};
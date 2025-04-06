"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiContextType {
  analyzeImage: (imageData: string) => Promise<string>;
  isAnalyzing: boolean;
  result: string | null;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export function useGemini() {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
}

interface GeminiProviderProps {
  apiKey: string;
  children: ReactNode;
}

export function GeminiProvider({ apiKey, children }: GeminiProviderProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-pro-vision instead of gemini-1.5-pro-vision as it's more widely available
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const analyzeImage = async (imageData: string) => {
    try {
      setIsAnalyzing(true);
      setResult(null);

      // Remove the data URL prefix to get just the base64 data
      const base64Data = imageData.split(',')[1];

      const triagePrompt = `You are a triage assistant. Given an image of a patient, assign an Emergency Severity Index (ESI) level from 1 to 5 using only visible visual cues. Do not assume access to vitals, medical history, or spoken information.

Follow these guidelines:

ESI 1 – Immediate
- Unconscious or unresponsive
- Severe respiratory distress (e.g., nasal flaring, cyanosis)
- Major bleeding or visible amputation

ESI 2 – Emergent
- Clutching chest with visible sweating
- Confused, agitated, or uncoordinated behavior
- Severe burns covering large areas of the body

ESI 3 – Urgent
- Obvious fractures or limb deformities
- Controlled but moderate bleeding
- Visibly in pain but stable (e.g., curled up, guarding abdomen)

ESI 4–5 – Less Urgent/Non-Urgent
- Minor visible injuries (cuts, bruises, rashes)
- Calm, responsive, no signs of acute distress

Output format:
ESI [Level]: [Brief explanation of visible signs]
Example: ESI 1: Unconscious with cyanosis and active bleeding from left leg

If the image lacks sufficient information, respond with:
Unclear – recommend manual assessment

Only use what you can see. Prioritize obvious, high-risk cues. Do not infer internal symptoms or use non-visual indicators.`;
      
      const result = await model.generateContent([
        triagePrompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        }
      ]);

      const response = result.response.text();
      setResult(response);
      return response;
    } catch (error) {
      console.error("Error analyzing image:", error);
      setResult("Error analyzing image");
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <GeminiContext.Provider value={{ analyzeImage, isAnalyzing, result }}>
      {children}
    </GeminiContext.Provider>
  );
}
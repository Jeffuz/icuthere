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

      const prompt = "Analyze what you see in this image and provide a detailed description.";
      
      const result = await model.generateContent([
        prompt,
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
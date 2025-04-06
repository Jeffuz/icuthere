"use client";

import { GeminiProvider, VisionAnalyzer } from "@/components/gemini";
import { useEffect, useState } from "react";

export default function TriageAssistantPage() {
  const [apiKey, setApiKey] = useState("");
  
  useEffect(() => {
    // Access environment variable in client component after mounting
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "");
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Emergency Triage Assistant</h1>
      <p className="text-center text-gray-600 mb-6">
        AI-powered visual assessment for emergency room triage
      </p>
      
      {!apiKey ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <p>
            <strong>API Key Missing:</strong> Please add your Google AI API key to the .env.local file.
          </p>
          <p className="text-sm mt-2">
            Get a key at <a href="https://ai.google.dev/" className="underline">Google AI Studio</a>
          </p>
        </div>
      ) : (
        <GeminiProvider apiKey={apiKey}>
          <VisionAnalyzer />
        </GeminiProvider>
      )}
      
      <div className="mt-12 max-w-xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-bold text-lg text-blue-800 mb-2">About This Tool</h2>
          <p className="text-sm text-gray-700">
            This Emergency Triage Assistant uses AI vision technology to provide a preliminary 
            Emergency Severity Index (ESI) assessment based solely on visual cues from camera images.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            <strong>Important:</strong> This tool is meant to supplement, not replace, professional 
            medical judgment. All assessments should be verified by qualified medical personnel.
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <a 
          href="/" 
          className="text-blue-500 hover:underline"
        >
          ← Back to home
        </a>
      </div>
    </div>
  );
}
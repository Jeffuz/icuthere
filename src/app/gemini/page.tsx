"use client";

import { GeminiProvider, VisionAnalyzer } from "@/components/gemini";
import { useEffect, useState } from "react";

export default function GeminiVisionPage() {
  const [apiKey, setApiKey] = useState("");
  
  useEffect(() => {
    // Access environment variable in client component after mounting
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "");
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Gemini Vision Analysis</h1>
      
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
      
      <div className="mt-8">
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
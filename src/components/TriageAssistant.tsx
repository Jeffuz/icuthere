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
    <div>
        <GeminiProvider apiKey={apiKey}>
          <VisionAnalyzer />
        </GeminiProvider>
    </div>
  );
}
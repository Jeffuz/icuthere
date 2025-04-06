/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useGemini } from "./GeminiProvider";
import { CameraCapture } from "./CameraCapture";

interface TriageResult {
  explanation: string;
}

export function VisionAnalyzer({
  onExplanationReady,
}: {
  onExplanationReady: (summary: string) => void;
}) {
  const { isAnalyzing, result } = useGemini();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<TriageResult | null>(null);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
  };

  const resetAssessment = () => {
    setCapturedImage(null);
    setParsedResult(null);
  };

  // Parse the ESI result when it arrives
  useEffect(() => {
    if (!result) {
      setParsedResult(null);
      return;
    }

    if (result.includes("Unclear")) {
      setParsedResult({
        explanation: "Insufficient visual data",
      });
      return;
    }

    // Try to parse ESI level and explanation
    const esiMatch = result.match(/ESI\s*(\d):\s*(.*)/i);
    if (esiMatch) {
      const explanation = esiMatch[2].trim();
      setParsedResult({ explanation });
      onExplanationReady(explanation);
    } else {
      setParsedResult({ explanation: result });
      onExplanationReady(result);
    }
  }, [onExplanationReady, result]);

  return (
    <div className="flex flex-col w-full max-w-2xl h-full">
      {!capturedImage ? (
        <CameraCapture onCapture={handleCapture} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Patient Image</h3>
              {parsedResult && !isAnalyzing && (
                <button
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={resetAssessment}
                >
                  New Assessment
                </button>
              )}
            </div>
            <div className="flex justify-center">
              <img
                src={capturedImage}
                alt="Patient image"
                className="max-h-60 object-contain rounded"
              />
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg p-4 min-h-[150px]">
            {isAnalyzing ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-pulse text-center">
                  <p>Analyzing patient condition...</p>
                </div>
              </div>
            ) : parsedResult ? (
              <div>
                <div className="mt-4">
                  <p className="mt-1">{parsedResult.explanation}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Analyzing image...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { useGemini } from './GeminiProvider';
import { CameraCapture } from './CameraCapture';

interface TriageResult {
  level: number;
  explanation: string;
  recommendation?: string;
}

export function VisionAnalyzer() {
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
        level: 0,
        explanation: "Insufficient visual data",
        recommendation: "Manual assessment required"
      });
      return;
    }

    // Try to parse ESI level and explanation
    const esiMatch = result.match(/ESI\s*(\d):\s*(.*)/i);
    if (esiMatch) {
      setParsedResult({
        level: parseInt(esiMatch[1]),
        explanation: esiMatch[2].trim()
      });
    } else {
      setParsedResult({
        level: 0,
        explanation: result,
        recommendation: "Format not recognized, please review manually"
      });
    }
  }, [result]);

  // Get the appropriate color based on ESI level
  const getESIColor = (level: number): string => {
    switch (level) {
      case 1: return 'bg-red-600 text-white'; // Immediate - red
      case 2: return 'bg-orange-500 text-white'; // Emergent - orange
      case 3: return 'bg-yellow-400 text-black'; // Urgent - yellow
      case 4: return 'bg-green-500 text-white'; // Less urgent - green
      case 5: return 'bg-blue-500 text-white'; // Non-urgent - blue
      default: return 'bg-gray-400 text-white'; // Unclear or error
    }
  };

  // Get the ESI level text
  const getESIText = (level: number): string => {
    switch (level) {
      case 1: return 'IMMEDIATE';
      case 2: return 'EMERGENT';
      case 3: return 'URGENT';
      case 4: return 'LESS URGENT';
      case 5: return 'NON-URGENT';
      default: return 'MANUAL ASSESSMENT';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-4">
      {!capturedImage && (
        <p className="text-center text-gray-600">Capture or upload a patient image for preliminary ESI assessment</p>
      )}
      
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
            <h3 className="font-medium text-lg mb-2">Triage Assessment</h3>
            
            {isAnalyzing ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-pulse text-center">
                  <p>Analyzing patient condition...</p>
                  <p className="text-sm text-gray-500 mt-2">This assessment is preliminary and should be confirmed by medical staff</p>
                </div>
              </div>
            ) : parsedResult ? (
              <div>
                <div className={`mb-4 p-3 rounded-md ${getESIColor(parsedResult.level)}`}>
                  <div className="text-xl font-bold">
                    {parsedResult.level > 0 ? `ESI ${parsedResult.level}: ${getESIText(parsedResult.level)}` : 'ASSESSMENT NEEDED'}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium">Visual Indicators:</h4>
                  <p className="mt-1">{parsedResult.explanation}</p>
                </div>
                
                {parsedResult.recommendation && (
                  <div className="mt-4 p-2 bg-yellow-50 border border-yellow-300 rounded">
                    <p className="text-sm text-yellow-800">{parsedResult.recommendation}</p>
                  </div>
                )}
                
                <div className="mt-6 text-sm text-gray-500">
                  <p>This is an AI-assisted preliminary assessment based only on visual cues.</p>
                  <p>Always verify with proper medical protocols and clinical judgment.</p>
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
"use client";

import React, { useState } from 'react';
import { useGemini } from './GeminiProvider';
import { CameraCapture } from './CameraCapture';

export function VisionAnalyzer() {
  const { isAnalyzing, result } = useGemini();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center">Gemini Vision Analyzer</h2>
      
      <CameraCapture onCapture={handleCapture} />
      
      {capturedImage && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Captured Image</h3>
          <div className="flex justify-center">
            <img 
              src={capturedImage} 
              alt="Captured from camera" 
              className="max-h-60 object-contain rounded"
            />
          </div>
        </div>
      )}
      
      <div className="border border-gray-300 rounded-lg p-4 min-h-[150px]">
        <h3 className="font-medium text-lg mb-2">Analysis Result</h3>
        
        {isAnalyzing ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-pulse text-center">
              <p>Analyzing image with Gemini...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          </div>
        ) : result ? (
          <div className="prose">
            <p>{result}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">Capture an image to see analysis results</p>
        )}
      </div>
    </div>
  );
}
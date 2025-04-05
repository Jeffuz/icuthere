"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useGemini } from './GeminiProvider';

interface CameraCaptureProps {
  onCapture?: (imageData: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [streaming, setStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyzeImage, isAnalyzing } = useGemini();

  // Initialize camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
        setErrorMsg(null);
      }
    } catch (err) {
      setErrorMsg("Error accessing camera: Please ensure camera permissions are granted");
      console.error("Camera access error:", err);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (streaming && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Use callback if provided
        if (onCapture) {
          onCapture(imageData);
        }
        
        // Use Gemini to analyze the image
        analyzeImage(imageData).catch(error => {
          console.error("Error during image analysis:", error);
        });
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md">
        <video 
          ref={videoRef}
          className="w-full rounded-lg border border-gray-300"
          autoPlay 
          playsInline
        />
        {!streaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <p className="text-white">Camera inactive</p>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {errorMsg && (
        <div className="text-red-500 text-sm">{errorMsg}</div>
      )}
      
      <div className="flex gap-4">
        {!streaming ? (
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={startCamera}
          >
            Start Camera
          </button>
        ) : (
          <>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={captureImage}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Capture & Analyze'}
            </button>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={stopCamera}
            >
              Stop Camera
            </button>
          </>
        )}
      </div>
    </div>
  );
}
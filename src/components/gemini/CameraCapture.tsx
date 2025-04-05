"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useGemini } from './GeminiProvider';

interface CameraCaptureProps {
  onCapture?: (imageData: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [streaming, setStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPasteReady, setIsPasteReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
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
        
        // Stop camera after capturing
        stopCamera();
        
        // Use Gemini to analyze the image
        analyzeImage(imageData).catch(error => {
          console.error("Error during image analysis:", error);
        });
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.match('image.*')) {
      setErrorMsg("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Stop camera if it's running
    if (streaming) {
      stopCamera();
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      if (onCapture) {
        onCapture(imageData);
      }
      
      analyzeImage(imageData).catch(error => {
        console.error("Error during image analysis:", error);
      });
    };
    
    reader.onerror = () => {
      setErrorMsg("Error reading file");
    };
    
    reader.readAsDataURL(file);
  };

  // Handle clipboard paste events
  const handlePaste = (event: ClipboardEvent) => {
    // Only handle clipboard paste if it's not from a form element
    const activeElement = document.activeElement;
    const isFromInput = activeElement instanceof HTMLInputElement || 
                        activeElement instanceof HTMLTextAreaElement;
    
    if (isFromInput) return;
    
    const items = event.clipboardData?.items;
    if (!items) return;

    // Look for image items in the clipboard
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Check if item is an image
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        
        // Get the image as a blob
        const blob = item.getAsFile();
        if (!blob) continue;
        
        // Stop camera if it's running
        if (streaming) {
          stopCamera();
        }
        
        // Read the blob as data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          if (onCapture) {
            onCapture(imageData);
          }
          
          setIsPasteReady(false);
          
          analyzeImage(imageData).catch(error => {
            console.error("Error during image analysis:", error);
          });
        };
        
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-blue-500');
    }
  };
  
  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500');
    }
  };
  
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500');
    }
    
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.match('image.*')) {
      setErrorMsg("Please drop an image file (JPEG, PNG, etc.)");
      return;
    }
    
    // Stop camera if it's running
    if (streaming) {
      stopCamera();
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      if (onCapture) {
        onCapture(imageData);
      }
      
      analyzeImage(imageData).catch(error => {
        console.error("Error during image analysis:", error);
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Set up paste event listener
  useEffect(() => {
    const handlePasteEvent = (e: ClipboardEvent) => handlePaste(e);
    window.addEventListener('paste', handlePasteEvent);
    
    return () => {
      window.removeEventListener('paste', handlePasteEvent);
      stopCamera();
    };
  }, [streaming]); // Re-add event listener if streaming state changes

  // Toggle paste ready state (for visual feedback)
  const togglePasteMode = () => {
    setIsPasteReady(!isPasteReady);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        ref={dropZoneRef}
        className={`relative w-full max-w-md transition-all duration-200 ${isPasteReady ? 'border-dashed border-2 border-blue-400 bg-blue-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <video 
          ref={videoRef}
          className="w-full rounded-lg border border-gray-300"
          autoPlay 
          playsInline
          style={{ display: streaming ? 'block' : 'none' }}
        />
        {!streaming && (
          <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center rounded-lg border border-gray-300 p-4">
            {isPasteReady ? (
              <>
                <p className="text-blue-500 font-medium mb-2">Ready for paste</p>
                <p className="text-gray-500 text-sm text-center">
                  Press Ctrl+V (or Cmd+V) to paste an image from your clipboard
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-500">Camera inactive</p>
                <p className="text-gray-400 text-xs mt-2">
                  You can also drag & drop images here
                </p>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden" 
      />
      
      {errorMsg && (
        <div className="text-red-500 text-sm">{errorMsg}</div>
      )}
      
      <div className="flex flex-wrap justify-center gap-4">
        {!streaming ? (
          <>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={startCamera}
            >
              Start Camera
            </button>
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              onClick={triggerFileUpload}
            >
              Upload Photo
            </button>
            <button
              className={`px-4 py-2 ${isPasteReady ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded-md`}
              onClick={togglePasteMode}
            >
              {isPasteReady ? 'Paste Mode On' : 'Paste Image'}
            </button>
          </>
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
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
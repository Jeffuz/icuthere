/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGemini } from "./GeminiProvider";
import { Camera, Download, X } from "lucide-react";

interface CameraCaptureProps {
  onCapture?: (imageData: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  // State variables
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isPasteMode, setIsPasteMode] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Get Gemini context
  const { analyzeImage, isAnalyzing } = useGemini();

  // Function to activate the camera
  const activateCamera = async () => {
    // Reset paste mode when activating camera
    setIsPasteMode(false);

    try {
      // Reset error state
      setErrorMessage(null);

      // Make sure browser supports getUserMedia
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Your browser doesn't support camera access");
      }

      // Stop any existing stream
      if (videoRef.current?.srcObject) {
        const existingStream = videoRef.current.srcObject as MediaStream;
        existingStream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      // Access the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      // Success - set the stream as video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for the video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (!videoRef.current) return;

          videoRef.current
            .play()
            .then(() => setCameraActive(true))
            .catch((error) => {
              console.error("Failed to play video:", error);
              setErrorMessage(`Video playback failed: ${error.message}`);
            });
        };
      } else {
        throw new Error("Video element not available");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Handle errors with specific messages
      console.error("Camera access error:", err);
      let message = "Camera error: ";

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        message += "Please allow camera access in your browser settings";
      } else if (err.name === "NotFoundError") {
        message += "No camera found on your device";
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        message += "Camera is being used by another application";
      } else {
        message += err.message || "Unknown error";
      }

      setErrorMessage(message);
      setCameraActive(false);
    }
  };

  // Function to deactivate the camera
  const deactivateCamera = () => {
    if (!videoRef.current?.srcObject) return;

    try {
      // Stop all tracks
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
  };

  // Function to capture image from camera
  const captureFromCamera = () => {
    if (!cameraActive || !videoRef.current || !canvasRef.current) {
      setErrorMessage("Camera not ready");
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas size to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not get canvas context");
      }

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0);

      // Get image data as URL
      const imageData = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(imageData);

      // Send image data to parent via callback
      if (onCapture) {
        onCapture(imageData);
      }

      // Stop camera
      deactivateCamera();

      // Process with Gemini
      processWithGemini(imageData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error capturing image:", err);
      setErrorMessage(`Failed to capture: ${err.message}`);
    }
  };

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Reset error
    setErrorMessage(null);

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file");
      return;
    }

    // Stop camera if active
    if (cameraActive) {
      deactivateCamera();
    }

    // Create a file reader to read the file
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);

      if (onCapture) {
        onCapture(imageData);
      }

      // Process with Gemini
      processWithGemini(imageData);
    };

    reader.onerror = () => {
      setErrorMessage("Failed to read file");
    };

    reader.readAsDataURL(file);
  };

  // Function to handle clipboard paste
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClipboardPaste = (event: ClipboardEvent) => {
    // Only handle if in paste mode or when the drop zone is clicked
    if (!isPasteMode) return;

    // Prevent default to avoid pasting into any input fields
    event.preventDefault();

    const items = event.clipboardData?.items;
    if (!items || items.length === 0) {
      setErrorMessage("No content in clipboard");
      return;
    }

    // Look for image items in clipboard
    let foundImage = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Check if item is an image
      if (item.type.indexOf("image") !== -1) {
        foundImage = true;

        // Get image as a file
        const blob = item.getAsFile();
        if (!blob) {
          setErrorMessage("Could not process clipboard image");
          continue;
        }

        // Stop camera if active
        if (cameraActive) {
          deactivateCamera();
        }

        // Turn off paste mode
        setIsPasteMode(false);

        // Read the blob as data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          setCapturedImage(imageData);

          if (onCapture) {
            onCapture(imageData);
          }

          // Process with Gemini
          processWithGemini(imageData);
        };

        reader.onerror = () => {
          setErrorMessage("Failed to read pasted image");
        };

        reader.readAsDataURL(blob);
        break;
      }
    }

    if (!foundImage) {
      setErrorMessage(
        "No image found in clipboard. Try copying an image first."
      );
    }
  };

  // Function to handle drag over event
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-blue-500");
      dropZoneRef.current.classList.add("bg-blue-50");
    }
  };

  // Function to handle drag leave event
  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-blue-500");
      dropZoneRef.current.classList.remove("bg-blue-50");
    }
  };

  // Function to handle drop event
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    // Reset highlighting
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-blue-500");
      dropZoneRef.current.classList.remove("bg-blue-50");
    }

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please drop an image file");
      return;
    }

    // Stop camera if active
    if (cameraActive) {
      deactivateCamera();
    }

    // Turn off paste mode
    setIsPasteMode(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);

      if (onCapture) {
        onCapture(imageData);
      }

      processWithGemini(imageData);
    };

    reader.onerror = () => {
      setErrorMessage("Failed to read dropped image");
    };

    reader.readAsDataURL(file);
  };

  // Function to process image with Gemini
  const processWithGemini = (imageData: string) => {
    analyzeImage(imageData).catch((error) => {
      console.error("Gemini analysis error:", error);
      setErrorMessage("Failed to analyze image");
    });
  };

  // Trigger file selection dialog
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Set up clipboard paste event listener
  useEffect(() => {
    const handlePasteEvent = (e: ClipboardEvent) => handleClipboardPaste(e);
    window.addEventListener("paste", handlePasteEvent);

    return () => {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, [isPasteMode, cameraActive, handleClipboardPaste]); // Re-register when paste mode or camera state changes

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cameraActive) {
        deactivateCamera();
      }
    };
  }, [cameraActive]);

  return (
    <div>
      {/* Header */}
      <div className="bg-[#0078d4] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-semibold">Emergency Department Check In</div>
        </div>
      </div>

      {/* Waring */}
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
          />
        </svg>
        <p>
          <span className="font-medium">
            If you&apos;re experiencing severe chest pain, difficulty breathing,
            or other life-threatening symptoms, please alert staff immediately.
          </span>
        </p>
      </div>

      {/* Action buttons - clearly separated from the camera feed */}
      <div className="flex w-full justify-between ">
        {/* Show these buttons when no image is captured and camera is inactive */}
        {!capturedImage && !cameraActive && (
          <>
            <button
              onClick={activateCamera}
              disabled={isAnalyzing}
              className="w-full flex items-center gap-2 justify-center text-gray-500 bg-white hover:bg-gray-50 transition duration-200 border p-2 hover:cursor-pointer"
            >
              <Camera /> <span>Start Camera</span>
            </button>
            <button
              className="w-full flex items-center gap-2 justify-center text-gray-500 bg-white hover:bg-gray-50 transition duration-200 border p-2 hover:cursor-pointer"
              onClick={triggerFileUpload}
              disabled={isAnalyzing}
            >
              <Download /> <span>Upload Photo</span>
            </button>
          </>
        )}

        {/* Show these buttons when camera is active */}
        {!capturedImage && cameraActive && (
          <>
            <button
              onClick={captureFromCamera}
              className="w-full flex items-center gap-2 justify-center text-gray-500 bg-gray-100 border p-2 hover:cursor-pointer"
              disabled={isAnalyzing}
            >
              <Camera />
              {isAnalyzing ? "Processing..." : "Capture & Analyze"}
            </button>
            <button
              onClick={deactivateCamera}
              className="w-full flex items-center gap-2 justify-center text-gray-500 bg-gray-100 border p-2 hover:cursor-pointer"
              disabled={isAnalyzing}
            >
              <X /> <span>Cancel</span>
            </button>
          </>
        )}

        {/* Reset button when image is captured */}
        {capturedImage && (
          <button
            onClick={() => {
              setCapturedImage(null);
              setErrorMessage(null);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            disabled={isAnalyzing}
          >
            New Image
          </button>
        )}
      </div>
      {/* Camera or Image Display Area */}
      <div
        ref={dropZoneRef}
        className={`w-full mb-4 border overflow-hidden relative
          ${
            isPasteMode
              ? "border-2 border-dashed border-blue-400"
              : "border-gray-300"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Video element for camera feed */}
        {!capturedImage && (
          <div className="aspect-video bg-gray-900 relative">
            {/* Camera feed */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${
                cameraActive ? "block" : "hidden"
              }`}
              autoPlay
              playsInline
              muted
            />

            {/* Placeholder when camera is off */}
            {!cameraActive && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center 
                ${isPasteMode ? "bg-blue-50" : "bg-gray-100"}`}
              >
                {isPasteMode ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-blue-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-blue-500 font-medium">Ready for paste</p>
                    <p className="text-blue-400 text-sm mt-1 text-center px-4">
                      Press Ctrl+V (or Cmd+V) to paste an image
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      You can also drag & drop an image here
                    </p>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">
                      Select an option above
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Show captured image */}
        {capturedImage && (
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <img
              src={capturedImage}
              alt="Captured"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Error display */}
      {errorMessage && (
        <div
          className={`w-full p-3 mb-4 rounded-md text-center
          ${
            isPasteMode && !errorMessage.includes("error")
              ? "bg-blue-50 border border-blue-200 text-blue-600"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Analysis status */}
      {isAnalyzing && (
        <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-600 text-center">
          <p className="animate-pulse">Analyzing image...</p>
        </div>
      )}
    </div>
  );
}

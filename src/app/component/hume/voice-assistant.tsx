"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, AudioWaveformIcon as Waveform } from "lucide-react"

interface VoiceAssistantProps {
  isRecording: boolean
  transcript: string
}

export default function VoiceAssistant({ isRecording, transcript }: VoiceAssistantProps) {
  const [emotion, setEmotion] = useState<string | null>(null)
  const [dots, setDots] = useState("")

  // Simulate emotion detection
  useEffect(() => {
    if (isRecording) {
      const emotions = ["neutral", "anxious", "calm", "distressed", "confused"]
      const timer = setTimeout(() => {
        setEmotion(emotions[Math.floor(Math.random() * emotions.length)])
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      setEmotion(null)
    }
  }, [isRecording])

  // Animate dots when recording
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""))
      }, 500)

      return () => clearInterval(interval)
    } else {
      setDots("")
    }
  }, [isRecording])

  // Custom wave animation component
  const WaveAnimation = () => {
    return (
      <div className="flex items-center justify-center gap-1 h-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-primary rounded-full animate-pulse"
            style={{
              height: `${Math.random() * 16 + 8}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {isRecording ? (
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <Waveform className="h-5 w-5 text-red-500" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Mic className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="font-medium">Voice Assistant</h3>
            <p className="text-xs text-muted-foreground">{isRecording ? `Listening${dots}` : "Ready to assist"}</p>
          </div>
        </div>

        <div className="min-h-[80px] bg-muted/50 rounded-md p-3 text-sm">
          {isRecording ? (
            <>
              <p>{transcript}</p>
              <div className="mt-2">
                <WaveAnimation />
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Press Start to begin voice intake</p>
          )}
        </div>

        {emotion && (
          <div className="mt-3 text-xs">
            <span className="text-muted-foreground">Detected emotion: </span>
            <span className="font-medium capitalize">{emotion}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


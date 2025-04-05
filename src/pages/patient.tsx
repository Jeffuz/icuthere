"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Video, VideoOff, Clock, CheckCircle } from "lucide-react"
import VoiceAssistant from "@/components/voice-assistant"
import { fetchAccessToken } from "hume"
import ClientComponent from "@/components/hume/client-component"

export default function ClientInterface() {
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [waitingStatus, setWaitingStatus] = useState("waiting") // "waiting" or "ready"
  const [waitTime, setWaitTime] = useState(15) // minutes
  const videoRef = useRef(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      const token = await fetchAccessToken({
        apiKey: String(process.env.NEXT_PUBLIC_HUME_API_KEY),
        secretKey: String(process.env.NEXT_PUBLIC_HUME_SECRET_KEY),
      });

      if (!token) {
        throw new Error();
      }
      setAccessToken(token);
    };

    fetchToken();

  }, [])

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)

    if (!isVideoOn && videoRef.current) {
      // This would be replaced with actual video stream implementation
      console.log("Starting video")
    } else if (videoRef.current) {
      console.log("Stopping video")
    }
  }

  // Simulate status change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (waitingStatus === "waiting" && Math.random() > 0.7) {
        setWaitingStatus("ready")
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [waitingStatus])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-6 py-4 bg-white border-b">
        <div className="container">
          <h1 className="text-xl font-bold">Patient Triage Assistant</h1>
        </div>
      </header>

      <main className="flex-1 container py-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Welcome</CardTitle>
              <Badge
                variant={waitingStatus === "ready" ? "default" : "outline"}
                className={waitingStatus === "ready" ? "bg-green-500" : ""}
              >
                {waitingStatus === "ready" ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Ready
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Waiting
                  </span>
                )}
              </Badge>
            </div>
            <CardDescription>
              {waitingStatus === "ready"
                ? "A healthcare provider will see you shortly"
                : `Estimated wait time: ${waitTime} minutes`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {isVideoOn ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster="/placeholder.svg?height=300&width=500"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <VideoOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Video is off</p>
                </div>
              )}
            </div>

            {accessToken ? (
              <ClientComponent
                accessToken={accessToken}
              />
            ) : (
              <div className="flex items-center justify-center p-4">
                <span className="text-muted-foreground">Loading...</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant={isRecording ? "default" : "outline"}
              onClick={toggleRecording}
              className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isRecording ? (
                <span className="flex items-center gap-2">
                  <MicOff className="h-4 w-4" /> Stop
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Mic className="h-4 w-4" /> Start
                </span>
              )}
            </Button>
            <Button variant={isVideoOn ? "default" : "outline"} onClick={toggleVideo}>
              {isVideoOn ? (
                <span className="flex items-center gap-2">
                  <VideoOff className="h-4 w-4" /> Stop Video
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Video className="h-4 w-4" /> Start Video
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>

      <footer className="border-t py-4 px-6 bg-white">
        <div className="container text-center text-sm text-muted-foreground">
          If this is an emergency, please call 911 immediately.
        </div>
      </footer>
    </div>
  )
}


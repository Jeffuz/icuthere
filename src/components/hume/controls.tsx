// ./components/Controls.tsx
"use client";
import {
  ConnectionMessage,
  JSONMessage,
  useVoice,
  VoiceReadyState,
} from "@humeai/voice-react";
import { Button } from "../ui/button";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useState } from "react";

// Define the assessment response interface
interface AssessmentResponse {
  chiefComplaint: string; // What brought you here
  onsetTime: string; // When symptoms started
  severity: number; // Pain scale 0-10
  location: string; // Body location
  progression: string; // Getting better/worse/same
  trigger: string; // Possible cause
  vitalSigns: string; // Fever, SOB, etc
  mobility: string; // Walking/speaking check
  medicalHistory: string; // Recent surgeries/injuries
  allergies: string; // Known allergies
}

export default function Controls({
  messages,
  setChatbotSummary,
}: {
  messages: (JSONMessage | ConnectionMessage)[];
  setChatbotSummary: (summary: string) => void;
}) {
  const { connect, disconnect, readyState } = useVoice();
  const [connecting, setConnecting] = useState(false);

  const parseMessages = async () => {
    try {
      // Combine all message content into a single string
      const conversationText = messages
        .flat()
        .map((msg) => {
          if (msg.type === "user_message" || msg.type === "assistant_message") {
            return `${msg.message.role}: ${msg.message.content}`;
          }
          return "";
        })
        .join("\n");

      // Call Gemini API to analyze the conversation
      const response = await fetch("/api/analyze-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: conversationText,
          questions: [
            "What brought you here today?",
            "When did your symptoms start?",
            "On a scale of 0 to 10, how bad is it right now?",
            "Where on your body are you feeling this?",
            "Has it been getting better, worse, or staying the same?",
            "Do you know what might've caused this?",
            "Have you had any fever, shortness of breath, or other symptoms?",
            "Are you able to walk and speak normally right now?",
            "Any recent surgeries or injuries related to this?",
            "Do you have any allergies we should know about?",
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze conversation");
      }

      const assessmentData: AssessmentResponse = await response.json();

      // You can handle the parsed data here, e.g. display it or send it somewhere
      console.log("Parsed Assessment:", assessmentData);

      return assessmentData;
    } catch (error) {
      console.error("Error parsing messages:", error);
      throw error;
    }
  };

  if (readyState === VoiceReadyState.OPEN) {
    return (
      <div>
        <Button
          className="w-full"
          variant={"outline"}
          onClick={() => {
            parseMessages()
              .then((assessment) => {
                // Handle successful parsing
                console.log("Assessment complete:", assessment);
                setChatbotSummary(assessment.chiefComplaint);
              })
              .catch((error) => {
                // Handle any errors
                console.error("Assessment failed:", error);
              });
            disconnect();
          }}
        >
          <MicOff />
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full"
      variant={"outline"}
      onClick={() => {
        setConnecting(true);
        connect()
          .then(() => {
            setConnecting(false);
          })
          .catch(() => {
            setConnecting(false);
          });
      }}
      disabled={connecting}
    >
      {connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Mic className="mr-2 h-4 w-4" />
          Start Session
        </>
      )}
    </Button>
  );
}

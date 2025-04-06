"use client";

import ClientInterface from "@/components/Chatbot";
import TriageAssistantPage from "@/components/TriageAssistant";
import { Button } from "@/components/ui/button";
import UserInfo from "@/components/UserInfo";
import { AlertCircle, ChevronRight, PhoneCall } from "lucide-react";
import React, { useState } from "react";
import { getRandomFloat, getRandomInt } from "@/utils/random";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Page = () => {
  const [userStart, setUserStart] = useState<boolean>(false);
  interface Patient {
    name: string;
    year: string;
    chiefComplaint: string;
  }

  const initialPatient: Patient = {
    name: "",
    year: "",
    chiefComplaint: "",
  };

  const [patient, setPatient] = useState<Patient>(initialPatient);
  const [photoSummary, setPhotoSummary] = useState<string>("");
  const [chatbotSummary, setChatbotSummary] = useState<string>("");
  const [
    ,
    // triageResult
    setTriageResult,
  ] = useState<{
    level: string;
    summary: string;
  } | null>(null);

  const runTriageGemini = async () => {
    console.log("Running Triage Gemini");
    
    const prompt = {
      task: "You are a triage nurse assistant. Analyze the provided patient information and determine the appropriate Emergency Severity Index (ESI) level.",
      outputFormat: "Return the results as a JSON object following the schema below.",
      schema: {
        type: "object",
        properties: {
          level: {
            type: "string",
            enum: ["Immediate", "Emergency", "Urgent", "Semi", "Nonurgent"],
            description: "ESI Level: 1=Immediate, 2=Emergency, 3=Urgent, 4=Semi, 5=Nonurgent"
          },
          summary: {
            type: "string",
            description: "Brief summary of chief complaint and triage assessment"
          }
        },
        required: ["level", "summary"]
      },
      guidelines: {
        "ESI 1": "Immediate - Life-threatening conditions requiring immediate intervention",
        "ESI 2": "Emergency - High-risk situation or severe pain/distress",
        "ESI 3": "Urgent - Multiple resources needed, moderate symptoms",
        "ESI 4": "Semi - One resource needed, mild symptoms",
        "ESI 5": "Nonurgent - No resources needed, minor symptoms"
      },
      input: {
        chiefComplaint: patient.chiefComplaint,
        photoDescription: photoSummary,
        chatbotSummary: chatbotSummary
      }
    };

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    try {
      console.log("Prompt:", JSON.stringify(prompt));
      const result = await model.generateContent(JSON.stringify(prompt));
      const text = result.response.text().trim();
      // Extract JSON from the response similar to route.ts
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from Gemini response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.warn("Gemini fallback:", err);
      return {
        level: "Nonurgent",
        summary: "Unable to determine based on available data",
      };
    }
  };

  return (
    <>
      {/* Start Button */}
      {!userStart ? (
        <main className="h-screen w-full flex items-center justify-center">
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#0196C8] mb-2">
                  Welcome to the Hospital
                </h1>
                <p className="text-xl text-gray-600">
                  Please select an option below to begin
                </p>
              </div>

              <div className="grid gap-6">
                <Button
                  className="bg-[#0196C8] hover:bg-[#0196C8]/80 text-white text-2xl p-8 h-auto rounded-xl shadow-lg"
                  onClick={() => setUserStart(true)}
                >
                  Click to Check In
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Button>

                <Button className="bg-transparent border-red-300 border-2 text-red-700 hover:text-red-700 hover:bg-red-50 text-2xl p-8 h-auto rounded-xl shadow-md flex items-center justify-center">
                  <PhoneCall className="mr-3 h-6 w-6" />
                  Call for Immediate Assistance
                </Button>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center justify-center gap-2 bg-amber-50 text-amber-800 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">
                    If you&apos;re experiencing a life-threatening emergency,
                    please alert staff immediately
                  </p>
                </div>
              </div>
            </div>
          </main>
        </main>
      ) : (
        <div className="flex w-full min-h-screen gap-2">
          <UserInfo patient={patient} setPatient={setPatient} />
          <div className="flex flex-col min-h-screen pb-3 justify-between">
            <TriageAssistantPage setPhotoSummary={setPhotoSummary} />
            <Button
              className="bg-green-500 hover:bg-green-500/80"
              onClick={async () => {
                const triage = await runTriageGemini();
                setTriageResult(triage);

                const payload = {
                  name: patient.name,
                  age: patient.year,
                  patientId: Date.now().toString().slice(-6),
                  triageLevel: triage.level,
                  chiefComplaint: chatbotSummary,
                  chiefComplaintSummary: triage.summary,
                  vitalSigns: {
                    bp: `${getRandomInt(100, 140)}/${getRandomInt(60, 90)}`,
                    hr: `${getRandomInt(60, 100)}`,
                    rr: `${getRandomInt(12, 20)}`,
                    temp: `${getRandomFloat(97.0, 99.5).toFixed(1)}`,
                    o2: `${getRandomInt(95, 100)}`,
                  },
                  waitingTime: 0,
                  onsetTime: "",
                  severity: 0,
                  location: "",
                  progression: "",
                  trigger: "",
                  mobility: "",
                  medicalHistory: "",
                  allergies: "",
                };

                await fetch("/api/patient", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
              }}
            >
              Check In
            </Button>
          </div>
          <div className="flex-1 min-h-screen">
            <ClientInterface setChatbotSummary={setChatbotSummary} />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;

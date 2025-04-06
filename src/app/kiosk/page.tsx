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
    const prompt = `
You are a triage nurse assistant. Given a patient's self-reported complaint, a visual description from an image, and a conversation summary from a chatbot, determine the appropriate Emergency Severity Index (ESI) level (1–5) and a short chief complaint summary.

Return output ONLY in the following JSON format:
{
  "level": "Immediate" | "Emergency" | "Urgent" | "Semi" | "Nonurgent",
  "summary": "..."
}

### Guidelines:
ESI 1 – Immediate  → level: "Immediate"
ESI 2 – Emergent   → level: "Emergency"
ESI 3 – Urgent     → level: "Urgent"
ESI 4 – Less urgent → level: "Semi"
ESI 5 – Non-urgent → level: "Nonurgent"

If the information is insufficient to determine severity, default to:
{
  "level": "Nonurgent",
  "summary": "Unable to determine based on available data"
}

---
Input:
Chief Complaint: ${patient.chiefComplaint}
Photo Description: ${photoSummary}
Chatbot Summary: ${chatbotSummary}

Respond only with the JSON.
`;

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || ""
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      return JSON.parse(text);
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
                  year: patient.year,
                  triageLevel: triage.level,
                  chiefComplaintSummary: triage.summary,
                  vitals: {
                    bp: `${getRandomInt(100, 140)}/${getRandomInt(60, 90)}`,  // systolic/diastolic
                    hr: getRandomInt(60, 100),    // bpm
                    rr: getRandomInt(12, 20),     // breaths/min
                    temp: getRandomFloat(97.0, 99.5).toFixed(1), // Fahrenheit
                    o2: getRandomInt(95, 100),    // O2 saturation %
                  },
                  time: Date.now(),
                  patientID: Date.now().toString().slice(-6),
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

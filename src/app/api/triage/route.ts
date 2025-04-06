// /app/api/triage/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure the API key is available
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

const TRIAGE_PROMPT = `
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
Chief Complaint: {{chiefComplaint}}
Photo Description: {{photoSummary}}
Chatbot Summary: {{chatbotSummary}}

Respond only with the JSON.
`;

export async function POST(req: Request) {
  try {
    const { chiefComplaint, photoSummary, chatbotSummary } = await req.json();

    const prompt = TRIAGE_PROMPT.replace(
      "{{chiefComplaint}}",
      chiefComplaint || ""
    )
      .replace("{{photoSummary}}", photoSummary || "")
      .replace("{{chatbotSummary}}", chatbotSummary || "");

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Attempt to parse JSON
    try {
      const parsed = JSON.parse(responseText);
      return NextResponse.json(parsed);
    } catch (err) {
      console.warn(
        "Invalid JSON returned from Gemini, falling back to default",
        err
      );
      return NextResponse.json({
        level: "Nonurgent",
        summary: "Unable to determine based on available data",
      });
    }
  } catch (error) {
    console.error("Error in triage endpoint:", error);
    return NextResponse.json(
      {
        level: "Nonurgent",
        summary: "Unable to determine due to system error",
      },
      { status: 500 }
    );
  }
}

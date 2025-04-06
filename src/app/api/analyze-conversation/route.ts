import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the structure for medical analysis
interface MedicalAnalysis {
  chiefComplaint: string;  // What brought you here today?
  onsetTime: string;       // When did symptoms start?
  severity: number;        // Pain scale 0-10
  location: string;        // Where on body?
  progression: string;     // Better/worse/same?
  trigger: string;         // What caused it?
  vitalSigns: string;      // Fever, SOB, other symptoms?
  mobility: string;        // Walking/speaking normally?
  medicalHistory: string;  // Recent surgeries/injuries?
  allergies: string;       // Known allergies?
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { conversation, questions } = await request.json();

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create structured prompt
    const prompt = {
      task: "Analyze this medical conversation and extract answers to the following questions: " + questions,
      outputFormat: "Return the results as a JSON object with specific fields.",
      schema: {
        type: "object",
        properties: {
          chiefComplaint: { type: "string", description: "What brought you here today?" },
          onsetTime: { type: "string", description: "When did symptoms start?" },
          severity: { type: "number", description: "Pain scale 0-10", minimum: 0, maximum: 10 },
          location: { type: "string", description: "Where on body?" },
          progression: { type: "string", description: "Better/worse/same?" },
          trigger: { type: "string", description: "What caused it?" },
          vitalSigns: { type: "string", description: "Fever, SOB, other symptoms?" },
          mobility: { type: "string", description: "Walking/speaking normally?" },
          medicalHistory: { type: "string", description: "Recent surgeries/injuries?" },
          allergies: { type: "string", description: "Known allergies?" }
        },
        required: ["chiefComplaint", "onsetTime", "severity", "location", "progression", 
                  "trigger", "vitalSigns", "mobility", "medicalHistory", "allergies"]
      },
      conversation
    };

    // Get response from Gemini
    const result = await model.generateContent(JSON.stringify(prompt));
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]) as MedicalAnalysis;

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error in analyze-conversation:', error);
    return NextResponse.json(
      { error: 'Failed to analyze conversation' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db-connect";
import { Patient } from "@/lib/models/patient";

const validTriageLevels = [
  "Immediate",
  "Emergency",
  "Urgent",
  "Semi",
  "Nonurgent",
];

export async function POST(req: NextRequest) {
  try {
    // Connect to the MongoDB database
    await dbConnect();

    const body = await req.json();
    console.log("Incoming body:", body);
    const {
      name,
      year,
      triageLevel,
      vitals,
      time,
      patientID,
      chiefComplaintSummary,
    } = body;

    // Validate required fields
    if (!name || !year || !triageLevel || !patientID) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!validTriageLevels.includes(triageLevel)) {
      return NextResponse.json(
        { error: "Invalid triage level" },
        { status: 400 }
      );
    }

    const newPatient = new Patient({
      name,
      age: parseInt(year),
      patientId: patientID,
      triageLevel,
      vitalSigns: {
        bp: vitals?.bp ?? "N/A",
        hr: Number.isNaN(parseInt(vitals?.hr)) ? 0 : parseInt(vitals.hr),
        rr: Number.isNaN(parseInt(vitals?.rr)) ? 0 : parseInt(vitals.rr),
        temp: vitals?.temp ?? "N/A",
        o2: Number.isNaN(parseInt(vitals?.o2)) ? 0 : parseInt(vitals.o2),
      },
      waitingTime: parseInt(time) || 0,
      chiefComplaintSummary,
    });

    const savedPatient = await newPatient.save();

    return NextResponse.json(
      {
        success: true,
        message: "Patient added successfully",
        patient: savedPatient,
      },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in POST /api/patient:", error.message);
    return NextResponse.json({ error: "Database Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const patients = await Patient.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    return NextResponse.json(patients, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in GET /api/patient:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db-connect";
import { Patient } from "@/lib/models/patient";

const validTriageLevels = ["Immediate", "Emergency", "Urgent", "Semi", "Nonurgent"];

export async function POST(req: NextRequest) {
  try {
    // Connect to the MongoDB database
    await dbConnect();

    const body = await req.json();
    const { name, year, triageLevel, vitals, time, patientID } = body;

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
        bp: vitals?.bp || "N/A",
        hr: parseInt(vitals?.hr) || 0,
        rr: parseInt(vitals?.rr) || 0,
        temp: vitals?.temp || "N/A",
        o2: parseInt(vitals?.o2) || 0,
      },
      waitingTime: parseInt(time) || 0,
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
  } catch (error: any) {
    console.error("Error in GET /api/patient:", error.message);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

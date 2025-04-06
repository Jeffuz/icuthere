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
    await dbConnect();

    const body = await req.json();
    console.log("Incoming body:", body);
    
    // Destructure all fields defined in the schema
    const {
      name,
      age,
      patientId,
      triageLevel,
      chiefComplaint,
      chiefComplaintSummary,
      vitalSigns,
      waitingTime,
      // Medical analysis fields
      onsetTime,
      severity,
      location,
      progression,
      trigger,
      mobility,
      medicalHistory,
      allergies,
    } = body;

    // // Validate required fields based on schema
    if (!name || !age || !patientId || !triageLevel || !chiefComplaintSummary) {
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

    // Validate vital signs structure
    if (!vitalSigns || !vitalSigns.bp || !vitalSigns.hr || !vitalSigns.rr || !vitalSigns.temp || !vitalSigns.o2) {
      return NextResponse.json(
        { error: "Missing or invalid vital signs" },
        { status: 400 }
      );
    }

    const newPatient = new Patient({
      name,
      age: parseInt(age),
      patientId,
      triageLevel,
      chiefComplaint,
      chiefComplaintSummary,
      vitalSigns: {
        bp: vitalSigns.bp,
        hr: vitalSigns.hr,
        rr: vitalSigns.rr,
        temp: vitalSigns.temp,
        o2: vitalSigns.o2,
      },
      waitingTime: waitingTime || 0,
      // Include optional medical analysis fields
      onsetTime,
      severity,
      location,
      progression,
      trigger,
      mobility,
      medicalHistory,
      allergies,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in GET /api/patient:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

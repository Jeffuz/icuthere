import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from '@/lib/db-connect';
import { Patient } from '@/lib/models/patient';

export async function POST(req: NextRequest) {
    try {
        // Connect to the MongoDB database
        await dbConnect();
        
        // Parse request body
        const { name, year, triageLevel, vitals, time, patientID } = await req.json();
        
        // Create a new patient document
        const newPatient = new Patient({
            name,
            age: parseInt(year), // Assuming year is the patient's age or birth year
            patientId: patientID,
            triageLevel,
            vitalSigns: {
                bp: vitals.bp || 'N/A',
                hr: vitals.hr || 0,
                rr: vitals.rr || 0,
                temp: vitals.temp || 'N/A',
                o2: vitals.o2 || 0
            },
            waitingTime: time || 0
        });
        
        // Save the patient document to the database
        const savedPatient = await newPatient.save();
        
        // Return success response with the saved patient data
        return NextResponse.json({ 
            success: true, 
            message: 'Patient added successfully',
            patient: savedPatient 
        }, { status: 201 });
    }
    catch (error) {
        console.error('Error in patient route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        // Connect to the MongoDB database
        await dbConnect();
        
        // Fetch all patients from the database and exclude the __v field
        const patients = await Patient.find()
            .select('-__v')  // This excludes the __v field
            .sort({ createdAt: -1 }); // Sort by most recent
        
        // Return patients array directly without a wrapper object
        return NextResponse.json(patients, { status: 200 });
    }
    catch (error) {
        console.error('Error fetching patients:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
import mongoose, { Document, Schema } from "mongoose";
import { TriageLevel, VitalSigns } from "@/types/patient";

// Define the Patient document interface for MongoDB
export interface IPatient extends Document {
  name: string;
  age: number;
  patientId: string;
  triageLevel: TriageLevel;
  chiefComplaint?: string;
  chiefComplaintSummary: string;
  vitalSigns: VitalSigns;
  waitingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Patient schema
const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
    },
    age: {
      type: Number,
      required: [true, "Patient age is required"],
    },
    patientId: {
      type: String,
      required: [true, "Patient ID is required"],
      unique: true,
    },
    triageLevel: {
      type: String,
      required: [true, "Triage level is required"],
      enum: ["Immediate", "Emergency", "Urgent", "Semi", "Nonurgent"],
    },
    chiefComplaint: {
      type: String,
    },
    chiefComplaintSummary: {
      type: String,
      required: [true, "Chief complaint summary is required"], 
    },
    vitalSigns: {
      bp: { type: String, required: true },
      hr: { type: String, required: true },
      rr: { type: String, required: true },
      temp: { type: String, required: true },
      o2: { type: String, required: true },
    },
    waitingTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Create and export the Patient model
// The conditional check prevents errors during hot-reloading in development
export const Patient =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", patientSchema);

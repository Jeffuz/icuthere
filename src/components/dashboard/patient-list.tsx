"use client";

import { PatientCard } from "./patient-card";
import type { Patient } from "@/types/patient";

const patients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    age: 45,
    patientId: "P001",
    triageLevel: "Immediate",
    chiefComplaint: "Chest pain, shortness of breath, began 1 hour ago",
    vitalSigns: {
      bp: "160/95",
      hr: 110,
      rr: 22,
      temp: "99.1°F",
      o2: 92,
    },
    waitingTime: 158,
  },
  {
    id: "2",
    name: "Michael Wong",
    age: 72,
    patientId: "P003",
    triageLevel: "Immediate",
    chiefComplaint: "Fall, possible hip fracture, severe pain",
    vitalSigns: {
      bp: "145/85",
      hr: 88,
      rr: 20,
      temp: "98.6°F",
      o2: 96,
    },
    waitingTime: 151,
  },
  {
    id: "3",
    name: "Lisa Martinez",
    age: 28,
    patientId: "P006",
    triageLevel: "Urgent",
    chiefComplaint: "Abdominal pain, vomiting, last 4 hours",
    vitalSigns: {
      bp: "110/70",
      hr: 90,
      rr: 18,
      temp: "99.8°F",
      o2: 98,
    },
    waitingTime: 176,
  },
  {
    id: "4",
    name: "Emma Johnson",
    age: 8,
    patientId: "P002",
    triageLevel: "Urgent",
    chiefComplaint: "Fever, cough for 3 days, no appetite",
    vitalSigns: {
      bp: "100/70",
      hr: 95,
      rr: 18,
      temp: "102.3°F",
      o2: 97,
    },
    waitingTime: 171,
  },
  {
    id: "5",
    name: "Sarah Garcia",
    age: 35,
    patientId: "P004",
    triageLevel: "Semi",
    chiefComplaint: "Migraine headache, nausea, photophobia",
    vitalSigns: {
      bp: "120/80",
      hr: 75,
      rr: 16,
      temp: "98.9°F",
      o2: 99,
    },
    waitingTime: 186,
  },
  {
    id: "6",
    name: "Robert Chen",
    age: 64,
    patientId: "P005",
    triageLevel: "Nonurgent",
    chiefComplaint: "Lower back pain, difficulty walking",
    vitalSigns: {
      bp: "135/85",
      hr: 72,
      rr: 14,
      temp: "98.6°F",
      o2: 98,
    },
    waitingTime: 201,
  },
];

export function PatientList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
}

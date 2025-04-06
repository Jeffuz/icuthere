"use client";

import { PatientCard } from "./patient-card";
import type { Patient } from "@/types/patient";

interface PatientListProps {
  patients: Patient[];
  assignRoom: (patient: Patient) => void;
}

export function PatientList({ patients, assignRoom }: PatientListProps) {

  if (!patients.length) return <p>No waiting patients.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {patients.map((patient) => (
        <PatientCard key={patient.patientId} patient={patient} assignRoom={assignRoom}/>
      ))}
    </div>
  );
}

"use client";

import { PatientCard } from "./patient-card";
import type { Patient } from "@/types/patient";
import { useEffect, useState } from "react";

export function PatientList() {
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patient");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  if (loading) return <p>Loading patients...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {patients.map((patient) => (
        <PatientCard key={patient.patientId} patient={patient} />
      ))}
    </div>
  );
}

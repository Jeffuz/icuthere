"use client";

import { Clock } from "lucide-react";
import type { Patient } from "@/types/patient";
import {
  getTriageBadgeColor,
  getTriageButtonColor,
} from "@/utils/triage-colors";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const badgeColor = getTriageBadgeColor(patient.triageLevel);
  const buttonColor = getTriageButtonColor(patient.triageLevel);

  return (
    <div
      className={`bg-white rounded-lg border p-5 ${
        patient.triageLevel === "Immediate"
          ? "border-[#FF0808]"
          : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-medium text-gray-700">{patient.name}</h3>
          <p className="text-gray-500">
            {patient.age} years • Patient ID: {patient.patientId}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}
        >
          {patient.triageLevel}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-500 font-medium">Chief Complaint:</p>
        <p className="text-gray-700 lie-clamp-1">{patient.chiefComplaint}</p>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">BP</p>
          <p className="font-medium">{patient.vitalSigns.bp}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">HR</p>
          <p className="font-medium">{patient.vitalSigns.hr}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">RR</p>
          <p className="font-medium">{patient.vitalSigns.rr}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Temp</p>
          <p className="font-medium">{patient.vitalSigns.temp}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">
            O<sub>2</sub>
          </p>
          <p className="font-medium">{patient.vitalSigns.o2}%</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Waiting: {patient.waitingTime} min</span>
        </div>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${buttonColor}`}
        >
          Assign Room
        </button>
      </div>
    </div>
  );
}

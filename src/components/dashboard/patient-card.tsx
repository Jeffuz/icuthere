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
      className={`bg-white w-full rounded-lg border p-5 ${
        patient.triageLevel === "Immediate"
          ? "border-[#FF0808]"
          : "border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-medium text-gray-700">{patient.name}</h3>
          <p className="text-gray-500 text-sm">
            {patient.age} years • Patient ID: {patient.patientId}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${badgeColor}`}
        >
          {patient.triageLevel}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-500 font-medium text-sm">Chief Complaint:</p>
        <p className="text-gray-700 lie-clamp-1 text-xs">{patient.chiefComplaint}</p>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">BP</p>
          <p className="font-medium text-sm">{patient.vitalSigns.bp}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">HR</p>
          <p className="font-medium text-sm">{patient.vitalSigns.hr}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">RR</p>
          <p className="font-medium text-sm">{patient.vitalSigns.rr}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Temp</p>
          <p className="font-medium text-sm">{patient.vitalSigns.temp}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            O<sub>2</sub>
          </p>
          <p className="font-medium text-sm">{patient.vitalSigns.o2}%</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Waiting: {patient.waitingTime} min</span>
        </div>
        <div></div>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${buttonColor}`}
        >
          Assign Room
        </button>
      </div>
    </div>
  );
}

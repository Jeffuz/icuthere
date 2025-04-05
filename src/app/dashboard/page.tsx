import { TriageCard } from "@/components/dashboard/TriageStats";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import React from "react";

export type TriageLevel =
  | "Immediate"
  | "Emergency"
  | "Urgent"
  | "Semi"
  | "Nonurgent";

export interface TriageStats {
  level: TriageLevel;
  patients: number;
  avgMinutes: number;
  color: string;
}

export const triageData: TriageStats[] = [
  {
    level: "Immediate",
    patients: 1,
    avgMinutes: 139,
    color: "#FF0808",
  },
  {
    level: "Emergency",
    patients: 1,
    avgMinutes: 132,
    color: "#FF8406",
  },
  {
    level: "Urgent",
    patients: 2,
    avgMinutes: 155,
    color: "#FFFF09",
  },
  {
    level: "Semi",
    patients: 1,
    avgMinutes: 167,
    color: "#089C07",
  },
  {
    level: "Nonurgent",
    patients: 1,
    avgMinutes: 182,
    color: "#0A6BCE",
  },
];

const page = () => {
  return (
    <main>
      <Navbar />
      <div className="flex flex-row">
        <Sidebar />
        {/* Content */}
        <div className="flex flex-col w-full p-6 space-y-6">
          {/* Stats */}
          <div className="flex w-full justify-between items-center">
            {/* Header */}
            <h1 className="text-[#023E8A] font-bold text-2xl">
              Emergency Department Triage
            </h1>
            <Button className="bg-[#0196C8] hover:bg-[#0196C8]/80 text-white h-[42px]">
              Register New Patient
            </Button>
          </div>
          {/* Current Hostpital Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {triageData.map((triage) => (
              <TriageCard key={triage.level} data={triage} />
            ))}
          </div>
          {/* Hospital Data */}
          <div></div>
        </div>
      </div>
    </main>
  );
};

export default page;

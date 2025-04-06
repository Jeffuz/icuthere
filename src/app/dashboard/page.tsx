"use client";

import { PatientList } from "@/components/dashboard/patient-list";
import RoomStatus from "@/components/dashboard/room-status";
import { TriageCard } from "@/components/dashboard/TriageStats";
import Navbar from "@/components/Navbar";
// import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
type TriageLevel = "Immediate" | "Emergency" | "Urgent" | "Semi" | "Nonurgent";

interface TriageStats {
  level: TriageLevel;
  patients: number;
  avgMinutes: number;
  color: string;
}

const triageData: TriageStats[] = [
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
        {/* <Sidebar /> */}
        {/* Content */}
        <div className="flex flex-col w-full p-8 space-y-6">
          {/* Stats */}
          <div className="flex w-full justify-between items-center">
            {/* Header */}
            <h1 className="text-[#023E8A] font-bold text-2xl">
              Emergency Department Triage
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#0196C8] hover:bg-[#0196C8]/80 text-white h-[42px]">
                  Register New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-screen-xl sm:max-w-screen-lg lg:max-w-screen-xl p-6">
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between w-full">
                  <DialogTitle className="text-xl font-bold">
                    Register New Patient
                  </DialogTitle>
                </DialogHeader>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Patient Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base">
                        Patient Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Full name"
                        required
                      />
                    </div>

                    {/* Patient Age */}
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-base">
                        Age <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Age in years"
                        required
                      />
                    </div>
                  </div>

                  {/* Chief Complaint */}
                  <div className="space-y-2">
                    <Label htmlFor="chiefComplaint" className="text-base">
                      Chief Complaint <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="chiefComplaint"
                      name="chiefComplaint"
                      placeholder="Describe the main reason for visit"
                      required
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Triage Level */}
                  <div className="space-y-3">
                    <Label className="text-base">
                      Triage Level <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup className="flex flex-wrap gap-6" required>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Critical"
                          id="critical"
                          className="text-[#FF0808] border-[#FF0808"
                        />
                        <Label
                          htmlFor="critical"
                          className="text-[#FF0808] font-medium"
                        >
                          Critical
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Emergency"
                          id="emergency"
                          className="text-[#FF8406] border-[#FF8406"
                        />
                        <Label
                          htmlFor="emergency"
                          className="text-[#FF8406] font-medium"
                        >
                          Emergency
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Urgent"
                          id="urgent"
                          className="text-[#FFA500] border-[#FFA500]"
                        />
                        <Label
                          htmlFor="urgent"
                          className="text-[#FFA500] font-medium"
                        >
                          Urgent
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Semi"
                          id="semi"
                          className="text-[#089C07] border-[#089C07]"
                        />
                        <Label
                          htmlFor="semi"
                          className="text-[#089C07] font-medium"
                        >
                          Standard
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Nonurgent"
                          id="nonurgent"
                          className="text-[#0A6BCE] border-[#0A6BCE]"
                        />
                        <Label
                          htmlFor="nonurgent"
                          className="text-[#0A6BCE] font-medium"
                        >
                          Non-Urgent
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Vital Signs */}
                  <div className="space-y-3">
                    <Label className="text-base">Vital Signs</Label>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                      <div className="space-y-2">
                        <Label htmlFor="bp" className="text-sm">
                          Blood Pressure
                        </Label>
                        <Input
                          id="bp"
                          name="vitalSigns.bp"
                          placeholder="120/80"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hr" className="text-sm">
                          Heart Rate
                        </Label>
                        <Input id="hr" name="vitalSigns.hr" placeholder="BPM" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rr" className="text-sm">
                          Resp. Rate
                        </Label>
                        <Input
                          id="rr"
                          name="vitalSigns.rr"
                          placeholder="breaths/m"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temp" className="text-sm">
                          Temperature
                        </Label>
                        <Input
                          id="temp"
                          name="vitalSigns.temp"
                          placeholder="°F"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="o2" className="text-sm">
                          O₂ Saturation
                        </Label>
                        <Input id="o2" name="vitalSigns.o2" placeholder="%" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-[#0F172A] hover:bg-[#1E293B] h-[42px]"
                    >
                      Register Patient
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {/* Current Hostpital Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {triageData.map((triage) => (
              <TriageCard key={triage.level} data={triage} />
            ))}
          </div>
          {/* Hospital Data */}
          <div className="flex min-md:space-x-6 md:flex-row flex-col">
            {/* Waiting Patients */}
            <div className="flex flex-col gap-6 min-md:w-[70%]">
              {/* Header */}
              <h2 className="text-lg font-medium">Waiting Patients</h2>
              {/* Patient Panels */}
              <PatientList />
            </div>
            {/* Room Status */}
            <div className="min-md:w-[30%]">
              <RoomStatus />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;

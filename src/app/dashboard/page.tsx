"use client";
import { useState, useEffect } from "react";
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
import { Patient } from "@/types/patient";
import type { Room } from "@/types/rooms";
import { rooms as initialRooms } from "@/components/dashboard/room-status";

type TriageLevel = "Immediate" | "Emergency" | "Urgent" | "Semi" | "Nonurgent";

interface TriageStats {
  level: TriageLevel;
  patients: number;
  avgMinutes: number;
  color: string;
}

const Dashboard = () => {
  const [listKey, setListKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    chiefComplaint: "",
    triageLevel: "",
    bp: "",
    hr: "",
    rr: "",
    temp: "",
    o2: "",
  });
  const [patients, setPatients] = useState([]);
  const [triageStats, setTriageStats] = useState<TriageStats[]>([]);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  
  const assignRoom = (patient: Patient) => {
    const firstAvailable = rooms.find((r) => r.status === "Available");
    if (!firstAvailable) {
      alert("No available rooms");
      return;
    }
  
    const updatedRooms: Room[] = rooms.map((room) =>
      room.id === firstAvailable.id
        ? {
            ...room,
            status: "Occupied" as Room["status"],
            patientName: patient.name,
            lastUpdated: new Date().toISOString(),
          }
        : room
    );
  
    setRooms(updatedRooms);
    setPatients((prev) =>
      prev.filter((p) => p.patientId !== patient.patientId)
    );
  };
  

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patient");
        const data = await res.json();
        setPatients(data);

        const colorMap: Record<TriageLevel, string> = {
          Immediate: "#FF0808",
          Emergency: "#FF8406",
          Urgent: "#FFFF09",
          Semi: "#089C07",
          Nonurgent: "#0A6BCE",
        };

        // Count patients per triage level
        const counts: Record<TriageLevel, number> = {
          Immediate: 0,
          Emergency: 0,
          Urgent: 0,
          Semi: 0,
          Nonurgent: 0,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((p: any) => {
          if (counts[p.triageLevel as TriageLevel] !== undefined) {
            counts[p.triageLevel as TriageLevel]++;
          }
        });

        // Create TriageStats array
        const stats: TriageStats[] = (Object.keys(counts) as TriageLevel[]).map(
          (level) => ({
            level,
            patients: counts[level],
            avgMinutes: 0, // optional: update this if you have wait time info
            color: colorMap[level],
          })
        );

        setTriageStats(stats);
      } catch (err) {
        console.error("Failed to fetch patients", err);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTriageChange = (value: string) => {
    setForm((prev) => ({ ...prev, triageLevel: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      year: form.age,
      triageLevel: form.triageLevel,
      vitalSigns: {
        bp: form.bp,
        hr: form.hr,
        rr: form.rr,
        temp: form.temp,
        o2: form.o2,
      },
      time: Date.now(),
      patientID: Date.now().toString().slice(-6),
      chiefComplaintSummary: form.chiefComplaint,
    };

    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Patient registered successfully!");
        setForm({
          name: "",
          age: "",
          chiefComplaint: "",
          triageLevel: "",
          bp: "",
          hr: "",
          rr: "",
          temp: "",
          o2: "",
        });
        setDialogOpen(false);
        setListKey((prev) => prev + 1);
      } else {
        const error = await res.json();
        alert("Error: " + error.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to register patient.");
    }
  };

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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Patient Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base">
                        Patient Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
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
                        value={form.age}
                        onChange={handleChange}
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
                      value={form.chiefComplaint}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Triage Level */}
                  <div className="space-y-3">
                    <Label className="text-base">
                      Triage Level <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      className="flex flex-wrap gap-6"
                      required
                      onValueChange={handleTriageChange}
                      value={form.triageLevel}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Immediate"
                          id="imediate"
                          className="text-[#FF0808] border-[#FF0808"
                        />
                        <Label
                          htmlFor="immediate"
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
                          name="bp"
                          value={form.bp}
                          onChange={handleChange}
                          placeholder="120/80"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hr" className="text-sm">
                          Heart Rate
                        </Label>
                        <Input
                          id="hr"
                          name="hr"
                          value={form.hr}
                          onChange={handleChange}
                          placeholder="BPM"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rr" className="text-sm">
                          Resp. Rate
                        </Label>
                        <Input
                          id="rr"
                          name="rr"
                          value={form.rr}
                          onChange={handleChange}
                          placeholder="breaths/m"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temp" className="text-sm">
                          Temperature
                        </Label>
                        <Input
                          id="temp"
                          name="temp"
                          value={form.temp}
                          onChange={handleChange}
                          placeholder="°F"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="o2" className="text-sm">
                          O₂ Saturation
                        </Label>
                        <Input
                          id="o2"
                          name="o2"
                          value={form.o2}
                          onChange={handleChange}
                          placeholder="%"
                        />
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
            {triageStats.map((triage) => (
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
              <PatientList key={listKey} assignRoom={assignRoom} patients={patients} />
            </div>
            {/* Room Status */}
            <div className="min-md:w-[30%]">
              <RoomStatus rooms={rooms}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

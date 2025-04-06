export type TriageLevel =
  | "Immediate"
  | "Emergency"
  | "Urgent"
  | "Semi"
  | "Nonurgent";

export interface VitalSigns {
  bp: string;
  hr: number;
  rr: number;
  temp: string;
  o2: number;
}

export interface Patient {
  name: string;
  age: number;
  patientId: string;
  triageLevel: "Immediate" | "Emergency" | "Urgent" | "Semi" | "Nonurgent";
  chiefComplaintSummary?: string;
  vitalSigns: {
    bp: string;
    hr: number;
    rr: number;
    temp: string;
    o2: number;
  };
  waitingTime: number;
}

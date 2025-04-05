export type TriageLevel = "Immediate" | "Emergency" | "Urgent" | "Semi" | "Nonurgent"

export interface VitalSigns {
  bp: string
  hr: number
  rr: number
  temp: string
  o2: number
}

export interface Patient {
  id: string
  name: string
  age: number
  patientId: string
  triageLevel: TriageLevel
  chiefComplaint: string
  vitalSigns: VitalSigns
  waitingTime: number
}


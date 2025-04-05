export type RoomStatus = "Available" | "Occupied" | "Reserved" | "Cleaning"

export interface Room {
  id: string
  number: string
  status: RoomStatus
  patientName?: string
  lastUpdated: string
}


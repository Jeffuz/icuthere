import type { RoomStatus } from "@/types/rooms";

export const getRoomStatusColor = (status: RoomStatus): string => {
  switch (status) {
    case "Available":
      return "bg-green-100 border-green-300 text-green-800";
    case "Occupied":
      return "bg-blue-100 border-blue-300 text-blue-800";
    case "Reserved":
      return "bg-yellow-100 border-yellow-300 text-yellow-800";
    case "Cleaning":
      return "bg-purple-100 border-purple-300 text-purple-800";
    default:
      return "bg-gray-100 border-gray-300 text-gray-800";
  }
};

export const getRoomStatusDotColor = (status: RoomStatus): string => {
  switch (status) {
    case "Available":
      return "bg-green-500";
    case "Occupied":
      return "bg-blue-500";
    case "Reserved":
      return "bg-yellow-500";
    case "Cleaning":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export const getRoomStatusSubtitle = (
  status: RoomStatus,
  patientName?: string
): string => {
  switch (status) {
    case "Available":
      return "Ready for patient";
    case "Occupied":
      return patientName || "Occupied";
    case "Reserved":
      return "Reserved";
    case "Cleaning":
      return "In preparation";
    default:
      return "";
  }
};

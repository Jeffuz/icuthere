import type { Room } from "@/types/rooms";
import {
  getRoomStatusColor,
  getRoomStatusDotColor,
  getRoomStatusSubtitle,
} from "@/utils/room-status-colors";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const statusColor = getRoomStatusColor(room.status);
  const dotColor = getRoomStatusDotColor(room.status);
  const subtitle = getRoomStatusSubtitle(room.status, room.patientName);

  return (
    <div className={`rounded-lg border p-3 ${statusColor}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold">Room {room.number}</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
          <span className="font-medium text-sm">{room.status}</span>
        </div>
      </div>

      <p className="text-sm mb-2">{subtitle}</p>

      <div className="flex justify-between items-center text-xs">
        {/* <span>{room.department}</span> */}
        <span>
          Updated:{" "}
          {new Date(room.lastUpdated).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

// RoomStatus.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomCard } from "./room-card";
import type { Room } from "@/types/rooms";

interface RoomStatusProps {
  rooms: Room[];
}

export const rooms: Room[] = [
  {
    id: "r1",
    number: "101",
    status: "Available",
    lastUpdated: "2025-04-05T08:30:00Z",
  },
  {
    id: "r2",
    number: "102",
    status: "Occupied",
    patientName: "John Smith",
    lastUpdated: "2025-04-05T07:45:00Z",
  },
  {
    id: "r3",
    number: "103",
    status: "Reserved",
    lastUpdated: "2025-04-05T08:15:00Z",
  },
  {
    id: "r4",
    number: "104",
    status: "Cleaning",
    lastUpdated: "2025-04-05T08:00:00Z",
  },
  {
    id: "r5",
    number: "105",
    status: "Available",
    lastUpdated: "2025-04-05T08:45:00Z",
  },
  {
    id: "r6",
    number: "201",
    status: "Occupied",
    patientName: "Emma Johnson",
    lastUpdated: "2025-04-05T06:30:00Z",
  },
  {
    id: "r7",
    number: "202",
    status: "Cleaning",
    lastUpdated: "2025-04-05T08:20:00Z",
  },
  {
    id: "r8",
    number: "203",
    status: "Available",
    lastUpdated: "2025-04-05T08:50:00Z",
  },
];

const RoomStatus = ({ rooms }: RoomStatusProps) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-lg font-medium">Room Status</h2>
      <Tabs defaultValue="all" className="w-full flex-wrap">
        <TabsList className="w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="occupied">Occupied</TabsTrigger>
          <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
          <TabsTrigger value="reserved">Reserved</TabsTrigger>
        </TabsList>

        {["all", "available", "occupied", "cleaning", "reserved"].map(
          (status) => (
            <TabsContent value={status} className="mt-4" key={status}>
              <div className="flex flex-col gap-3 pr-1">
                {(rooms || [])
                  .filter((room) =>
                    status === "all"
                      ? true
                      : room.status.toLowerCase() === status
                  )
                  .map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
              </div>
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
};

export default RoomStatus;

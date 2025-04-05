"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
    // Bell, 
    Clock, 
    UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now);
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); //min

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#F9FAFB]/95 border-gray-300 backdrop-blur-sm">
      <div className="mx-auto px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="font-bold text-xl text-[#023E8A]"><span className="text-[#0096C7]">ICU</span>there</div>
        </Link>

        {/* User Information */}
        <div className="flex items-center gap-8">
          {/* Time */}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">{currentTime}</span>
          </div>

          {/* @TODO: Notification feature  */}
          {/* Notification */}
          {/* <div className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-400"></span>
          </div> */}

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-white font-medium bg-[#0096C7]">
                <UserRound />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">Hello User!</span>
              <span className="text-xs text-gray-500">ER Physician</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

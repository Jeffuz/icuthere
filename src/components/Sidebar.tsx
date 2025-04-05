"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
//   Users,
  //   Calendar,
  //   BarChart,
  //   MessageSquare,
  //   User,
  //   Settings,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  hasNotification?: boolean;
}

function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
        isActive
          ? "bg-[#D9F2FB] text-[#023E8A]"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="relative">{icon}</div>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-gray-200 bg-white">
      <div className="flex flex-col py-4">
        <nav className="flex flex-col space-y-3 px-4">
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
          />
          {/* <NavItem
            href="/patients"
            icon={<Users className="h-5 w-5" />}
            label="Patients"
          /> */}
          {/* <NavItem
            href="/appointments"
            icon={<Calendar className="h-5 w-5" />}
            label="Appointments"
          />
          <NavItem
            href="/analytics"
            icon={<BarChart className="h-5 w-5" />}
            label="Analytics"
          />
          <NavItem
            href="/messages"
            icon={<MessageSquare className="h-5 w-5" />}
            label="Messages"
          />
          <NavItem
            href="/staff"
            icon={<User className="h-5 w-5" />}
            label="Staff"
          />
          <NavItem
            href="/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
          /> */}
        </nav>
      </div>
    </div>
  );
}

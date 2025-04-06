"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DemoPage() {
  const router = useRouter();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#023E8A] mb-2">
            ICUthere Demo
          </h1>
          <p className="text-xl text-gray-600">Select your role to continue</p>
        </div>

        {/* Button Container */}
        <div className="grid md:grid-cols-2 gap-6 px-4">
          {/* Patient Button */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredButton("patient")}
            onHoverEnd={() => setHoveredButton(null)}
          >
            <Card
              className="relative overflow-hidden cursor-pointer h-64 border-2 hover:border-[#0088cc] transition-all duration-300 shadow-md hover:shadow-xl"
              onClick={() => router.push("/kiosk")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0088cc] to-[#006699] opacity-90 transition-opacity duration-300" />

              <div className="relative h-full flex flex-col items-center justify-center text-white p-6 z-10">
                <User className="h-16 w-16 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Patient</h2>
                <p className="text-center text-white/90 mb-4">
                  Access the emergency department check-in kiosk
                </p>
                <div
                  className={`mt-2 transition-all duration-300 ${
                    hoveredButton === "patient" ? "translate-x-1" : ""
                  }`}
                >
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Admin Button */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredButton("admin")}
            onHoverEnd={() => setHoveredButton(null)}
          >
            <Card
              className="relative overflow-hidden cursor-pointer h-64 border-2 hover:border-[#0088cc] transition-all duration-300 shadow-md hover:shadow-xl"
              onClick={() => router.push("/dashboard")}
            >
              <div className="absolute inset-0 bg-white opacity-95" />

              <div className="relative h-full flex flex-col items-center justify-center text-gray-800 p-6 z-10">
                <Users className="h-16 w-16 mb-4 text-[#0088cc]" />
                <h2 className="text-2xl font-bold mb-2">Staff & Admin</h2>
                <p className="text-center text-gray-600 mb-4">
                  Access the medical staff dashboard and controls
                </p>
                <div
                  className={`mt-2 text-[#0088cc] transition-all duration-300 ${
                    hoveredButton === "admin" ? "translate-x-1" : ""
                  }`}
                >
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 ICUthere. All rights reserved.</p>
          <p className="mt-1">Emergency Department Triage System</p>
        </div>
      </motion.div>
    </div>
  );
}

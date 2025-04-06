"use client";

import ClientInterface from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight, PhoneCall } from "lucide-react";
import React, { useState } from "react";

const Page = () => {
  const [userStart, setUserStart] = useState<boolean>(false);

  return (
    <>
      {/* Start Button */}
      {!userStart ? (
        <main className="h-screen w-full flex items-center justify-center">
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#0196C8] mb-2">
                  Welcome to the Hospital
                </h1>
                <p className="text-xl text-gray-600">
                  Please select an option below to begin
                </p>
              </div>

              <div className="grid gap-6">
                <Button
                  className="bg-[#0196C8] hover:bg-[#0196C8]/80 text-white text-2xl p-8 h-auto rounded-xl shadow-lg"
                  onClick={() => setUserStart(true)}
                >
                  Click to Check In
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Button>

                <Button className="bg-transparent border-red-300 border-2 text-red-700 hover:text-red-700 hover:bg-red-50 text-2xl p-8 h-auto rounded-xl shadow-md flex items-center justify-center">
                  <PhoneCall className="mr-3 h-6 w-6" />
                  Call for Immediate Assistance
                </Button>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center justify-center gap-2 bg-amber-50 text-amber-800 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">
                    If you&apos;re experiencing a life-threatening emergency,
                    please alert staff immediately
                  </p>
                </div>
              </div>
            </div>
          </main>
        </main>
      ) : (
        <div className="flex w-full min-h-screen">
          <ClientInterface />
        </div>
      )}
    </>
  );
};

export default Page;

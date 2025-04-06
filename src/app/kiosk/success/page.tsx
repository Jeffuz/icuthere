"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="max-w-md w-full mx-auto text-center p-6">
        <div className="mb-8">
          <CheckCircle2 className="h-24 w-24 mx-auto text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Check-In Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your information has been submitted and you&apos;ve been added to our system.
          A healthcare provider will be with you shortly.
        </p>
        
        <div className="text-xl font-semibold text-gray-800 mb-8">
          Please take a seat in the waiting area.
        </div>
        
        <Button 
          className="bg-[#0196C8] hover:bg-[#0196C8]/80 text-white text-lg py-6 px-8 rounded-xl"
          onClick={() => router.push('/kiosk')}
        >
          Return to Check-In
        </Button>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { fetchAccessToken } from "hume";
import ClientComponent from "@/components/hume/client-component";

export default function ClientInterface() {
  const [waitingStatus, setWaitingStatus] = useState("waiting");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      const token = await fetchAccessToken({
        apiKey: String(process.env.NEXT_PUBLIC_HUME_API_KEY),
        secretKey: String(process.env.NEXT_PUBLIC_HUME_SECRET_KEY),
      });

      if (!token) {
        console.error("Failed to fetch access token");
      }
      setAccessToken(token);
    }

    fetchToken();
  }, []);

  // Simulate status change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (waitingStatus === "waiting" && Math.random() > 0.7) {
        setWaitingStatus("ready");
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [waitingStatus]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md shadow-lg border rounded-xl bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-[#0078d4] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white rounded-full" />
            <div>
              <div className="font-semibold">Emma</div>
              <div className="text-xs opacity-80 -mt-1">Virtual Assistant</div>
            </div>
          </div>
          <div className="text-white text-xl leading-none">×</div>
        </div>

        {/* Chat Interface */}
        <div className="h-[500px] overflow-y-auto px-4 py-4">
          {accessToken ? (
            <ClientComponent accessToken={accessToken} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

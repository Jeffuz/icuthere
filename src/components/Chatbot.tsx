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
    <div>
      <div className="bg-white overflow-hidden min-h-screen flex flex-col justify-between border-x">
        {/* Header */}
        <div className="bg-[#0078d4] text-white px-4 py-3 flex items-center justify-between border-t border-x border-[#0078d4]">
          <div className="flex gap-3 flex-col justify-center">
              <div className="font-semibold">Chatbot (Virtual Assistant)</div>
          </div>
        </div>
        {/* Chat Interface */}
        <div className="flex items-end h-full px-3 py-3">
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

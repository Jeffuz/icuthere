"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAccessToken } from "hume";
import ClientComponent from "@/components/hume/client-component";

export default function ClientInterface() {
  const [waitingStatus, setWaitingStatus] = useState("waiting"); // "waiting" or "ready"
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 container py-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-6">
            {accessToken ? (
              <ClientComponent accessToken={accessToken} />
            ) : (
              <div className="flex items-center justify-center p-4">
                <span className="text-muted-foreground">Loading...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

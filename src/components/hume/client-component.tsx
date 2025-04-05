// ./components/ClientComponent.tsx
"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./messages";
import Controls from "./controls";
import { Suspense } from "react";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  if (!accessToken) {
    return null;
  }

  console.log('client accessToken', accessToken)

  return (
    <Suspense fallback={<div>Loading voice interface...</div>}>
      <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
        <div className="space-y-4">
          <Messages />
          <Controls />
        </div>
      </VoiceProvider>
    </Suspense>
  );
}

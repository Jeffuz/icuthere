"use client";

import {
  VoiceProvider,
  JSONMessage,
  ConnectionMessage,
} from "@humeai/voice-react";
import Messages from "./messages";
import Controls from "./controls";
import { Suspense, useRef, useState } from "react";

export default function ClientComponent({
  accessToken,
  setChatbotSummary,
}: {
  accessToken: string;
  setChatbotSummary: (summary: string) => void;
}) {
  const configId = String(process.env.NEXT_PUBLIC_HUME_CONFIG_ID);
  const timeout = useRef<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<(JSONMessage | ConnectionMessage)[]>(
    []
  );

  if (!accessToken) return null;

  return (
    <Suspense
      fallback={
        <div className="p-4 text-center">Loading voice interface...</div>
      }
    >
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        configId={configId}
        onMessage={() => {
          if (timeout.current) window.clearTimeout(timeout.current);

          timeout.current = window.setTimeout(() => {
            if (chatRef.current) {
              const scrollHeight = chatRef.current.scrollHeight;
              chatRef.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
      >
        <div className="flex flex-col h-full w-full">
          {/* Chat Scrollable Area */}
          <div className="py-3 space-y-2" ref={chatRef}>
            <Messages
              messages={messages}
              setMessages={setMessages}
            />
          </div>
          {/* Controls Section */}
          <div className="pt-3">
            <Controls
              messages={messages}
              setChatbotSummary={setChatbotSummary}
            />
          </div>
        </div>
      </VoiceProvider>
    </Suspense>
  );
}

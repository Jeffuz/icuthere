// ./components/ClientComponent.tsx
"use client";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./messages";
import Controls from "./controls";
import { useRef } from "react";
export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const configId = String(process.env.NEXT_PUBLIC_HUME_CONFIG_ID);
  console.log("configId", configId);
  return (
    <VoiceProvider
    auth={{ type: "accessToken", value: accessToken }}
    configId={configId}
    onMessage={() => {
      if (timeout.current) {
        window.clearTimeout(timeout.current);
      }

      timeout.current = window.setTimeout(() => {
        if (ref.current) {
          const scrollHeight = ref.current.scrollHeight;

          ref.current.scrollTo({
            top: scrollHeight,
            behavior: "smooth",
          });
        }
      }, 200);
    }}
    >
      <Messages />
      <Controls />
    </VoiceProvider>
  );
}

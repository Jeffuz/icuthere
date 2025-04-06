// ./components/Messages.tsx
"use client";
import { ConnectionMessage, JSONMessage, useVoice } from "@humeai/voice-react";

export default function Messages({ setMessages }: { setMessages: (messages: (JSONMessage | ConnectionMessage)[]) => void }) {
  const { messages } = useVoice();

  return (
    <div>
      {messages.map((msg, index) => {
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          // console.log("messages", messages);
          setMessages(messages as (JSONMessage | ConnectionMessage)[]);
          return (
            <div key={msg.type + index}>
              <div>{msg.message.role}</div>
              <div>{msg.message.content}</div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

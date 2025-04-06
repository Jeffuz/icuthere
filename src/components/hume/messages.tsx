"use client";
import { ConnectionMessage, JSONMessage, useVoice } from "@humeai/voice-react";
import { useEffect } from "react";
import clsx from "clsx";

export default function Messages({
  setMessages,
}: {
  setMessages: (messages: (JSONMessage | ConnectionMessage)[]) => void;
}) {
  const { messages } = useVoice();

  useEffect(() => {
    setMessages(messages as (JSONMessage | ConnectionMessage)[]);
  }, [messages, setMessages]);

  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto px-4 py-2">
      {messages.map((msg, index) => {
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          const isUser = msg.message.role === "user";

          return (
            <div
              key={msg.type + index}
              className={clsx("max-w-xs px-4 py-2 rounded-lg shadow-sm", {
                "bg-[#0196C8] text-white self-end rounded-br-none": isUser,
                "bg-white text-gray-900 self-start border rounded-bl-none":
                  !isUser,
              })}
            >
              <p className="text-sm whitespace-pre-wrap">
                {msg.message.content}
              </p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

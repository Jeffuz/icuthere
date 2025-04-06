"use client";
import { ConnectionMessage, JSONMessage, useVoice } from "@humeai/voice-react";
import { useEffect, useRef } from "react";
import clsx from "clsx";

type MessageType = JSONMessage | ConnectionMessage;

export default function Messages({
  setMessages,
  messages,
}: {
  messages: MessageType[];
  setMessages: (updater: (prev: MessageType[]) => MessageType[]) => void;
}) {
  const { messages: liveMessages } = useVoice();
  const lastLengthRef = useRef(0);

  useEffect(() => {
    if (liveMessages.length > lastLengthRef.current) {
      const newMessages = liveMessages.slice(lastLengthRef.current);
      setMessages((prev) => [...prev, ...newMessages]);
      lastLengthRef.current = liveMessages.length;
    }
  }, [liveMessages, setMessages]);

  return (
    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
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

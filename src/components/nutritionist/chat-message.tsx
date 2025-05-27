import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type MessageType = {
  id: string;
  sessionId: string;
  content: string;
  sender: "user" | "nutritionist";
  senderId: string;
  timestamp: Date;
  read?: boolean;
};

interface ChatMessageProps {
  message: MessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isNutritionist = message.sender === "nutritionist";

  return (
    <div className={cn("flex w-full gap-2 mb-4", isNutritionist ? "justify-start" : "justify-end")}>
      {isNutritionist && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/nutritionist-avatar.png" alt="Nutritionist" />
          <AvatarFallback className="bg-green-100 text-green-800">NT</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("px-4 py-2 rounded-lg max-w-[80%]", isNutritionist ? "bg-green-100 text-green-900" : "bg-blue-100 text-blue-900")}>
        <p className="text-sm">{message.content}</p>
        {/* <p className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p> */}
      </div>

      {!isNutritionist && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/user-avatar.png" alt="User" />
          <AvatarFallback className="bg-blue-100 text-blue-800">ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

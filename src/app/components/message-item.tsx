"use client";
import { X } from "lucide-react";
import { useAutoResize } from "./hooks/use-auto-resize";
import { Message } from "../types/message";

interface MessageItemProps {
  message: Message;
  index: number;
  onMessageChange: (index: number, content: string) => void;
  onRoleChange: (index: number, role: "user" | "assistant") => void;
  onDelete: (index: number) => void;
}

export const MessageItem = ({
                              message,
                              index,
                              onMessageChange,
                              onRoleChange,
                              onDelete,
                            }: MessageItemProps) => {
  const { textareaRef } = useAutoResize(message.content);

  return (
    <div className="border border-border rounded-lg bg-background p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="relative">
          <select
            value={message.role}
            onChange={(e) =>
              onRoleChange(index, e.target.value as "user" | "assistant")
            }
            className="appearance-none pl-3 pr-8 py-1 border-0 bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
          >
            <option value="user">User</option>
            <option value="assistant">Assistant</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
        <button
          onClick={() => onDelete(index)}
          className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
          title="Delete message"
        >
          <X className="w-4 h-4"/>
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={message.content}
        onChange={(e) => onMessageChange(index, e.target.value)}
        className="w-full p-0 border-0 bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground overflow-hidden"
        placeholder={message.role === "user" ? "Enter user message..." : "Enter assistant message..."}
        rows={1}
        style={{ minHeight: '1.5rem' }}
      />
    </div>
  );
};
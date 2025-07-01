"use client";
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
    <div
      className="border border-border rounded-xl bg-card backdrop-blur-sm p-3 sm:p-4 hover:bg-card/80 transition-all duration-200 group shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="relative">
          <select
            value={message.role}
            onChange={(e) =>
              onRoleChange(index, e.target.value as "user" | "assistant")
            }
            className="appearance-none pl-3 pr-8 py-2 border-0 bg-transparent text-sm font-semibold focus:outline-none cursor-pointer hover:bg-accent/50 rounded-md transition-colors capitalize"
            style={{ minHeight: 'var(--touch-target-min)' }}
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
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 flex items-center justify-center"
          style={{ minWidth: 'var(--touch-target-min)', minHeight: 'var(--touch-target-min)' }}
          title="Delete message"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={message.content}
        onChange={(e) => onMessageChange(index, e.target.value)}
        className="w-full p-3 border border-border rounded-lg bg-input resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground transition-all duration-200 overflow-hidden text-sm sm:text-base"
        placeholder={message.role === "user" ? "Enter user message..." : "Enter assistant message..."}
        rows={1}
        style={{ minHeight: 'var(--touch-target-min)' }}
      />
    </div>
  );
};
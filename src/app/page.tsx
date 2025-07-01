"use client";
import { useCallback, useState } from "react";
import { ThemeSwitcher } from "./components/theme-toggle-button";
import { MessageItem } from "./components/message-item";
import { CountTokensRequest, CountTokensResponse, Message } from "./types/message";
import { MODELS } from "./config/models";


export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "" },
  ]);
  const [chatTokenCount, setChatTokenCount] = useState<number | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].modelId);

  const addMessage = useCallback(() => {
    setMessages(prev => {
      const lastRole = prev[prev.length - 1]?.role || "assistant";
      const newRole = lastRole === "user" ? "assistant" : "user";
      return [...prev, { role: newRole, content: "" }];
    });
  }, []); // Empty dependency array since we use functional update

  const deleteMessage = useCallback((index: number) => {
    setMessages(prev => {
      const newMessages = prev.filter((_, i) => i !== index);
      return newMessages.length > 0 ? newMessages : [{ role: "user", content: "" }];
    });
  }, []);

  const handleMessageChange = useCallback((index: number, content: string) => {
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[index].content = content;
      return newMessages;
    });
  }, []);

  const handleRoleChange = useCallback((index: number, role: "user" | "assistant") => {
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[index].role = role;
      return newMessages;
    });
  }, []);

  const calculateChatTokens = async () => {
    setIsChatLoading(true);
    setChatTokenCount(null);

    try {
      const requestBody: CountTokensRequest = {
        messages,
        model: selectedModel
      };

      const response = await fetch("/api/count-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: CountTokensResponse = await response.json();
      setChatTokenCount(data.inputTokens);
    } catch (error) {
      console.error('Error counting tokens:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <header className="bg-background border-b border-border shadow-sm flex-shrink-0">
        <nav className="px-6 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Token Counter</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="appearance-none pl-3 pr-10 py-2 border border-border rounded-lg bg-background text-sm font-medium shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                {MODELS.map((model) => (
                  <option key={model.modelId} value={model.modelId}>
                    {model.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
            <ThemeSwitcher/>
          </div>
        </nav>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex">
          <div className="flex-1">
            <div className="p-6 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 border border-border rounded-lg p-4 bg-muted">
                {messages.map((message, index) => (
                  <MessageItem
                    key={index}
                    message={message}
                    index={index}
                    onMessageChange={handleMessageChange}
                    onRoleChange={handleRoleChange}
                    onDelete={deleteMessage}
                  />
                ))}
                <button
                  onClick={addMessage}
                  className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-lg">+</span>
                  Add message
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={calculateChatTokens}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
                  disabled={isChatLoading}
                >
                  {isChatLoading ? "Counting..." : "Count Tokens"}
                </button>
                {chatTokenCount !== null && (
                  <div className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold">
                    Tokens: {chatTokenCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
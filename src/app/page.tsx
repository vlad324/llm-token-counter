"use client";
import { useCallback, useState } from "react";
import { ThemeSwitcher } from "./components/theme-toggle-button";
import { MessageItem } from "./components/message-item";
import { CountTokensRequest, CountTokensResponse, Message, APIErrorResponse } from "./types/message";
import { MODELS } from "./config/models";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "" },
  ]);
  const [chatTokenCount, setChatTokenCount] = useState<number | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].modelId);
  const [apiError, setApiError] = useState<APIErrorResponse | null>(null);

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
    setApiError(null);

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

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as APIErrorResponse;
        setApiError(errorData);
        return;
      }

      const successData = data as CountTokensResponse;
      setChatTokenCount(successData.inputTokens);
    } catch (error) {
      console.error('Error counting tokens:', error);
      setApiError({
        error: 'Network error occurred',
        type: 'server_error'
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <header className="bg-card backdrop-blur-sm border-b border-border shadow-sm flex-shrink-0 sticky top-0"
              style={{ zIndex: 'var(--z-sticky)' }}>
        <nav className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">LLM Token Counter</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-border rounded-lg bg-card text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer transition-all duration-200"
              >
                {MODELS.map((model) => (
                  <option key={model.modelId} value={model.modelId}>
                    {model.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground transition-transform duration-200" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
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
              <div className="flex-1 overflow-y-auto space-y-3 border border-border rounded-xl p-6 bg-card shadow-sm">
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
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 border-2 border-dashed border-border hover:border-primary/30 group"
                >
                  <div
                    className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="text-sm font-semibold group-hover:text-primary">+</span>
                  </div>
                  <span className="font-medium">Add message</span>
                </button>
              </div>
              <div
                className="mt-6 flex items-center justify-between bg-card backdrop-blur-sm rounded-xl p-4 border border-border"
                style={{ minHeight: 'var(--header-height)' }}>
                <button
                  onClick={calculateChatTokens}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
                  style={{ height: 'var(--button-height)', minWidth: 'var(--control-min-width)' }}
                  disabled={isChatLoading}
                >
                  {isChatLoading && (
                    <div
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  )}
                  <span>{isChatLoading ? "Counting..." : "Count Tokens"}</span>
                </button>
                <div className="flex items-center" style={{ height: 'var(--button-height)' }}>
                  {chatTokenCount !== null && (
                    <div
                      className="px-6 py-3 bg-success/10 text-success border border-success/20 rounded-lg font-bold text-lg flex items-center gap-2 h-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                      <span>Tokens: {chatTokenCount.toLocaleString()}</span>
                    </div>
                  )}
                  {apiError && (
                    <div className="px-6 py-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg font-medium text-sm flex items-center gap-2 h-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>
                        {apiError.error}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
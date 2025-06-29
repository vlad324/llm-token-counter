"use client";
import { useState } from "react";
import { ThemeSwitcher } from "./components/theme-toggle-button";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "" },
  ]);
  const [text, setText] = useState("");
  const [textTokenCount, setTextTokenCount] = useState<number | null>(null);
  const [chatTokenCount, setChatTokenCount] = useState<number | null>(null);
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("claude-4-sonnet-20250514");

  const addMessage = () => {
    setMessages([...messages, { role: "user", content: "" }]);
  };

  const handleMessageChange = (index: number, content: string) => {
    const newMessages = [...messages];
    newMessages[index].content = content;
    setMessages(newMessages);
  };

  const handleRoleChange = (index: number, role: "user" | "assistant") => {
    const newMessages = [...messages];
    newMessages[index].role = role;
    setMessages(newMessages);
  };

  const calculateTextTokens = async () => {
    setIsTextLoading(true);
    setTextTokenCount(null);

    const messagesToCount = [{ role: "user", content: text }];

    const response = await fetch("/api/count-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messagesToCount, model: selectedModel }),
    });

    const data = await response.json();
    setTextTokenCount(data.tokenCount.input_tokens);
    setIsTextLoading(false);
  };

  const calculateChatTokens = async () => {
    setIsChatLoading(true);
    setChatTokenCount(null);

    const response = await fetch("/api/count-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, model: selectedModel }),
    });

    const data = await response.json();
    setChatTokenCount(data.tokenCount.input_tokens);
    setIsChatLoading(false);
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
                <option value="claude-4-sonnet-20250514">Claude 4 Sonnet</option>
                <option value="claude-4-opus-20250514">Claude 4 Opus</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <ThemeSwitcher />
          </div>
        </nav>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex">
          {/* Left Side - Text Input */}
          <div className="w-1/2 p-6 border-r border-border">
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4 text-primary">Text Analysis</h2>
              <div className="flex-1 border border-border rounded-lg p-4 bg-muted">
                <textarea
                  className="w-full h-full p-3 border border-border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={calculateTextTokens}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
                  disabled={isTextLoading}
                >
                  {isTextLoading ? "Calculating..." : "Calculate Tokens"}
                </button>
                {textTokenCount !== null && (
                  <div className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold">
                    Tokens: {textTokenCount}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Chat Messages */}
          <div className="w-1/2 p-6">
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4 text-secondary">Chat Messages</h2>
              <div className="flex-1 overflow-y-auto space-y-4 border border-border rounded-lg p-4 bg-muted">
                {messages.map((message, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="relative self-start">
                      <select
                        value={message.role}
                        onChange={(e) =>
                          handleRoleChange(index, e.target.value as "user" | "assistant")
                        }
                        className="appearance-none pl-3 pr-10 py-2 border border-border rounded-lg bg-background text-sm font-medium shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                      >
                        <option value="user">👤 User</option>
                        <option value="assistant">🤖 Assistant</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <textarea
                      value={message.content}
                      onChange={(e) => handleMessageChange(index, e.target.value)}
                      className="w-full p-3 border border-border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={`Message ${index + 1}...`}
                      rows={3}
                    ></textarea>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="space-x-2">
                  <button
                    onClick={addMessage}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 font-medium transition-colors"
                  >
                    + Add Message
                  </button>
                  <button
                    onClick={calculateChatTokens}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
                    disabled={isChatLoading}
                  >
                    {isChatLoading ? "Calculating..." : "Calculate Tokens"}
                  </button>
                </div>
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

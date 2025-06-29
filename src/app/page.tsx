"use client";
import { useState } from "react";
import { ThemeSwitcher } from "./components/theme-toggle-button";
import { Linkedin, Github, Twitter, X } from "lucide-react";

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
  const [activeSection, setActiveSection] = useState<"text" | "chat">("text");

  const addMessage = () => {
    const lastRole = messages[messages.length - 1]?.role || "assistant";
    const newRole = lastRole === "user" ? "assistant" : "user";
    setMessages([...messages, { role: newRole, content: "" }]);
  };

  const deleteMessage = (index: number) => {
    const newMessages = messages.filter((_, i) => i !== index);
    setMessages(newMessages.length > 0 ? newMessages : [{ role: "user", content: "" }]);
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
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
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
          {/* Text Analysis Section */}
          <div 
            className={`transition-all duration-300 border-r border-border ${
              activeSection === "text" ? "flex-1" : "w-12"
            }`}
          >
            {activeSection === "text" ? (
              <div className="p-6 h-full flex flex-col">
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
                    {isTextLoading ? "Counting..." : "Count Tokens"}
                  </button>
                  {textTokenCount !== null && (
                    <div className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold">
                      Tokens: {textTokenCount}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div 
                className="h-full flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setActiveSection("text")}
              >
                <span 
                  className="text-lg font-semibold text-primary whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Text Analysis
                </span>
              </div>
            )}
          </div>

          {/* Chat Messages Section */}
          <div 
            className={`transition-all duration-300 ${
              activeSection === "chat" ? "flex-1" : "w-12"
            }`}
          >
            {activeSection === "chat" ? (
              <div className="p-6 h-full flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-secondary">Chat Messages</h2>
                <div className="flex-1 overflow-y-auto space-y-4 border border-border rounded-lg p-4 bg-muted">
                  {messages.map((message, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="relative">
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
                        <button
                          onClick={() => deleteMessage(index)}
                          className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                          title="Delete message"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
                      {isChatLoading ? "Counting..." : "Count Tokens"}
                    </button>
                  </div>
                  {chatTokenCount !== null && (
                    <div className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold">
                      Tokens: {chatTokenCount}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div 
                className="h-full flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setActiveSection("chat")}
              >
                <span 
                  className="text-lg font-semibold text-secondary whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Chat Messages
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-6">
            <a
              href="https://www.linkedin.com/in/uladzislauradkevich/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/vlad324"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/ulad_dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export type Provider = "anthropic" | "google";

export type ModelConfig = {
  modelId: string;
  provider: Provider;
  name: string;
};

export const MODELS: ModelConfig[] = [
  {
    modelId: "claude-4-sonnet-20250514",
    provider: "anthropic",
    name: "Claude 4 Sonnet"
  },
  {
    modelId: "claude-4-opus-20250514", 
    provider: "anthropic",
    name: "Claude 4 Opus"
  },
  {
    modelId: "gemini-2.5-pro",
    provider: "google",
    name: "Gemini 2.5 Pro"
  },
  {
    modelId: "gemini-2.5-flash",
    provider: "google", 
    name: "Gemini 2.5 Flash"
  }
];
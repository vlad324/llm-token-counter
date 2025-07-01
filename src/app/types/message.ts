export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type CountTokensRequest = {
  messages: Message[];
  model: string;
};

export type CountTokensResponse = {
  inputTokens: number;
};
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

export type APIErrorResponse = {
  error: string;
  status?: number;
  type: 'anthropic_api_error' | 'google_api_error' | 'server_error' | 'validation_error';
};
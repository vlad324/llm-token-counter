import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { CountTokensRequest, CountTokensResponse, Message } from "../../types/message";
import { MODELS } from "../../config/models";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, model }: CountTokensRequest = await req.json();

  if (!messages) {
    return NextResponse.json({ error: "Messages are required" }, { status: 400 });
  }

  const modelConfig = MODELS.find(m => m.modelId === model);

  if (!modelConfig) {
    const supportedModels = MODELS.map(m => m.modelId);
    return NextResponse.json({ error: `Unsupported model. Supported models: ${supportedModels.join(", ")}` }, { status: 400 });
  }

  let inputTokens;

  if (modelConfig.provider === "anthropic") {
    const response = await anthropic.messages.countTokens({
      messages: messages,
      model: model
    });

    inputTokens = response.input_tokens;
  } else if (modelConfig.provider === "google") {
    const contents = messages.map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const countTokensResponse = await ai.models.countTokens({
      model: model,
      contents: contents
    });

    inputTokens = countTokensResponse.totalTokens;
  }

  return NextResponse.json({ inputTokens } as CountTokensResponse);
}

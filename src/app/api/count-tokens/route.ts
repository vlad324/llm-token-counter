import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, model } = await req.json();

  if (!messages) {
    return NextResponse.json({ error: "Messages are required" }, { status: 400 });
  }

  const supportedModels = [
    "claude-4-sonnet-20250514",
    "claude-4-opus-20250514",
    "gemini-2.5-pro",
    "gemini-2.5-flash"
  ];

  if (!supportedModels.includes(model)) {
    return NextResponse.json({ error: `Unsupported model. Supported models: ${supportedModels.join(", ")}` }, { status: 400 });
  }

  let tokenCount;

  if (model.startsWith("claude-")) {
    tokenCount = await anthropic.messages.countTokens({
      messages: messages,
      model: model
    });
  } else if (model.startsWith("gemini-")) {
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const countTokensResponse = await ai.models.countTokens({
      model: model,
      contents: contents
    });

    tokenCount = {
      input_tokens: countTokensResponse.totalTokens
    };
  }

  return NextResponse.json({ tokenCount });
}

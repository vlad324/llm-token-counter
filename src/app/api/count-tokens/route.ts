import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function POST(req: NextRequest) {
  const { messages, model } = await req.json();

  if (!messages) {
    return NextResponse.json({ error: "Messages are required" }, { status: 400 });
  }

  const supportedModels = ["claude-4-sonnet-20250514", "claude-4-opus-20250514"];

  if (!supportedModels.includes(model)) {
    return NextResponse.json({ error: `Unsupported model. Supported models: ${supportedModels.join(", ")}` }, { status: 400 });
  }

  const tokenCount = await anthropic.messages.countTokens({
    messages: messages,
    model: model
  });

  return NextResponse.json({ tokenCount });
}

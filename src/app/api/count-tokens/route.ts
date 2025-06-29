import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!messages) {
    return NextResponse.json({ error: "Messages are required" }, { status: 400 });
  }

  const tokenCount = await anthropic.messages.countTokens({
    messages: messages,
    model: "claude-4-sonnet-20250514"
  });

  return NextResponse.json({ tokenCount });
}

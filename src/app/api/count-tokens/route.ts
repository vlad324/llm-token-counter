import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { CountTokensRequest, CountTokensResponse, Message } from "../../types/message";
import { MODELS } from "../../config/models";
import { withErrorHandler } from "../../lib/api-error-handler";
import { ExternalAPIError, ValidationError } from "../../lib/errors";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function handleCountTokens(req: NextRequest) {
  const { messages, model }: CountTokensRequest = await req.json();

  if (!messages) {
    throw new ValidationError("Messages are required");
  }

  const modelConfig = MODELS.find(m => m.modelId === model);

  if (!modelConfig) {
    const supportedModels = MODELS.map(m => m.modelId);
    throw new ValidationError(`Unsupported model. Supported models: ${supportedModels.join(", ")}`);
  }

  let inputTokens;

  if (modelConfig.provider === "anthropic") {
    try {
      const response = await anthropic.messages.countTokens({
        messages: messages,
        model: model
      });
      inputTokens = response.input_tokens;
    } catch (error) {
      throw new ExternalAPIError(
        error instanceof Error ? error.message : "Anthropic API error",
        500,
        'anthropic'
      );
    }
  } else if (modelConfig.provider === "google") {
    try {
      const contents = messages.map((msg: Message) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      const countTokensResponse = await ai.models.countTokens({
        model: model,
        contents: contents
      });
      inputTokens = countTokensResponse.totalTokens;
    } catch (error) {
      throw new ExternalAPIError(
        error instanceof Error ? error.message : "Google API error",
        500,
        'google'
      );
    }
  }

  return NextResponse.json({ inputTokens } as CountTokensResponse);
}

export const POST = withErrorHandler(handleCountTokens);

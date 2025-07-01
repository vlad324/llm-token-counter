import { NextRequest, NextResponse } from "next/server";
import { APIErrorResponse } from "../types/message";
import { AppError, ValidationError, ExternalAPIError } from "./errors";

type ApiHandler = (req: NextRequest) => Promise<NextResponse>;

export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof ValidationError) {
        return NextResponse.json({
          error: error.message,
          type: error.type
        } as APIErrorResponse, { status: error.status });
      }
      
      if (error instanceof ExternalAPIError) {
        return NextResponse.json({
          error: error.message,
          status: error.status,
          type: error.type
        } as APIErrorResponse, { status: error.status });
      }
      
      if (error instanceof AppError) {
        return NextResponse.json({
          error: error.message,
          type: error.type
        } as APIErrorResponse, { status: error.status });
      }
      
      return NextResponse.json({
        error: "Internal server error",
        type: "server_error"
      } as APIErrorResponse, { status: 500 });
    }
  };
}
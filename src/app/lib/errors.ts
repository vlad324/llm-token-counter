import { Provider } from "../config/models";

export class AppError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public type: string = 'server_error'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'validation_error');
    this.name = 'ValidationError';
  }
}

export class ExternalAPIError extends AppError {
  constructor(message: string, status: number, provider: Provider) {
    super(message, status, `${provider}_api_error`);
    this.name = 'ExternalAPIError';
  }
}
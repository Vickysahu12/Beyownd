export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: any[];
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, errors: any[] = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const createError = (
  statusCode: number,
  message: string
): ApiError => {
  return new ApiError(statusCode, message, true);
};
import { BaseError } from "./baseError";
import { HttpStatusCode } from "./httpStatusCode";

export class APIError extends BaseError {
  constructor(
    name,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = "internal server error"
  ) {
    super(name, httpCode, description, isOperational);
  }
}

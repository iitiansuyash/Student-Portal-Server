import { BaseError } from "./baseError";
import { HttpStatusCode } from "./httpStatusCode";

export class UnauthorizedError extends BaseError {
  constructor(description = "Not Authorized to access this route") {
    super("UNAUTHORIZED ACCESS", HttpStatusCode.UNAUTHORIZED, description, true);
  }
}

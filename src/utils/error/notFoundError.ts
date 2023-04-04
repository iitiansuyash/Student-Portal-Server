import { BaseError } from "./baseError";
import { HttpStatusCode } from "./httpStatusCode";

export class NotFoundError extends BaseError {
  constructor(description = "No entry found with given details!!") {
    super("NOT_FOUND", HttpStatusCode.NOT_FOUND, description, true);
  }
}

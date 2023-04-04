import { BaseError } from "./baseError";
import { HttpStatusCode } from "./httpStatusCode";

export class HTTP400Error extends BaseError {
  constructor(description = "bad request") {
    super("NOT FOUND", HttpStatusCode.BAD_REQUEST, description, true);
  }
}

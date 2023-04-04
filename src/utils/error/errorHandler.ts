import { BaseError } from "./baseError";
import { logger } from "../logger";

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    await logger.error(
      "Error message from the centralized error-handling component",
      err
    );
    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
  public getStatusCode(error: Error) {
    if (error instanceof BaseError) {
      return error.httpCode;
    }
    return 500;
  }
}
export const errorHandler = new ErrorHandler();

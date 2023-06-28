import * as express from "express";
import * as cors from "cors";
import { errorHandler } from "./utils/error/errorHandler";
import httpLogger from "./utils/httpLogger";
import routes from "./routes";

const CreateServer = () => {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "PUT", "POST", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
      credentials: true,
    })
  );

  app.use(express.json());

  app.use(httpLogger);

  app.use("/api", routes);

  process.on("unhandledRejection", (reason: Error) => {
    throw reason;
  });

  process.on("uncaughtException", (error: Error) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    errorHandler.handleError(error);
    if (!errorHandler.isTrustedError(error)) {
      process.exit(1);
    }
  });

  app.use(
    async (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!errorHandler.isTrustedError(err)) {
        next(err);
      }
      await errorHandler.handleError(err);
      res
        .status(errorHandler.getStatusCode(err) || 500)
        .json({ success: false, message: err.message });
    }
  );

  return app;
};

export default CreateServer;

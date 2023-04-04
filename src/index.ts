import * as express from "express";
import routes from "./routes/index";

const app = express();

import * as cors from "cors";
import { errorHandler } from "./utils/error/errorHandler";
import httpLogger from './utils/httpLogger';

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
    res.status(errorHandler.getStatusCode(err) || 500).json({ success: false, message: err.message })
  }
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});

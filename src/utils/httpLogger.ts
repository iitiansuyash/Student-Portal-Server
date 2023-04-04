import { logger } from "./logger";

import * as morgan from 'morgan';
import * as json from 'morgan-json';

const format = json({
  method: ":method",
  url: ":url",
  status: ":status",
  contentLength: ":res[content-length]",
  responseTime: ":response-time",
});

const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const { method, url, status, contentLength, responseTime } =
        JSON.parse(message);

      logger.info("HTTP Access Log", {
        timestamp: new Date().toString(),
        method,
        url,
        status: Number(status),
        contentLength,
        responseTime: Number(responseTime),
      });
    },
  },
});

export default httpLogger;

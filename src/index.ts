import CreateServer from './server';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3001;

const app = CreateServer();

app.listen(PORT, (): void => {
  logger.info(`Server running on port ${PORT}`);
});

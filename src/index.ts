import * as express from 'express';
import routes from './routes/index';

const app = express();

app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, (): void => {
    console.log(`Server running on port ${PORT}`);
})
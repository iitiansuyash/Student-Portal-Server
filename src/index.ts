import * as express from 'express';
import routes from './routes/index';

const app = express();

import * as cors from 'cors';

app.use(cors({
    origin: [
        'http://localhost:3000'
    ],
    methods: ['GET', 'PUT', 'POST','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    credentials: true
}));

app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, (): void => {
    console.log(`Server running on port ${PORT}`);
})
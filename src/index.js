import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';

import apiLogger from './middleware/apiLogger.js';
import dbConnect from './database/db.js';
import userRouter from './routes/user.js';
import spotifyRouter from './routes/spotify.js';
import logger from './logger/logger.js';
import spotifyService from './services/spotifyService.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
dotenv.config();

const init = async () => {
    // 1. initialize db
    // 2. Check spotify token exists in db
    // 3. If token doesn't exist authorize spotify
    await dbConnect();
    const token = await spotifyService.getSpotifyToken();
    if (!token) {
        spotifyService.authorizeSpotify();
    }
};

init();

// Load swagger yaml file
const swaggerDocument = yaml.load('./swagger.yaml');

app.use(cors());
app.use(express.json());
app.use(apiLogger)

app.use('/user', userRouter);
app.use('/spotify', spotifyRouter);
// serves API docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    logger.info(`listening on port ${port}`);
});

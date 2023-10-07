import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import dbConnect from './database/db.js';
import userRouter from './routes/user.js';
import spotifyRouter from './routes/spotify.js'
import spotifyService from './services/spotifyService.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
dotenv.config();

const init = async () => {
    // 1. initialize db
    // 2. Check spotify token exists
    // 3. If token doesn't exist authorize spotify
    await dbConnect();
    const token = await spotifyService.getSpotifyToken();
    if (!token) {
        spotifyService.authorizeSpotify();
    }
};

init();

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/spotify', spotifyRouter);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening on port', port);
});

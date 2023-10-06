import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import dbConnect from './database/db.js';
import userRouter from './routes/user.js';

const app = express();
dotenv.config();
dbConnect();

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening on port', port);
});

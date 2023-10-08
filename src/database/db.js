import mongoose from 'mongoose';

import logger from '../logger/logger.js';

const dbConnect = async (retryInterval = 10000) => {
    // 1. Try to connect to database
    // 2. If fails retry after a given interval until success
    while (true) {
        try {
            return await mongoose.connect(process.env.MONGODB_URI, {
                minPoolSize: 5
            });

        } catch (error) {
            logger.info('Retrying database connection')
            await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
    }
};

const db = mongoose.connection;

db.on('error', (error) => {
    logger.error(error);
});

db.on('reconnected', () => {
    //will automatically reconnect on disconnection after initial connection.
    logger.info('reconnected db ....');
});

db.once('open', () => {
    logger.info('Connected to MongoDB database');
});

export default dbConnect;

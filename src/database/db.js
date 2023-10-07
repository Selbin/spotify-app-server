import mongoose from 'mongoose';

import logger from '../logger/logger.js';

const dbConnect = async (retryInterval = 60000, maxRetries = 5) => {
    // 1. connect to database
    // 2. If connection fails, we try to retry for a specified limit within in a given interval of time
    try {
        return await mongoose.connect(process.env.MONGODB_URI, {
            minPoolSize: 5
        });
    } catch (error) {
        logger.error('MongoDB connection error:', error.message);
        if (maxRetries > 0) {
            setTimeout(() => dbConnect(retryInterval, maxRetries - 1), retryInterval);
        } else {
            logger.error('Maximum number of retries reached');
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

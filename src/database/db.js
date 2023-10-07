import mongoose from 'mongoose';

const dbConnect = async (retryInterval = 60000, maxRetries = 5) => {
    // 1. connect to database
    // 2. If connection fails, we try to retry for a specified limit within in a given interval of time
    try {
        return await mongoose.connect(process.env.MONGODB_URI, {
            minPoolSize: 5
        });
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        if (maxRetries > 0) {
            setTimeout(() => dbConnect(retryInterval, maxRetries - 1), retryInterval);
        } else {
            console.error('Maximum number of retries reached');
        }
    }
};

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error);
});

db.on('reconnected', () => {
    //will automatically reconnect on disconnection after initial connection.
    console.log('reconnected db ....');
});

db.once('open', () => {
    console.log('Connected to MongoDB database');
});

export default dbConnect;

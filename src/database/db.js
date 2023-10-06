import mongoose from 'mongoose';

const dbConnect = () => {
    return mongoose.connect(process.env.MONGODB_URI, {
        minPoolSize: 5
    });
};

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error);
});

db.once('open', () => {
    console.log('Connected to MongoDB database');
});

export default dbConnect;

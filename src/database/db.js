import mongoose from 'mongoose';

const dbConnect = async () => {
    return await mongoose.connect(process.env.MONGODB_URI, {
        minPoolSize: 5
    });
};

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error);
});

db.on('reconnected',()=>{
    //will automatically reconnect on disconnection
    console.log("reconnected db ....");
})

db.once('open', () => {
    console.log('Connected to MongoDB database');
});

export default dbConnect;

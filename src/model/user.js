import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    accessToken: {type: String},
    refreshToken: {type: String}
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)

export default User
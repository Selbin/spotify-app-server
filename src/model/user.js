import mongoose from "mongoose";
import crypto from "crypto"

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    accessTokenKey: {type: String, default: crypto.randomUUID()},
    refreshTokenKey: {type: String, default: crypto.randomUUID()}
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)

export default User
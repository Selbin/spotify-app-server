import mongoose from "mongoose";
import crypto from "crypto"

// 1. stores access token and refresh token in db to enhance security
// 2. If any ones token get exposed it will only affect the particular user only.
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    accessTokenKey: {type: String, default: crypto.randomUUID()},
    refreshTokenKey: {type: String, default: crypto.randomUUID()}
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)

export default User
import mongoose from "mongoose";

// To store spotify access token
const SpotifySchema = new mongoose.Schema({
    accessToken: {type: String, required: true},
    name: {type: String, default: 'spotifyKey', unique: true}
}, {timestamps: true})

const SpotifyModel = mongoose.model('Spotify', SpotifySchema)

export default SpotifyModel
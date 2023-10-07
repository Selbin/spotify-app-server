import dotEnv from 'dotenv';
import fetch from 'node-fetch';
import SpotifyModel from '../model/spotify.js';

dotEnv.config();

const spotifyUrl = process.env.SPOTIFY_URL;
export const authorizeSpotify = async (delaySeconds = 900) => {
    const { CLIENT_ID: clientId, CLIENT_SECRET: clientSecret } = process.env;
    const clientToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    // 1. Get spotify Token
    // 2. Save to DB
    // 3. If spotify service is down continously retry with an interval
    while (true) {
        try {
            const response = await fetch(`${spotifyUrl}/api/token`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${clientToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            });

            if (response.ok) {
                const data = await response.json();
                const accessToken = data.access_token;
                return await SpotifyModel.updateOne({}, { $set: { accessToken } }, { upsert: true });
            } else {
                console.error('Failed to authorize with Spotify:', response.status, response.statusText);
                await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
            }
        } catch (error) {
            console.error('An error occurred:', error);
            await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
        }
    }
};

export const checkSpotifyTokenExist = async () => {
    const spotify = await SpotifyModel.findOne({ name: 'spotifyKey' });
    if (spotify) {
        return true;
    }
    return false;
};

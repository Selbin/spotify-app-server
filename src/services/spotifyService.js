import dotEnv from 'dotenv';
import fetch from 'node-fetch';
import SpotifyModel from '../model/spotify.js';

dotEnv.config();

const spotifyUrl = process.env.SPOTIFY_URL;
const authorizeSpotify = async (delaySeconds = 900) => {
    const { CLIENT_ID: clientId, CLIENT_SECRET: clientSecret } = process.env;
    const clientToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    // 1. Get spotify Token
    // 2. Save to DB
    // 3. If spotify service is down continously retry with an interval
    while (true) {
        try {
            const response = await fetch(`${process.env.SPOTIFY_AUTH_URL}/api/token`, {
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

const getSpotifyToken = async () => {
    return await SpotifyModel.findOne({ name: 'spotifyKey' });
};

const getProfileById = async (id) => {
    const spotify = await SpotifyModel.findOne({ name: 'spotifyKey' });
    const headers = {
        Authorization: 'Bearer ' + spotify.accessToken
    };
    const options = {
        headers: headers
    };

    const response = await fetch(`${spotifyUrl}/v1/users/${id}`, options);
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
        await authorizeSpotify();
        return await getPlaylistsById(id);
    }
};

const getPlaylistsById = async (id, delaySeconds = 15) => {
    while (true) {
        const spotify = await SpotifyModel.findOne({ name: 'spotifyKey' });
        const headers = {
            Authorization: 'Bearer ' + spotify.accessToken
        };
        const options = {
            headers: headers
        };
        const response = await fetch(`${spotifyUrl}/v1/users/${id}/playlists`, options);
        if (response.ok) {
            const playlists = await response.json();
            return playlists;
        } else if (response.status === 401) {
            await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
            await authorizeSpotify();
            return await getPlaylistsById(id);
        }
    }
};

export default { authorizeSpotify, getSpotifyToken, getProfileById, getPlaylistsById };

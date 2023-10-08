import dotEnv from 'dotenv';
import fetch from 'node-fetch';

import SpotifyModel from '../model/spotify.js';
import logger from '../logger/logger.js';

dotEnv.config();

const spotifyUrl = process.env.SPOTIFY_URL;
const authorizeSpotify = async (delaySeconds = 900) => {
    // 1. Get spotify Token by hitting the spotify api
    // 2. Save to DB
    // 3. If spotify service is down continously retry with an interval
    const { CLIENT_ID: clientId, CLIENT_SECRET: clientSecret } = process.env;
    const clientToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    while (true) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${clientToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            };
            const response = await fetch(`${process.env.SPOTIFY_AUTH_URL}/api/token`, options);

            if (response.ok) {
                const data = await response.json();
                const accessToken = data.access_token;
                logger.info('spotify token updated');
                return await SpotifyModel.updateOne({}, { $set: { accessToken } }, { upsert: true });
            } else {
                logger.error('Failed to authorize with Spotify:', response.status, response.statusText);
                await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
            }
        } catch (error) {
            logger.error('An error occurred:', error);
            await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
        }
    }
};

const getSpotifyToken = async () => {
    // To get spotify access token from db
    return await SpotifyModel.findOne({ name: 'spotifyKey' });
};

const getProfileById = async (id, delaySeconds = 15) => {
    //1. Fetch the access token for spotify
    //2. Fetch user profile by id
    //3. If response status is 401 ie unauthorised
    // 3.1 Fetch and update spotify access token
    // 3.2 Call the getProfileById again. These happens with a given delay
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
    } else if (response.status === 401) {
        await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
        await authorizeSpotify();
        return await getProfileById(id);
    } else {
        return null;
    }
};

const getPlaylistsById = async ({ id, page, limit, delaySeconds = 15 }) => {
    //1. Fetch the access token for spotify
    //2. Fetch playlist by id
    //3. If response status is 401 ie unauthorised
    // 3.1 Fetch and update spotify access token
    // 3.2 Call the getPlaylistsById again. These happens with a given delay
    const spotify = await SpotifyModel.findOne({ name: 'spotifyKey' });
    const headers = {
        Authorization: 'Bearer ' + spotify.accessToken
    };
    const options = {
        headers: headers
    };
    const response = await fetch(
        `${spotifyUrl}/v1/users/${id}/playlists?limit=${limit}&offset=${(page - 1) * limit}`,
        options
    );
    if (response.ok) {
        const playlists = await response.json();
        return playlists;
    } else if (response.status === 401) {
        await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
        await authorizeSpotify();
        return await getPlaylistsById({id, page, limit});
    } else {
        return null;
    }
};

export default { authorizeSpotify, getSpotifyToken, getProfileById, getPlaylistsById };

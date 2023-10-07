import spotifyService from '../services/spotifyService.js';

const getProfile = async (req, res, next) => {
    // 1. get id from url params
    // 2. Call getProfileById from spotify service to get the profile
    // 3. Return response with profile
    try {
        const { id } = req.params;
        const user = await spotifyService.getProfileById(id);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const getPlaylist = async (req, res, next) => {
    // 1. get id from url params
    // 2. Call getPlaylistsById from spotify service to get the playlists
    // 3. Return response with playlists
    try {
        const { id } = req.params;
        const playlists = await spotifyService.getPlaylistsById(id);
        return res.status(200).json(playlists);
    } catch (error) {
        next(error);
    }
};

export default { getProfile, getPlaylist };

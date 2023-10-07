import spotifyService from '../services/spotifyService.js';

const getProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await spotifyService.getProfileById(id);
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const getPlaylist = async (req, res, next) => {
    try {
        const { id } = req.params;
        const playlists = await spotifyService.getPlaylistsById(id);
        return res.status(200).json(playlists);
    } catch (error) {
        next(error);
    }
};

export default { getProfile, getPlaylist };

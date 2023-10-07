import express from 'express';

import spotifyController from '../controllers/spotify.js';

const router = express.Router();

router.get('/user/:id',  spotifyController.getProfile);
router.get('/playlists/:id', spotifyController.getPlaylist);

export default router;

import express from 'express';

import spotifyController from '../controllers/spotify.js';
import authenticateUser from '../middleware/userAuthentication.js';

const router = express.Router();

router.get('/user/:id', authenticateUser, spotifyController.getProfile);
router.get('/playlists/:id', authenticateUser, spotifyController.getPlaylist);

export default router;

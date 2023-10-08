import express from 'express';

import spotifyController from '../controllers/spotify.js';
import authenticateUser from '../middleware/userAuthentication.js';

const router = express.Router();

router.use(authenticateUser);
router.get('/user/:id', spotifyController.getProfile);
router.get('/playlists/:id', spotifyController.getPlaylist);

export default router;

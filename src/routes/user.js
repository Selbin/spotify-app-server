import express from 'express';

import userController from '../controllers/user.js';
import {
    loginValidationRules,
    registrationValidationRules,
    validationMiddleware,
    refreshTokenValidation
} from '../middleware/inputValidation.js';

const router = express.Router();

router.post('/register', registrationValidationRules, validationMiddleware, userController.register);
router.post('/login', loginValidationRules, validationMiddleware, userController.login);
// API to refresh the access token
router.post('/refresh', refreshTokenValidation, validationMiddleware, userController.refreshAccessToken);
// To check the accessToken is valid.
router.post('/check-jwt', userController.verifyAccessToken);

export default router;

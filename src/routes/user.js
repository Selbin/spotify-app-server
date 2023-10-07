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
router.post('/refresh', refreshTokenValidation, validationMiddleware, userController.refreshAccessToken);
router.post('/check-jwt', userController.verifyAccessToken);

export default router;

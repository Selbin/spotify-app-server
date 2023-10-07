import express from 'express';

import userController from '../controllers/user.js';
import { loginValidationRules, registrationValidationRules, validationMiddleware } from '../middleware/inputValidation.js';

const router = express.Router();

router.post('/register', registrationValidationRules, validationMiddleware, userController.register);
router.post('/login', loginValidationRules, validationMiddleware, userController.login);

export default router;

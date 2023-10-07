import { body, validationResult } from 'express-validator';

// Validation checks for registration inputs
export const registrationValidationRules = [
    body('name').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validation checks for login inputs
export const loginValidationRules = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validation middleware that handle the validation errors
export const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Refresh token input validation checks
export const refreshTokenValidation = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('refreshToken').notEmpty().withMessage('Invalid Token')
];

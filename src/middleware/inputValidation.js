import { body, validationResult } from 'express-validator';

export const registrationValidationRules = [
    body('name').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const loginValidationRules = [body('email').isEmail().withMessage('Invalid email address'), body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')];

export const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

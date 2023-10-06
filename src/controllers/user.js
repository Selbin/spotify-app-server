import userService from '../services/userService.js';

const register = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;
        await userService.register({ email, name, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await userService.login({ email, password });
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

export default {
    register,
    login
};

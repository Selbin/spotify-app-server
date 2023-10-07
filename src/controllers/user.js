import userService from '../services/userService.js';

const register = async (req, res, next) => {
    try {
        const { email, name, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords doesn't match" });
        }

        const { accessToken, refreshToken } = await userService.register({ email, name, password, confirmPassword });
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        if (error.code === 11000) {
            next(new Error('Email is already in use'));
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await userService.login({ email, password });
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { email, refreshToken } = req.body;
        const accessToken = userService.refreshToken({ email, refreshToken });
        if (!accessToken) {
            return res.status(401).json({ message: 'invalid token' });
        }
        return res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(401).json({ message: 'invalid token' });
    }
};

export default {
    register,
    login,
    refreshAccessToken
};

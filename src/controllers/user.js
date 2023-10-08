import userService from '../services/userService.js';

const register = async (req, res, next) => {
    // 1. Get user details from body
    // 2. Check if passwords match
    // 3. Call user register service
    // 4. return token received from register service
    try {
        const { email, name, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords doesn't match" });
        }

        const { accessToken, refreshToken } = await userService.register({ email, name, password });
        res.status(200).json({ accessToken, refreshToken, email });
    } catch (error) {
        if (error.code === 11000) {
            next(new Error('Email is already in use'));
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    // 1. Get credentials from body
    // 2. Call user login service
    // 4. return token received from login service
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await userService.login({ email, password });
        res.status(200).json({ accessToken, refreshToken, email });
    } catch (error) {
        next(error);
    }
};

const refreshAccessToken = async (req, res) => {
    // 1. Get email and refresh token from body
    // 2. Call refresh token service
    // 3. Returns access token if sucessfull or return an error message
    try {
        const { email, refreshToken } = req.body;
        const accessToken = await userService.refreshToken({ email, refreshToken });
        if (!accessToken) {
            return res.status(401).json({ message: 'invalid token' });
        }
        return res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(401).json({ message: 'invalid token' });
    }
};

const verifyAccessToken = async (req, res, next) => {
    // 1. Get accessToken from body
    // 2. Call verifyAccessToken service
    // 3. Returns ture if sucessfull else return false
    try {
        const { accessToken } = req.body;
        if (!accessToken) {
            return res.status(200).json({ isValid: false });
        }
        const isValid = await userService.verifyAccessToken(accessToken);
        return res.status(200).json({ isValid });
    } catch (error) {
        return res.status(200).json({ isValid: false });
    }
};

export default {
    register,
    login,
    refreshAccessToken,
    verifyAccessToken
};

import userService from '../services/userService.js';
import { verifyRefreshToken } from '../utils/helper.js';

const register = async (req, res, next) => {
    try {
        const { email, name, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords doesn't match" });
        }

        const { accessToken, refreshToken } = await userService.register({ email, name, password, confirmPassword });
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
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

const refreshAccessToken = (req, res) => {
    try {
        const { email, refreshToken } = req.body;
        const isValid = verifyRefreshToken(email, refreshToken);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid token, try login again' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        const accessToken = jwt.sign({ email: email }, jwtSecret, {
            expiresIn: '3h'
        });

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

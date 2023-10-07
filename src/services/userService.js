import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../model/user.js';
import { verifyRefreshToken } from '../utils/helper.js';

const register = async ({ email, name, password }) => {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash });
    const accessToken = jwt.sign({ id: user._id, email }, user.accessTokenKey, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ id: user._id, email }, user.refreshTokenKey, { expiresIn: '1d' });
    return { accessToken, refreshToken };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
        throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign({ id: user._id, email: user.email }, user.accessTokenKey, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ id: user._id, email: user.email }, user.refreshTokenKey, { expiresIn: '1d' });
    return { accessToken, refreshToken };
};

const refreshToken = async ({ email, refreshToken }) => {
    const user = await User.findOne({ email });
    const isValid = verifyRefreshToken({ email, refreshToken, refreshSecret: user.refreshTokenKey });
    if (!isValid) {
        return false
    }

    const accessToken = jwt.sign({ email: email }, user.accessTokenKey, {
        expiresIn: '3h'
    });

    return accessToken
};

export default { register, login, refreshToken };

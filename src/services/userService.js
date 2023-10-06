import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotEnv from 'dotenv';

import User from '../model/user.js';

dotEnv.config();

const { JWT_SECRET: jwtSecretKey, REFRESH_SECRET: refreshSecretKey } = process.env;

const register = async ({ email, name, password }) => {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User.create({ email, name, passwordHash });
    const accessToken = jwt.sign({ id: user._id, email }, jwtSecretKey, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ id: user._id, email }, refreshSecretKey, { expiresIn: '1d' });
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

    const accessToken = jwt.sign({ id: user._id, email: user.email }, jwtSecretKey, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ id: user._id, email: user.email }, refreshSecretKey, { expiresIn: '1d' });
    return { accessToken, refreshToken };
};

export default { register, login };

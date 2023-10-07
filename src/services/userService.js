import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../model/user.js';
import { verifyToken } from '../utils/helper.js';

const register = async ({ email, name, password }) => {
    // 1. Hash the password
    // 2. Create user document in db
    // 3. Generates access token and refresh token and returns it
    //  3.1 NOTE: we are getting secret keys to generate JWT's from DB to increase security
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash });
    const accessToken = jwt.sign({ id: user._id, email }, user.accessTokenKey, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ id: user._id, email }, user.refreshTokenKey, { expiresIn: '1d' });
    return { accessToken, refreshToken };
};

const login = async ({ email, password }) => {
    // 1. Find user by email
    // 2. If user not found. throws an error which will be handled by error middleware
    // 3. Compares the password with hashed password
    //  3.1 Check fails, then throw an error
    // 4. Generate refresh and access token and return it
    //  4.1 NOTE: we are getting secret keys to generate JWT's from DB to increase security
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
    // 1. Get the user by email
    // 2. Verify if refresh token is valid
    //  2.1 If not valid return false
    //  2.2 If valid return access token
    const user = await User.findOne({ email });
    const isValid = verifyToken({ email, token: refreshToken, secret: user.refreshTokenKey });
    if (!isValid) {
        return false;
    }

    const accessToken = jwt.sign({ email: email }, user.accessTokenKey, {
        expiresIn: '3h'
    });

    return accessToken;
};

const verifyAccessToken = async (token) => {
    // 1. Decode access token
    // 2. Get user for fetch access token secret key
    // 3. Calls verifyToken
    // 4. Return valid or not
    const decodedValue = jwt.decode(token);
    const user = await User.findOne({ email: decodedValue.email });
    const isValid = verifyToken({ email: decodedValue.email, token, secret: user.accessTokenKey });
    return isValid;
};

export default { register, login, refreshToken, verifyAccessToken };

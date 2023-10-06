import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../model/user.js';

const register = async ({ email, name, password }) => {
    const passwordHash = await bcrypt.hash(password, 10);
    return User.create({ email, name, passwordHash });
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
        throw new Error('Invalid email or password');
    }

    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id }, jwtSecretKey);
    return token;
};

export default { register, login };

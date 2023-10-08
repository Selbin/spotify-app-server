import jwt from 'jsonwebtoken';

import User from '../model/user.js';

const authenticateUser = async (req, res, next) => {
    try {
        const bearerToken = req.get('authorization');
        if (!bearerToken) {
            return res.status(404).json({ message: 'Invalid access token' });
        }
        const token = bearerToken.split(' ')[1];
        const value = jwt.decode(token);
        const user = await User.findOne({ email: value.email });
        const decodedValue = jwt.verify(token, user.accessTokenKey);
        req.user = decodedValue;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default authenticateUser;

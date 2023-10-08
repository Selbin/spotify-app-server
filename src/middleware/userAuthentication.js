import jwt from 'jsonwebtoken';

import User from '../model/user.js';

const authenticateUser = async (req, res, next) => {
    try {
        // 1. Get the bearer token
        // 2. If bearer token not present, return 401 unauthorized
        // 3. Split the token to get jwt token
        // 4. Get the user from db to get secret key
        // 5. Verify JWT with the secret key
        // 6. Attach the decoded value to req.user and call next middleware 
        const bearerToken = req.get('authorization');
        if (!bearerToken) {
            return res.status(401).json({ message: 'Unauthorized' });
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

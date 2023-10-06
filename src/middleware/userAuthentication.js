import jwt from 'jsonwebtoken';

const jwtSecretKey = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
    try {
        let token = req.get('authorization').split(' ')[1];
        if (!token) {
            res.status(404).json({ message: 'Invalid access token' });
        }
        const decodedValue = jwt.verify(token, jwtSecretKey);
        req.user = decodedValue;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

export default authenticateUser

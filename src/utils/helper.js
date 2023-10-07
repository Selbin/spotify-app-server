import jwt from 'jsonwebtoken';

export const verifyRefreshToken = ({ email, token, refreshSecret }) => {
    try {
        const decodedValue = jwt.verify(token, refreshSecret);
        return decodedValue.email === email;
    } catch (error) {
        return false;
    }
};

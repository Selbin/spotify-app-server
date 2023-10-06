import jwt from 'jsonwebtoken';

export const verifyRefreshToken = (email, token) => {
    try {
        const refreshSecretKey = process.env.REFRESH_SECRET;
        const decodedValue = jwt.verify(token, refreshSecretKey);
        return decodedValue.email === email;
    } catch (error) {
        return false;
    }
};

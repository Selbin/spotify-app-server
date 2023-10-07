import jwt from 'jsonwebtoken';

export const verifyToken = ({ email, token, secret }) => {
    // 1. Verify the refresh token
    // 2. compare the decoded email with given email to check validity
    // 3. return if it is valid or not
    try {
        const decodedValue = jwt.verify(token, secret);
        return decodedValue.email === email;
    } catch (error) {
        return false;
    }
};

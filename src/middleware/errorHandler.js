import logger from "../logger/logger.js";

export const errorHandler = (err, req, res, next) => {
    // Sent response based on error
    logger.error(err.message)
    if (err.message === 'Invalid email or password') {
        return res.status(401).json({ message: 'Invalid email or password' });
    } else if (err.message === 'Email is already in use') {
        return res.status(422).json({ message: err.message });
    } else {
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

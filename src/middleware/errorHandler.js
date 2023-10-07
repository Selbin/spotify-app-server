export const errorHandler = (err, req, res, next) => {
    // Sent response based on error
    if (err.message === 'Invalid email or password') {
        return res.status(401).json({ message: 'Invalid email or password' });
    } else if (err.message === 'Email is already in use') {
        return res.status(422).json({ message: err.message });
    } else {
        console.error(err)
        return res.status(500).json({ message: 'Unknown error occurred' });
    }
};

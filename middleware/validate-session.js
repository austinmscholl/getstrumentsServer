const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

const validateSession = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err || !decodedToken) {
            req.errors = err;
            return res.status(401).json({ error: 'Not authorized' });
        }

        User.findOne({ where: { id: decodedToken.id }})
            .then(user => {
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                req.user = user;
                return next();
            })
            .catch(err => {
                req.errors = err;
                return next(err);
            });
    });
}

module.exports = validateSession;

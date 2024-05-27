const express = require('express');
const router = express.Router();
const sequelize = require('../db');
const User = sequelize.import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validate-session');

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body.user;

        const user = await User.create({
            email: email,
            passwordhash: bcrypt.hashSync(password, 10)
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            user: user,
            message: 'User successfully created',
            sessionToken: token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body.user;
        
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const matches = await bcrypt.compare(password, user.passwordhash);

            if (matches) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                
                res.status(200).json({
                    user: user,
                    message: 'User successfully authenticated',
                    sessionToken: token
                });
            } else {
                res.status(401).json({ error: 'Invalid password' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

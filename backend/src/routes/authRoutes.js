import express from 'express';
import { login , signup } from '../controllers/authController.js';
import { middlewareToken } from '../config/jwt.js'
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/signup', signup);
authRoutes.get('/verify-token', middlewareToken, (req, res) => {
    res.status(200).json({ valid: true });
});

// Google OAuth routes
authRoutes.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRoutes.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user.UserID },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.redirect(`http://localhost:3001/login?token=${token}`);
    }
);

// Facebook OAuth routes
authRoutes.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

authRoutes.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user.UserID },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.redirect(`http://localhost:3001/login?token=${token}`);
    }
);

// GitHub OAuth routes
authRoutes.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

authRoutes.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user.UserID },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.redirect(`http://localhost:3001/login?token=${token}`);
    }
);

export default authRoutes;
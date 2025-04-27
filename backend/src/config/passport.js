import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import database from './database.js';

passport.serializeUser((user, done) => {
    done(null, user.UserID);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [users] = await database.query('SELECT * FROM Users WHERE UserID = ?', [id]);
        done(null, users[0]);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value
            ? profile.emails[0].value
            : null;

        if (!email) {
            return done(new Error('Email not provided by Google'), null);
        }

        const [existingUser] = await database.query(
            'SELECT * FROM Users WHERE Email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return done(null, existingUser[0]);
        }

        const [result] = await database.query(
            'INSERT INTO Users (Username, Email, Password, Provider) VALUES (?, ?, ?, ?)',
            [profile.displayName, email, null, 'google']
        );

        const newUser = {
            UserID: result.insertId,
            Username: profile.displayName,
            Email: email,
            Provider: 'google'
        };

        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value
            ? profile.emails[0].value
            : null;

        if (!email) {
            return done(new Error('Email not provided by Facebook'), null);
        }

        const [existingUser] = await database.query(
            'SELECT * FROM Users WHERE Email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return done(null, existingUser[0]);
        }

        const [result] = await database.query(
            'INSERT INTO Users (Username, Email, Password, Provider) VALUES (?, ?, ?, ?)',
            [profile.displayName, email, null, 'facebook']
        );

        const newUser = {
            UserID: result.insertId,
            Username: profile.displayName,
            Email: email,
            Provider: 'facebook'
        };

        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/github/callback",
    scope: ['user:email']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value
            ? profile.emails[0].value
            : null;

        if (!email) {
            return done(new Error('Email not provided by GitHub'), null);
        }

        const [existingUser] = await database.query(
            'SELECT * FROM Users WHERE Email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return done(null, existingUser[0]);
        }

        const [result] = await database.query(
            'INSERT INTO Users (Username, Email, Password, Provider) VALUES (?, ?, ?, ?)',
            [profile.displayName, email, null, 'github']
        );

        const newUser = {
            UserID: result.insertId,
            Username: profile.displayName,
            Email: email,
            Provider: 'github'
        };

        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

export default passport; 
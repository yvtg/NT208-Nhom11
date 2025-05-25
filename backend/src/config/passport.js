import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import database from "../config/database.js";

passport.serializeUser((user, done) => {
    done(null, user.userid);
});

passport.deserializeUser(async (id, done) => {
    try {
        const users = await database.query('SELECT * FROM users WHERE userid = $1', [id]);
        if (!users.rows[0]) {
            return done(new Error('User not found'), null);
        }
        done(null, users.rows[0]);
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

        let user = null;
        const existingUser = await database.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            user = existingUser.rows[0];
        } else {
            const result = await database.query(
                'INSERT INTO users (username, email, password, provider) VALUES ($1, $2, $3, $4) RETURNING *',
                [profile.displayName, email, null, 'google']
            );
            user = result.rows[0];
        }

        return done(null, user);
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

        let user = null;
        const existingUser = await database.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            user = existingUser.rows[0];
        } else {
            const result = await database.query(
                'INSERT INTO users (username, email, password, provider) VALUES ($1, $2, $3, $4) RETURNING *',
                [profile.displayName, email, null, 'facebook']
            );
            user = result.rows[0];
        }

        return done(null, user);
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

        let user = null;
        const existingUser = await database.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            user = existingUser.rows[0];
        } else {
            const result = await database.query(
                'INSERT INTO users (username, email, password, provider) VALUES ($1, $2, $3, $4) RETURNING *',
                [profile.displayName, email, null, 'github']
            );
            user = result.rows[0];
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

export default passport; 
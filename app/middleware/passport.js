const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../modals/user');

module.exports = function () {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
                scope: ["profile", "email"],
            },
            async function (accessToken, refreshToken, profile, done) {
                try {
                    const existingUser = await User.findOne({ googleId: profile.id });
                    if (existingUser) {
                        return done(null, existingUser);
                    }

                    const newUser = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    });

                    await newUser.save(); 
                    return done(null, newUser);
                } catch (error) {
                    console.error('Error saving user to DB:', error);
                    return done(error, null); 
                }
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        const user = await User.findById(id);
        done(null, user);
    });
};

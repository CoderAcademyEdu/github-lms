const GithubStrategy = require('passport-github').Strategy;
const db = require('../models/index');
const passport = require('passport');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findById(id)
    .then(user => done(null, user))
    .catch(error => done(error, false));
});

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK
}, (accessToken, refreshToken, profile, done) => {
  // This is not being used currently
  // POST `/github/callback` handles this logic
  console.log('Running github strategy callback');
  done();
}));

module.exports = passport;
const express = require('express');
const axios = require('axios');
const queryString = require('query-string');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const router = express.Router();
const db = require('../models/index');
const { isAuthenticated, hasRole } = require('../utils/auth');

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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findById(id)
    .then(user => done(null, user))
    .catch(error => done(error, false));
});

router.get('/logout', (req, res) => {
  req.logout();
  return res.send('Logged out');
});

router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

const getAccessToken = async (code) => {
  return axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: code
  });
}

const getUserProfile = async (accessToken) => {
  const options = {
    headers: {
      Authorization: `token ${accessToken}`
    }
  }
  return axios.get('https://api.github.com/user', options);
}

router.post('/github/callback', async (req, res) => {
  const { code } = req.body;
  const accessTokenResponse = await getAccessToken(code);
  const accessToken = queryString.parse(accessTokenResponse.data).access_token;
  const userProfileResponse = await getUserProfile(accessToken);
  const profile = userProfileResponse.data;
  db.User.findOrCreateByProfile(profile)
    .spread((user, created) => {
      req.login(user, (err) => {
        if (err) { return next(err); }
        return res.send(user);
      });
    });
});

router.post('/:cohort/enrol', isAuthenticated, hasRole(['teacher']), (req, res) => {
  const { cohort } = req.params;
  const { login } = req.body;
  Promise.all([
    db.User.findByLogin(login),
    db.Cohort.findByCode(cohort)
  ])
    .then(([user, dbCohort]) => {
      user.addCohort(dbCohort)
        .then(() => res.send(`Enrolled ${login} in ${cohort}`));
    });
});

router.post('/:cohort/unenrol', isAuthenticated, hasRole(['teacher']), (req, res) => {
  const { cohort } = req.params;
  const { login } = req.body;
  Promise.all([
    db.User.findByLogin(login),
    db.Cohort.findByCode(cohort)
  ])
    .then(([user, dbCohort]) => {
      user.removeCohort(dbCohort)
        .then(() => res.send(`Unenrolled ${login} from ${cohort}`));
    });
});

module.exports = router;
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
  console.log('AUTHENTICATING');
  done();
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findOne({
    where: { id },
    include: {
      model: db.Cohort,
      through: db.UserCohort,
      as: 'cohorts'
    }
  })
    .then(user => done(null, user))
    .catch(error => done(error, false));
});

router.get('/logout', (req, res) => {
  req.logout();
  return res.send('Logged out');
});

router.get('/login', passport.authenticate('github', { scope: [ 'user:email'] }));

router.post('/github/callback', (req, res) => {
  const { code } = req.body;
  axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: code
  })
    .then(resp => {
      const params = queryString.parse(resp.data);
      const options = {
        headers: {
          Authorization: `token ${params.access_token}`
        }
      }
      axios.get('https://api.github.com/user', options)
        .then(resp => {
          const { data: profile } = resp;
          db.User.findOrCreate({
            where: { id: profile.id },
            include: {
              model: db.Cohort,
              through: db.UserCohort,
              as: 'cohorts'
            },
            defaults: {
              id: profile.id,
              role: 'student',
              email: profile.email,
              image: profile.avatar_url,
              login: profile.login,
              name: profile.name
            }
          })
            .spread((user, created) => {
              req.login(user, (err) => {
                if (err) { return next(err); }
                return res.send(user);
              });
            });
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
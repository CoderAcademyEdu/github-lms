const env = require('dotenv').load();
const express = require('express');
const path = require('path');
const uuid = require('uuid/v4');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const github = require('./utils/github');
const GithubStrategy = require('passport-github').Strategy;
const axios = require('axios');
const queryString = require('query-string');

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

const app = express();
const port = process.env.PORT || 5000;

const db = require('./models/index');
app.use(session({
  genid: (req) => {
    return uuid();
  },
  secret: process.env.SECRET,
  store: new SequelizeStore({
    db: db.sequelize
  }),
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(passport.initialize());
app.use(passport.session());

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.session.user;
    return next();
  }
  return res.status(403).send('Not authorised');
}

const hasRole = (roles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return res.status(403).send('Not authorised');
    }
    return next();
  }
}

const isEnrolled = (req, res, next) => {
  const { cohort } = req.params;
  const { cohorts, role } = req.user;
  const userIsEnrolled = cohorts.filter(c => c.code === cohort).length > 0;
  if (userIsEnrolled || role === 'teacher' || role === 'admin') {
    return next();
  }
  return res.status(403).send('Not authorised');
}

app.get('/auth/logout', (req, res) => {
  req.logout();
  return res.send('Logged out');
});

app.get('/auth/login', passport.authenticate('github', { scope: [ 'user:email']}));

app.post('/auth/github/callback', (req, res) => {
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
              // db.Cohort.create({ code: 'M0218' })
              // .then(cohort => {
              //   user.addCohort(cohort)
              //   .then(() => {
                      req.login(user, (err) => {
                        if (err) { return next(err); }
                        return res.send(user);
                      });
                      // db.User.findOne({ where: { id: user.id }, include: {
                      //   model: db.Cohort,
                      //   through: db.UserCohort,
                      //   as: 'cohorts'
                      // },})
                      //   .then(newOne => {
                      //     console.log(newOne.cohorts)
                      //     // console.log(user.cohorts)
                      //   })

                //     })
                // })
            });
        });
    });
});

app.post('/auth/:cohort/enrol', isAuthenticated, hasRole(['teacher']), (req, res) => {
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

app.post('/auth/:cohort/unenrol', isAuthenticated, hasRole(['teacher']), (req, res) => {
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

app.get('/api/students', isAuthenticated, hasRole(['teacher']), (req, res) => {
  db.User.findAll({
    where: { role: 'student' },
    include: {
      model: db.Cohort,
      through: db.UserCohort,
      as: 'cohorts'
    }
  })
    .then(students => res.send(students));
});

app.get('/api/:cohort/modules', isAuthenticated, isEnrolled, (req, res) => {
  const { cohort } = req.params;
  const url = `/${cohort}/modules`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

app.get('/api/:cohort/modules/:module', isAuthenticated, (req, res) => {
  const { cohort, module } = req.params;
  const url = `/${cohort}/modules/${module}`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

app.get('/api/:cohort/modules/:module/:lesson', isAuthenticated, (req, res) => {
  const { cohort, module, lesson } = req.params;
  const url = `/${cohort}/modules/${module}/${lesson}`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

app.get('/api/:cohort/challenges/:module/:challenge', isAuthenticated, (req, res) => {
  const { cohort, module, challenge } = req.params;
  const url = `/${cohort}/challenges/${module}/${challenge}`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// db.sequelize.sync({force: true}).then(() => {
//   app.listen(port, () => console.log(`API: http://localhost:${port}`));
// });
db.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`API: http://localhost:${port}`));
});
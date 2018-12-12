const env = require('dotenv').load();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    db.User.find({ where: { email } })
      .then(user => {
        if (!user) { return done(null, false, { message: 'Invalid credentials' }) };
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false, { message: 'Invalid credentials' }) };
        // valid
        return done(null, user);
      })
      .catch(error => done(error));
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.find({ where: { id } })
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

app.get('/api', (req, res) => {
  return res.send('API connected');
});

app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (info) { return res.send(info.message); }
    if (err) { return next(err); }
    if (!user) { return res.status(401).send('No user found'); }
    req.login(user, (err) => {
      if (err) { return next(err); }
      return res.send('Authenticated!');
    });
  })(req, res, next);
});

app.get('/auth/protected', (req, res) => {
  if (!req.isAuthenticated()) { return res.status(403).send('Not authorised'); }
  db.User.findAll().then(users => {
    return res.send(users);
  });
});

app.post('/auth/register', (req, res, next) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  console.log(hash);
  db.User.findOrCreate({
    where: { email },
    defaults: { email, password: hash }
  })
    .spread((user, created) => {
      req.login(user, (err) => {
        if (err) { return next(err); }
        return res.send('Authenticated!');
      });
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

db.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`API: http://localhost:${port}`));
});
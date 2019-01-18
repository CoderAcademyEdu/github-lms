const env = require('dotenv').load();
const express = require('express');
const path = require('path');
const uuid = require('uuid/v4');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const db = require('./models/index');

const app = express();
const port = process.env.PORT || 5000;

const sessionOptions = session({
  genid: (req) => {
    return uuid();
  },
  secret: process.env.SECRET,
  store: new SequelizeStore({
    db: db.sequelize
  }),
  resave: false,
  saveUninitialized: true
});

app.use(sessionOptions);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes'));

db.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`API: http://localhost:${port}`));
});
require('dotenv').load();
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const db = require('./models/index');
const passport = require('./config/passport');
const { refreshCookie } = require('./utils/auth');

const app = express();
const port = process.env.PORT || 5000;

const oneWeek = 1000 * 60 * 60 * 24 * 7;

const sessionOptions = cookieSession({
  keys: [process.env.SECRET],
  maxAge: oneWeek,
});

app.use(sessionOptions);
app.use(passport.initialize());
app.use(passport.session());
app.use(refreshCookie)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(require('./routes'));

db.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`API: http://localhost:${port}`));
});
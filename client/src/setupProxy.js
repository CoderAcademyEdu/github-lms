const proxy = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(proxy('/api', { target: 'http://localhost:5000/'}));
  app.use(proxy('/auth', { target: 'http://localhost:5000/'}));
}
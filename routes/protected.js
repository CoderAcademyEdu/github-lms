const express = require('express');
const router = express.Router();
const github = require('../utils/github');
const { isAuthenticated, hasRole, isEnrolled } = require('../utils/auth');
const db = require('../models/index');
const request = require('request');

router.use(isAuthenticated);
router.use(isEnrolled);

router.get('/students', hasRole(['teacher']), (req, res) => {
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

router.get('/:cohort/modules', (req, res) => {
  const { cohort } = req.params;
  const url = `/${cohort}/modules`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

router.get('/:cohort/modules/:module', (req, res) => {
  const { cohort, module } = req.params;
  const url = `/${cohort}/modules/${module}`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

router.get('/:cohort/modules/:module/:lesson', (req, res) => {
  const { cohort, module, lesson } = req.params;
  const url = `/${cohort}/modules/${module}/${lesson}`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

router.get('/:cohort/challenges/:module/:challenge', (req, res) => {
  const { cohort, module, challenge } = req.params;
  const url = `/${cohort}/challenges/${module}/${challenge}`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

router.get('/:cohort/code/:module/:file', (req, res) => {
  const { GITHUB_BASE_URL: githubUrl, GITHUB_TOKEN: token } = process.env;
  const { cohort, module, file } = req.params;
  const url = `${githubUrl}/${cohort}/code/${module}/${file}`;
  const options = {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v4.raw',
      'User-Agent': 'request'
    }
  }
  req.pipe(request(url, options))
    .pipe(res);
});

module.exports = router;
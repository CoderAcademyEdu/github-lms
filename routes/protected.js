const express = require('express');
const router = express.Router();
const axios = require('axios');
const github = require('../utils/github');
const { hasRole, isEnrolled } = require('../utils/auth');
const db = require('../models/index');
const request = require('request');

router.get('/students', hasRole(['teacher']), (req, res) => {
  db.User.findAllStudents()
    .then(students => res.send(students));
});

router.get('/users', hasRole(['teacher']), (req, res) => {
  db.User.findAllUsers()
    .then(users => res.send(users));
});

router.get('/:cohort/modules', isEnrolled, (req, res) => {
  const { cohort } = req.params;
  const url = `/${cohort}/modules`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

router.get('/:cohort/modules/:module', isEnrolled, (req, res) => {
  const { cohort, module } = req.params;
  const url = `/${cohort}/modules/${module}`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

router.get('/:cohort/modules/:module/:lesson', isEnrolled, (req, res) => {
  const { cohort, module, lesson } = req.params;
  const url = `/${cohort}/modules/${module}/${lesson}`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

router.get('/:cohort/challenges/:module/:challenge', isEnrolled, (req, res) => {
  const { cohort, module, challenge } = req.params;
  const url = `/${cohort}/challenges/${module}/${challenge}`;
  github.get(url)
    .then(({ data }) => res.send(data))
    .catch(error => res.send(error));
});

router.get('/:cohort/code/:module/:file', isEnrolled, (req, res) => {
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

router.post('/:cohort/attendance/signin', isEnrolled, async (req, res) => {
  const { CAMPUS_IP: campusIp } = process.env;
  const date = new Date(req.body.date);
  const { data: userIp } = await axios.get('https://api.ipify.org');
  if (campusIp !== userIp) {
    return res.status(405).send('not on campus');
  }
  db.Attendance.create({
    timeIn: date,
    UserId: req.user.id
  }, {
    include: db.User
  })
    .then(resp => res.send('Successfully signed in'))
});

router.get('/:cohort/attendance/last-signin', isEnrolled, async (req, res) => {
  db.Attendance.findOne({
    limit: 1,
    where: { UserId: req.user.id},
    order: [['createdAt', 'DESC']]
  })
    .then(resp => {
      const timeIn = resp && resp.timeIn;
      res.send({ timeIn })
    });
});

module.exports = router;
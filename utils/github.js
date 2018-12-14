const axios = require('axios');

const github = axios.create({
  baseURL: process.env.GITHUB_BASE_URL,
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v4.raw'
  }
});

module.exports = github;
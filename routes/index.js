const express = require('express');
const path = require('path');
const router = express.Router();

router.use('/api', require('./protected'));
router.use('/auth', require('./auth'));

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;
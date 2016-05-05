'use strict';

const express = require('express');
const util = require('../../lib/util');

const router = express.Router();

router.get('/say', function (req, res, next) {
  const data = {
    msg: 'Hello Redux from API!'
  };
  res.json(util.success(data));
});

module.exports = router;

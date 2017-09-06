const express = require('express');
const router = express.Router();

module.exports = function (app) {
  app.use('/ads', router);
};

router.get('/professional', (req, res, next) => {
  res.render('landing/professional')
})

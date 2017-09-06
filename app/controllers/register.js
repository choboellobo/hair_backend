const express = require('express');
const router = express.Router();
const path = require('path');

module.exports = function (app) {
  app.use('/register', router);
};

router.get('/', (req, res, next) => {
  //res.render('register/index', {professional: {}})
  res.sendFile(path.join(__dirname,'../../public/app/register/index.html'))
})

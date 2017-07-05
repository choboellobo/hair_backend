let express = require('express');
let router = express.Router();
let path = require('path');

module.exports = function (app) {
  app.use('/register', router);
};

router.get('/', function(req, res, next) {
  //res.render('register/index', {professional: {}})
  res.sendFile(path.join(__dirname,'../../public/app/register/index.html'))
})

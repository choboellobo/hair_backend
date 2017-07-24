let express = require('express');
let router = express.Router();

module.exports = function (app) {
  app.use('/landing', router);
};

router.get('/professional', function(req, res, next){
  res.render('landing/professional')
})

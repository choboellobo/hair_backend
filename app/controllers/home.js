let express = require('express');
let router = express.Router();
let Profesional = require('../models/professional');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/:id', function (req, res, next) {
  Profesional.findById(req.params.id).populate('services.service')
  .then(
  professional => {
  res.render('detail', {professional: professional});
  },
  error => res.render('notfound')
  );
});

let express = require('express');
let router = express.Router();
let Profesional = require('../models/professional');
let crypter = require('../helpers/crypto');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login')
})
router.post('/login', function(req, res, next){
  Profesional.findOne({email: req.body.email, password: crypter.encrypt(req.body.password)})
              .then(
                professional => {
                  if(!professional) return res.render('login', {error: true})
                  req.session.professional = professional._id
                  res.redirect(`/${professional._id}/old`);
                },
                error => {
                  res.render('login', {error: true})
                }
              )
})
router.get('/:id', function (req, res, next) {
  Profesional.findById(req.params.id).populate('services.service')
  .then(
  professional => {
  res.render('profile', {professional: professional});
  },
  error => next()
  );
});
router.get('/:id/old', function (req, res, next) {
  Profesional.findById(req.params.id).populate('services.service')
  .then(
  professional => {
  res.render('detail', {professional: professional, session: req.session});
  },
  error => res.render('notfound')
  );
});

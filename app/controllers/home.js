let express = require('express');
let router = express.Router();
let Professional = require('../models/professional');
let crypter = require('../helpers/crypto');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login', {session: req.session})
})
router.post('/login', function(req, res, next){
  Professional.findOne({email: req.body.email, password: crypter.encrypt(req.body.password)})
              .then(
                professional => {
                  if(!professional) return res.render('login', {error: true, session: req.session})
                  req.session.professional = professional._id
                  res.redirect(`/${professional._id}`);
                },
                error => {
                  res.render('login', {error: true, session: req.session})
                }
              )
})
router.get('/:id', function (req, res, next) {
  Professional.findById(req.params.id).populate('services.service')
  .then(
    professional => {
      res.render('profile', {professional: professional});
  },
    error => next()
  );
});
router.get('/:id/old', function (req, res, next) {
  Professional.findById(req.params.id).populate('services.service')
  .then(
    professional => {
      res.render('detail', {professional: professional, session: req.session});
  },
    error => res.render('notfound')
  );
});

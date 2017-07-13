let express = require('express');
let router = express.Router();
let Professional = require('../models/professional');
let Service = require('../models/service');
let crypter = require('../helpers/crypto');

module.exports = function (app) {
  app.use('/', router);
};
/*
  GET / --- home ---
*/
router.get('/', function (req, res, next) {
  res.render('index');
});
/*
  GET /LOGOUT
*/
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if(err) return next(err);
    res.redirect('/login')
  })
})
/*
  GET /login
*/
router.get('/login', function(req, res, next) {
  res.render('login', {session: req.session})
})
/*
  POST /login
*/
router.post('/login', function(req, res, next){
  Professional.findOne({email: req.body.email, password: crypter.encrypt(req.body.password)})
              .then(
                professional => {
                  if(!professional) return res.render('login', {error: true, session: req.session})
                  req.session.professional = professional._id
                  req.session.slug = professional.slug
                  res.redirect(`/${professional.slug}`);
                },
                error => {
                  res.render('login', {error: true, session: req.session})
                }
              )
})
/*
  GET /:slug
*/
router.get('/:slug', function (req, res, next) {
  // Looking for a professional by slug
  Professional.findOne({slug: req.params.slug},{password: 0}).populate('services')
  .then(
    professional => {
      // Looking for all services.
      Service.find().then(
        services => {
          if(!professional) return next()
          res.render('profile', {services: services,professional: professional, session: req.session});
        }
      )
  },
    error => next()
  );
});

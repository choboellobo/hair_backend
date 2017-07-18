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
  if(Object.keys(req.query).length == 0) {
    res.render('index', {session: req.session});
  }else {
    let regExp = new RegExp(req.query.w, 'i')
    Professional.find(
      {'address.location': regExp},
      {slug: 1, avatar: 1, first_name: 1, last_name: 1, background: 1, gender: 1, services: 1, options: 1, description: 1, phone: 1})
      .sort({created_at: 1})
      .populate('services')
      .then(
        professionals => {
          res.render('results', {professionals: professionals, session: req.session})
        }
      )
  }

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

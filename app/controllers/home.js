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
    let query = {'address.location': regExp}
    if(req.query.gender) query.gender = req.query.gender
    Professional.find(
      query,
      {slug: 1, avatar: 1, first_name: 1, last_name: 1, background: 1, gender: 1, services: 1, options: 1, description: 1, phone: 1})
      .sort({created_at: 1})
      .populate('services')
      .then(
        professionals => {
          res.render('results', {professionals: professionals, session: req.session, query: req.query})
        }
      )
  }

});

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
          res.render('professional/profile', {services: services,professional: professional, session: req.session});
        }
      )
  },
    error => next()
  );
});

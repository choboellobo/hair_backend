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
    res.render('index');
  }else {
    let regExp = new RegExp(req.query.w, 'i')
    let query = {'address.location': regExp}
    if(req.query.gender) query.gender = req.query.gender
    if(req.query.services) query.services = req.query.services
    Professional.find(
      query,
      {slug: 1, avatar: 1, first_name: 1, last_name: 1, background: 1, gender: 1, services: 1, options: 1, description: 1, phone: 1})
      .sort({created_at: 1})
      .populate('services')
      .then(
        professionals => {
          Service.find().then(
            services => res.render('results', {professionals: professionals, services: services, query: req.query})
          )
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
          res.render('professional/profile', {services: services,professional: professional });
        }
      )
  },
    error => next()
  );
});

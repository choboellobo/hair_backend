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
    let query = {'address.location': regExp, active: true}
    if(req.query.gender) query.gender = req.query.gender
    if(req.query.services) query.services = req.query.services
    Professional.find(
      query,
      {slug: 1, avatar: 1, first_name: 1, last_name: 1, background: 1, gender: 1, services: 1, options: 1, description: 1, phone: 1, payments: 1})
      .sort({'payments.plan': -1, 'created_at': 1})
      .populate('services')
      .then(
        professionals => {
          Service.find().then(
            services => res.render('results', { professionals: professionals, services: services, query: req.query})
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
  Professional.findOne({slug: req.params.slug, active: true},{password: 0}).populate('services')
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

/** CUSTOMER FILTERS ***/
router.get('/busco/:query', function(req, res, next){
  let what = req.params.query.split("-");
  let location = what[2]
  let profession = what[0]
  let regExpLocation = new RegExp(location, 'i')
  let regExpProfession = new RegExp(profession, 'i')
  if(what[1] != 'en') return next()
  Service.findOne({'professions': regExpProfession})
  .then(
    service => {
      if(service == null) return next()
      Professional.find(
        {'address.location': regExpLocation, services: service._id, active:true},
        {slug: 1, avatar: 1, first_name: 1, last_name: 1, background: 1, gender: 1, services: 1, options: 1, description: 1, phone: 1, payments: 1})
        .sort({'payments.plan': -1, 'created_at': 1})
        .populate('services')
        .then(professionals => {
          Service.find().then(
            services => {
              if(professionals.length == 0) return next();
              res.render('results', {seo: `${profession.charAt(0).toUpperCase() + profession.slice(1)} ${what[1]} ${location.charAt(0).toUpperCase() + location.slice(1)}`,professionals: professionals, services: services, query: {w:what[2]}})
            }
          )
        })
    }
  )
})

router.get('/aviso-legal', function(req, res, next){
  res.render('legal');
})

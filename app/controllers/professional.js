var express = require('express'),
	router = express.Router(),
	Professional = require('../models/professional'),
	crypter = require('../helpers/crypto'),
	jwt = require('../helpers/jwt');

	module.exports = function (app) {
		app.use('/professional', router);
	};


  router.post('/update', function(req, res, next){
    let p = req.session.professional
    Professional.update({_id: p}, {$set: req.body})
                .then(
                  response => res.redirect(`/${req.session.slug}`),
                  error => res.json(error)
                )
  })

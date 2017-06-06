var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Service = require("../models/service"),
	jwt = require("../helpers/jwt");

module.exports = function (app) {
  app.use('/service', router);
};

router.get("/", jwt.middleware, function(jwt_data, req, res, next){
	Service.find()
				 .then(s => res.status(200).json(s))
				 .catch(error => res.status(400).json({error: true, catch: error}))
})
router.get("/:id", jwt.middleware, function(jwt_data, req, res, next){
	Service.findById(req.params.id)
				 .then(s => res.status(200).json(s))
				 .catch(error => res.status(400).json({error: true, catch: error}))
})

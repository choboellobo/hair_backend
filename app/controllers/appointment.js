var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Appointment = require("../models/appointment");
let jwt = require("../helpers/jwt");

module.exports = function (app) {
  app.use('/appointment', router);
};

router.post("/", jwt.middleware_admin,  function(jwt_data,req, res, next){
	if(!req.body.user) return next("user")
  if(!req.body.professional) return next("professional")
  if(!req.body.service) return next("service")

	let new_appointment = new Appointment({
    user_id:req.body.user,
    professional_id:req.body.professional,
    service_id: req.body.service
  })
			new_appointment.save()
											.then(
												a => res.status(201).json(a)
											)
}, function(property, req, res, next){
  res.status(400).json({error: true, message: `${property} no esta enviada.`})
})

router.get("/", jwt.middleware_admin, function(jwt_data,req, res, next){
	Appointment.find({})
							.populate('user_id', {password: 0})
              .populate("professional_id", {password: 0})
              .populate("service_id")
							.then(
								a => res.status(200).json(a)
							)
})

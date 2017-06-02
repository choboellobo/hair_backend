var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Appointment = require("../models/appointment");
let jwt = require("../helpers/jwt");

module.exports = function (app) {
  app.use('/appointment', router);
};

router.post("/", function(req, res, next){
	let user = "592d4cc48967d7a92f030b87"
	let professional = "59319cc254ae912105ae03d2"

	let new_appointment = new Appointment({user_id:user, professional_id:professional})
			new_appointment.save()
											.then(
												a => res.status(201).json(a)
											)
})

router.get("/", function(req, res, next){
	Appointment.find({})
							.populate('user_id professional_id', {password: 0})
							.then(
								a => res.status(200).json(a)
							)
})

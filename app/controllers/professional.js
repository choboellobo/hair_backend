var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
	Professional = require("../models/professional"),
	crypter = require("../helpers/crypto");

let jwt = require("../helpers/jwt");

	module.exports = function (app) {
	  app.use('/professional', router);
	};
  router.post("/login", function(req, res, next){
    Professional.findOne({email: req.body.email, password: crypter.encrypt(req.body.password)})
      .then(p => {
        if(!p) return res.status(400).json({error: true, message: "Email o contraseña erroneos"})
        res.status(200).json({
          token: jwt.generate({_id: 15435345}),
          professional: p
        })
      })
  })
	router.get("/", jwt.middleware, function(jwt_data, req, res, next){
		Professional.find({},{password: 0})
								.then(
									professionals => res.status(200).json(professionals)
								)
	})
	router.post("/", function(req, res, next){
		let professional = req.body;
		Professional.findOne({email: professional.email})
								.then(
									pro => {
										if(pro) res.status(403).json({error : true, message: "Professional exists into the database"})
										else {
											professional.password = crypter.encrypt(professional.password);
											let new_professional = new Professional(professional);
													new_professional.save()
																					.then(
																						p => {
																							Professional.findOne({_id: p._id},{password: 0})
																							.then(p => {
																								res.status(201).json(p)
																							})
																						}
																					)
																					.catch(

																						error => {
																							console.log(error)
																							res.status(400).json({error: true, catch: error})
																						}
																					)
										}
									}
								)
	})

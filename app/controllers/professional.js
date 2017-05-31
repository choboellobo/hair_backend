var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
	Professional = require("../models/professional"),
	crypter = require("../helpers/crypto");

	module.exports = function (app) {
	  app.use('/professional', router);
	};

	router.get("/", function(req, res, next){
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

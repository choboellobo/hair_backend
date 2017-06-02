var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
	Professional = require("../models/professional"),
	crypter = require("../helpers/crypto"),
  jwt = require("../helpers/jwt");

	module.exports = function (app) {
	  app.use('/professional', router);
	};
  /*****
    POST /professional/login
    Mandatory {email: String, password: String}
    return 200 {token: String, {professional: Object}}
  ******/
  router.post("/login", function(req, res, next){
    Professional.findOne({email: req.body.email, password: crypter.encrypt(req.body.password)})
      .then(p => {
        if(!p) return res.status(400).json({error: true, message: "Email o contraseña erroneos"})
        res.status(200).json({
          token: jwt.generate({_id: p._id, type: p.type}),
          professional: p
        })
      })
  })
  /*****
    GET /professional
    authorization: true
    Filter allowed throw query params: active, first_name, last_name
    return 200 {token: String, {professional: Object}}
  ******/
	router.get("/", jwt.middleware, function(jwt_data, req, res, next){
    let query = {}
    req.query.active ? query.active = req.query.active : null
    req.query.first_name ? query.first_name = new RegExp(req.query.first_name) : null
    req.query.last_name ? query.last_name = new RegExp(req.query.last_name) : null
    req.query.working_place ? query.working_place = parseInt(req.query.working_place) : null

		Professional.find(query, {password: 0})
								.then(
									professionals => res.status(200).json(professionals)
								)
                .catch(
                  error => res.status(400).json({error: error})
                )
	})

  /*****
    POST /professional
    authorization: true
    Mandatory ProfessionalModel
    return  201 {professional: Object}
  ******/
	router.post("/", function( req, res, next){
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

var express = require('express'),
	router = express.Router(),
	Professional = require('../models/professional'),
	crypter = require('../helpers/crypto'),
	jwt = require('../helpers/jwt');

	module.exports = function (app) {
		app.use('/professional', router);
	};
	/**
		POST /professional/login
		Mandatory {email: String, password: String}
		return 200 {token: String, {professional: Object}}
	******/
	router.post('/login', function (req, res, next){
		Professional.findOne({email: req.body.email, password: crypter.encrypt(req.body.password)})
			.then(p => {
				if (!p) return res.status(400).json({error: true, message: 'Email o contraseña erroneos'});
				res.status(200).json({
					token: jwt.generate({_id: p._id, type: p.type}),
					professional: p
				});
			});
	});
	/**
		GET /professional
		authorization: true
		Filter allowed throw query params: active, first_name, last_name, working_place and page
		return 200 { professional: Object}
	******/
	router.get('/', jwt.middleware, function (jwt_data, req, res, next) {
		let query = {};
		let options = {select: {password: 0}};
		req.query.active ? query.active = req.query.active : null;
		req.query.first_name ? query.first_name = new RegExp(req.query.first_name) : null;
		req.query.last_name ? query.last_name = new RegExp(req.query.last_name) : null;
		req.query.working_place ? query.working_place = parseInt(req.query.working_place) : null;
		req.query.document_id ? query.document_id = req.query.document_id : null;
		if (req.query.page) options.page = req.query.page;

		Professional.paginate(query, options)
								.then(
									professionals => res.status(200).json(professionals)
								)
								.catch(
									error => res.status(400).json({error: error})
								);
	});

	/**
		POST /professional
		authorization: false
		Mandatory ProfessionalModel
		return  201 {professional: Object}
	******/
	router.post('/', function (req, res, next) {
		let professional = req.body;
		Professional.findOne({email: professional.email})
								.then(
									pro => {
										if (pro) res.status(403).json({error: true, message: 'Professional exists into the database'});
										else {
											professional.password = crypter.encrypt(professional.password);
											let new_professional = new Professional(professional);
											new_professional.save()
											.then(
												p => {
													Professional.findOne({_id: p._id}, {password: 0})
													.then(p => {
														res.status(201).json(p);
													});
												}
											)
											.catch(
												error => {
													res.status(400).json({error: true, catch: error});
												}
											);
										}
									}
								);
	});

	router.patch('/:id', jwt.middleware, function (jwt_data, req, res, next) {
		let professional = req.params.id;
		let data = req.body;
		if (jwt_data._id !== professional && jwt_data.status !== 'admin') return res.status(401).json({error: true, message: 'Only an admin or the same professional can update.'});
		Professional.update({_id: professional}, {$set: data})
								.then(
									response => res.status(200).end(),
									error => res.json(error)
								);
	});

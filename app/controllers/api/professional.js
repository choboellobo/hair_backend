const express = require('express');
const router = express.Router();
const Professional = require('../../models/professional');
const crypter = require('../../helpers/crypto');
const jwt = require('../../helpers/jwt');
const Mailer = require('../../mailer/emails');

	module.exports = function (app) {
		app.use('/api/professional', router);
	};
	/**
		POST /professional/login
		Mandatory {email: String, password: String}
		return 200 {token: String, {professional: Object}}
	******/
	router.post('/login',  (req, res, next) => {
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
	router.get('/', jwt.middleware,  (jwt_data, req, res, next) =>  {
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
	router.post('/',  (req, res, next) => {
		// Find if professional exists
		Professional.findOne({email: req.body.email})
								.then(
									professional => {
										// If professional exits 403
										if (professional) res.status(403).json({error: true, message: 'Professional exists into the database'});
										else {
											// Save a new professional
											req.body.password = crypter.encrypt(req.body.password);
											let new_professional = new Professional(req.body);
											new_professional.save()
											.then(
												newProfessional => {
													// Send an email to validate
													Mailer.validate_account(newProfessional, '/professional/validate/'+crypter.encrypt(newProfessional.id))
													res.status(201).json({
														token: jwt.generate({_id: newProfessional._id, type: newProfessional.type}),
														professional: newProfessional
													});

												},
												error => res.status(400).json({error: true, catch: error})
											)
										}
									}
								)
	});

	router.patch('/:id', jwt.middleware,  (jwt_data, req, res, next) =>  {
		let professional = req.params.id;
		let data = req.body;
		if (jwt_data._id !== professional && jwt_data.type !== 'admin') return res.status(401).json({error: true, message: 'Only an admin or the same professional can update.'});
		Professional.update({_id: professional}, {$set: data})
								.then(
									response => res.status(204).end()
								)
								.catch(error => res.status(400).json(error)
							);
	});

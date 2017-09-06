const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Service = require("../../models/service");
const jwt = require("../../helpers/jwt");

module.exports = function (app) {
  app.use('/api/service', router);
};
/*****
  GET /service
  authorization: true
  return {services: Array<Object>}
******/
router.get("/", jwt.middleware, (jwt_data, req, res, next) => {
	Service.find()
				 .then(s => res.status(200).json(s))
				 .catch(error => res.status(400).json({error: true, catch: error}))
})
/*****
  GET /service/:id
  authorization: true
  return {service: Object}
******/
router.get("/:id", jwt.middleware, (jwt_data, req, res, next) => {
	Service.findById(req.params.id)
				 .then(s => res.status(200).json(s))
				 .catch(error => res.status(400).json({error: true, catch: error}))
})

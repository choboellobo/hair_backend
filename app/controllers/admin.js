var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
	Admin = require("../models/admin"),
	crypter = require("../helpers/crypto"),
	jwt = require("../helpers/jwt");

	module.exports = function (app) {
	  app.use('/admin', router);
	};

  /*****
    POST /admin
    Mandatory {email : String, password: String }
    return {token: String, {admin: Object}}
  ******/
	router.post("/login", function(req, res, next){
		Admin.findOne({email: req.body.email, password: req.body.password},{password: 0})
      .then(a => {
        if(!a) return res.status(400).json({error: true, message: "Email o contraseña erroneos"})
        res.status(200).json({
          token: jwt.generate({_id: a._id, level: a.level, type: a.type }),
					admin: a
        })
      })
	})

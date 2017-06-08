var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = require("../models/user"),
  crypter = require("../helpers/crypto"),
  jwt = require("../helpers/jwt");

module.exports = function (app) {
  app.use('/user', router);
};

/*
  GET /user
  Authorization: true
  Filter: first_name, last_name, page
  Return: {201: Created, 401: No Authorization, 400: Bad request, 409: Conflics}
*/
router.get('/', function (req, res, next) {
  var query = {};
  var options = { select: {password: 0} };
    if(req.query.first_name) {
      query.$or = query.$or || []
      query.$or.push({ first_name: new RegExp(req.query.first_name) })
    }
    if(req.query.last_name) {
      query.$or = query.$or || []
      query.$or.push({ last_name: new RegExp(req.query.last_name) })
    }
    if(req.query.page) options.page = req.query.page

    User.paginate(query,options)
    .then(
      users => res.status(200).json(users)
    )
    .catch(
      error => res.status(400).json({error : true, catch: error})
    )

});
/*
  POST /user
  Mandatory: {email: String, password: String, first_name: String, last_name: String }
  Return: {201: Created, 401: No Authorization, 400: Bad request, 409: Conflics}
*/
router.post("/", function(req, res, next){
    let user = req.body;
    if(!user) return res.status(403).json({error : true, message: "Data empty"})
    User.findOne({email: user.email})
        .then(userFound => {
          if(userFound) res.status(409).json({error : true, message: "User exists into the database"})
          else {
            user.password = crypter.encrypt(user.password);
            let u = new User(user);
            u.save()
                .then(newUser => res.status(201).json(newUser))
                .catch(error => res.status(400).json({error : true, catch: error}))
          }
        })
})

/*
  DELETE /user/:id
  Authorization: true
  Return: {200 , body empty o 403 Error}
*/
router.delete("/:id", function(req,res,next){
  let param_id = req.params.id;
  if(param_id) {
    User.remove({_id: param_id})
        .then(
          success => res.status(200).end(),
          error => res.status(400).json({error : true, catch: error})
        )
  }else {
    res.status(403).json({error : true, message: "Not id sent"})
  }
})

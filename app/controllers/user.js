var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = require("../models/user");
let jwt = require("../helpers/jwt");

module.exports = function (app) {
  app.use('/user', router);
};

router.get('/', function (req, res, next) {

  var query = {}
  var options = {select: {password: 0}}
    if(req.query.name) query.name = new RegExp(req.query.name)
    if(req.query.page) options.page = req.query.page
    User.paginate(query,options)
    .then(
      users => res.status(200).json(users)
    )
    .catch(
      error => res.status(400).json({error : true, catch: error})
    )

});

router.post("/", function(req, res, next){
    let body = req.body;
    if(!body) return res.status(403).json({error : true, message: "Body empty"})
    User.findOne({email: body.email})
        .then(user => {
          if(user) res.status(403).json({error : true, message: "User exists into the database"})
          else {
            let u = new User(req.body);
            u.save()
                .then(
                  newUser => res.status(201).json(newUser),
                  error => res.status(400).json({error : true, catch: error})
                )
          }
        })
})

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

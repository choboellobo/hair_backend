var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = require("../models/user");

module.exports = function (app) {
  app.use('/user', router);
};

router.get('/', function (req, res, next) {
  User.find()
    .then(
      users => res.status(200).json(users)
    )
    .catch(
      error => res.status(400).json({error : true, catch: error})
    )
});

router.post("/", function(req, res, next){
    let user = new User(req.body);
    user.save()
        .then(
          newUser => res.status(201).json(newUser),
          error => res.status(400).json({error : true, catch: error})
        )
})

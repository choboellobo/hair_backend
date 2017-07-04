let express = require('express');
let router = express.Router();
let Professional = require('../models/professional');
let crypter = require('../helpers/crypto');

module.exports = function (app) {
  app.use('/register', router);
};

router.get('/', function(req, res, next) {
  res.render('register/index', {professional: {}})
})

router.post('/', function(req, res, next){
  let professional = req.body;
      professional.birthday = new Date(req.body.birthday);
      professional.password = crypter.encrypt(req.body.password)
      if(req.body.gender == 'male') professional.avatar = '/img/avatar_man.png'
      else professional.avatar = '/img/avatar_woman.png'

      Professional.findOne({email: req.body.email})
                  .then(user => {
                    if(user) res.render('register/index', { professional: req.body, error : {message: "Ya esta registrado el correo "+ req.body.email}})
                    else {
                      let new_professional = new Professional(professional);
                      new_professional.save().then(
                        success => {
                          req.session.professional = success.id
                          res.render('register/end', {professional: success})
                        },
                        error => {
                          console.log(error)
                          res.render('register/index', {professional: req.body, error: error})
                        }
                      )
                    }
                  })
})

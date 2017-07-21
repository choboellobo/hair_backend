const  express = require('express');
let	router = express.Router();
const	Professional = require('../models/professional');
const crypter = require('../helpers/crypto');
const	jwt = require('../helpers/jwt');
const Mailer = require('../mailer/emails');

	module.exports = function (app) {
		app.use('/professional', router);
	};

/*
  POST
  UPDATE ANY FIELD OF PROFFESSIONAL.
*/
  router.post('/update', function(req, res, next){
    let p = req.session.professional
    Professional.update({_id: p}, {$set: req.body})
                .then(
                  response => res.redirect(`/${req.session.slug}`),
                  error => res.json(error)
                )
  })

  /*
    GET /LOGOUT
  */
  router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
      if(err) return next(err);
      res.redirect('/professional/login')
    })
  })
  /*
    GET /login
  */
  router.get('/login', function(req, res, next) {
    res.render('professional/login', {session: req.session})
  })
  /*
    POST /login
  */
  router.post('/login', function(req, res, next){
    Professional.findOne({email: req.body.email, password: crypter.encrypt(req.body.password)})
                .then(
                  professional => {
                    if(!professional) return res.render('professional/login', {error: true, session: req.session})
                    req.session.professional = professional._id
                    req.session.slug = professional.slug
                    res.redirect(`/${professional.slug}`);
                  },
                  error => {
                    res.render('professional/login', {error: true, session: req.session})
                  }
                )
  })

  /*
  POST
  /recovery_password
  */
  router.post('/recovery_password', function(req, res, next){
    Professional.findOne({email: req.body.email},{id: 1, email: 1})
                .then(
                  professional => {
                    if(professional){
                      Mailer.recovery_password(
                        professional.email,
                        '/professional/recovery_password/'+ crypter.encrypt(professional.id)
                      ).then(
                        success => res.render('professional/login', {session: req.session, recovery_password: true}),
                        error => res.json(error)
                      )
                    }else {
                      let err = new Error('No permitida esta petición');
                      err.status = 403;
                      next(err)
                    }
                  }
                )
  })
  /*
  GET
  /recovery_password/:hash
  */
  router.get('/recovery_password/:hash', function(req, res, next){
    res.render('professional/recovery_password', {session:req.session, hash: req.params.hash})
  })

  router.post('/recovery_password/:hash', function(req, res, next){
    let password = crypter.encrypt(req.body.password);
    let professional_id;
    try{
      professional_id = crypter.decrypt(req.params.hash)
    }catch(e) {
      return res.render('professional/recovery_password', {session: req.session, error: true})
    }
    console.log(professional_id)
    Professional.update({_id: professional_id}, {$set: {password: password}})
                .then(
                  response => {
                    res.render('professional/recovery_password', {session:req.session, update: true})
                  },
                  error => res.render('professional/recovery_password', {session: req.session, error: true})
                )
  })

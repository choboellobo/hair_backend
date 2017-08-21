const  express = require('express');
let	router = express.Router();
const	Professional = require('../models/professional');
const Subscription = require('../models/subscription');
const Service = require('../models/service');
const Invoice = require('../models/invoice');
const crypter = require('../helpers/crypto');
const	jwt = require('../helpers/jwt');
const Mailer = require('../mailer/emails');
const isLogIn = require('../helpers/islogin');

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
  /***************  LOGIN - LOGOUT ********************/
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
                    if(!professional) return res.render('professional/login', {error: 'Usuario o contraseña incorrectos', session: req.session})
                    if(professional.active == false) return res.render('professional/login', {error: 'Cuenta no activa, revise su correo para activar la cuenta', session: req.session})
                    req.session.professional = professional._id
                    req.session.slug = professional.slug
                    if(professional.payments) req.session.plan = professional.payments.plan;
                    res.redirect(`/${professional.slug}`);
                  },
                  error => {
                    res.render('professional/login', {error: 'Hubo un problema con el servidor, intentelo más tarde', session: req.session})
                  }
                )
  })
// ********************** RECOVERY PASSWORD *************************
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
    Professional.update({_id: professional_id}, {$set: {password: password}})
                .then(
                  response => {
                    res.render('professional/recovery_password', {session:req.session, update: true})
                  },
                  error => res.render('professional/recovery_password', {session: req.session, error: true})
                )
  })

// ******************** VALIDATE ACCOUNT ***************

router.get('/validate/:hash', function(req, res, next){
  let id;
  try {
    id = crypter.decrypt(req.params.hash)
  }catch(err){res.redirect('/professional/login')}
  Professional.update({_id:id}, {$set: {active: true}})
    .then(
      success => {
        Professional.findById(id).then(
          professional => {
            req.session.professional = professional._id
            req.session.slug = professional.slug
            res.render('professional/validate', {session: req.session, professional: professional})
          }
        )
      },
      error => res.redirect('/professional/login')
    )
})
/** SETTINGS **/
router.get('/settings', isLogIn, function(req, res, next){
  Subscription.find({professional: req.session.professional}).sort({created_at: -1}).populate('plan')
    .then(subscriptions => {
      if(subscriptions.length > 0){
        Professional.findById(req.session.professional, {payments: 1})
          .then(professional => {
            Invoice.find({customer_platform: professional.payments.customer_id})
              .then(invoices => {
                let sub_inv = []
                subscriptions = subscriptions.map(s => {
                  for(let i in invoices){
                    if(invoices[i].subscription_platform == s.platform_id) sub_inv.push(invoices[i])
                  }
                  s.invoices = sub_inv;
                  return s;
                })
                res.render('professional/settings', {subscriptions: subscriptions})
              })
          })
      }
    })
})
router.post('/settings/subscriptions', function(req, res, next){
  Subscription.cancelSubscription(req.body.id)
    .then(
      confirm => res.redirect('/professional/settings')
    )
})

const express = require('express');
const router = express.Router();
const env = require('../../env/env');
const stripe = require('stripe')(env.stripe_key);
const Invoice = require('../../models/invoice');
const Professional = require('../../models/professional');
const Subscription = require('../../models/subscription');

  module.exports = function (app) {
    app.use('/api/stripe', router);
  };

  /*
    POST /webhooks
    Mandatory event Object Stripe
  */
  router.post('/webhooks', function(req, res, next) {
    console.log(req.body.type)
    stripe.events.retrieve(req.body.id, function(err, event){
      if(err) return next() //return res.status(401).end()
      next()
    })
  }, function(req, res, next){
    // Stripe event Invoice
    if(req.body.type.includes('invoice.')){
      // Create or update Model Invoice
      Invoice.createOrUpdate(req.body)
        .then(invoice => res.json(invoice))
        .catch(error => res.json(error))
    }
    // Stripe event custormer.subscription
    if(req.body.type.includes('customer.subscription.')){
      // Update professional payments;
      let professionalPromise = Professional.updatePaymentsPlan(req.body)
      let subscriptionPromise = Subscription.updateStatus(req.body.data.object.id)
      Promise.all([professionalPromise, subscriptionPromise])
        .then(
          ([professional, subscription]) => res.status(200).end()
        )
        .catch(error => next(error))
    }
  })

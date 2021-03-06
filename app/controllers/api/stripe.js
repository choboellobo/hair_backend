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
  router.post('/webhooks', (req, res, next) => {
    stripe.events.retrieve(req.body.id, function(err, event){
      if(err) return res.status(401).end()
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
    else if(req.body.type.includes('customer.subscription.')){
      // Update professional payments;
      let professionalPromise = Professional.updatePaymentsPlan(req.body)
      let subscriptionPromise = Subscription.updateSubscription(req.body.data.object.id)
      Promise.all([professionalPromise, subscriptionPromise])
        .then(
          ([professional, subscription]) => res.status(200).end()
        )
        .catch(error => next(error))
    }else {
      res.status(200).end()
    }
  })

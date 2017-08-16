const express = require('express');
let router = express.Router();
const Plan = require('../models/plan');
const Professional = require('../models/professional')
const Subscription = require('../models/subscription')

module.exports = function (app) {
  app.use('/subscription', router);
};

/*
  List plans
*/
router.get('/', function(req, res, next){
  if(!req.session.professional) return res.redirect('/professional/login')

  let promisePlan = Plan.find({valid: true})
  let promiseSubscription = Subscription.find({professional: req.session.professional, status: 'active'})
  Promise.all([promisePlan, promiseSubscription])
  .then(
    ([plans,subscriptions]) =>{
      plans = plans.map(elem => {
        elem.formatPrice = formatPrice(elem.amount, elem.currency, elem.interval)
        return elem
      })
      res.render('subscription/plans', {plans: plans, subscriptions: subscriptions})
    }
  )
})
/*
  Render a form to put your credit card.
*/
router.get('/:id', function(req, res, next){
  Plan.findById(req.params.id)
      .then(
        plan => {
          plan.formatPrice = formatPrice(plan.amount, plan.currency, plan.interval)
          res.render('subscription/pay', {plan: plan})
        }
      )
})

/*
  Form to send to stripe token and user.
*/
router.post('/', function(req, res, next){
  // First we find a professional
  Professional.findById(req.session.professional)
              .then(
                professional => {
                  // If the professional has a stripe id
                  if(professional.payments.customer_id){
                    Professional.updatePaymentUser(professional.id, req.body.stripe_token)
                      .then( success => createSubscription(professional.payments.customer_id))
                      .catch( error => next(error))

                  }else {
                    // If not create a stripe id customer
                    let options = {
                      professional_email: professional.email,
                      professional_id : professional.id,
                      stripe_token: req.body.stripe_token
                    }
                    Professional.createStripeCustomer(options)
                      .then(customer_id => createSubscription(customer_id))
                      .catch(error => next(error))
                    }
                  })
  /*
    Method to create a Stripe subscription
    Mandartory: Stripe customer id
  */
  function createSubscription(customer_id) {
    let options = {
      user : {
        customer_id: customer_id,
        professional_id: req.session.professional
      },
      plan: req.body.plan_id
    }
    Subscription.createSubscription(options, function(error, subscription){
      if(error){
        next(error)
      }else {
        res.json(subscription)
      }

    })
  }
}, function(error, req,res, next){
  Plan.findById(req.body.plan_id)
      .then(
        plan => {
          plan.formatPrice = formatPrice(plan.amount, plan.currency, plan.interval)
          res.render('subscription/pay', {plan: plan, error: error})
        }
      )
})

function formatPrice (price, currency, interval) {
  if(currency === 'EUR') currency = '€'
  if( interval === 'month') interval = 'mes'
  if( interval === 'year') interval = 'año'
  price = parseFloat(price/100).toFixed(2)
  if( price%parseInt(price) == 0) price = parseInt(price)
  return `${price} ${currency} / ${interval}`
}

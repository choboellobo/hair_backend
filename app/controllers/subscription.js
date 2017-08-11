const express = require('express');
let router = express.Router();
const Plan = require('../models/plan');
const Professional = require('../models/professional')

module.exports = function (app) {
  app.use('/subscription', router);
};

router.get('/', function(req, res, next){
  if(!req.session.professional) return res.redirect('/professional/login')
  Plan.find({valid: true}).then(
    plans =>{
      plans = plans.map(elem => {
        elem.formatPrice = formatPrice(elem.amount, elem.currency, elem.interval)
        return elem
      })
        res.render('subscription/plans', {plans: plans})
    }
  )
})
router.get('/:id', function(req, res, next){
  Plan.findById(req.params.id)
      .then(
        plan => {
          plan.formatPrice = formatPrice(plan.amount, plan.currency, plan.interval)
          res.render('subscription/pay', {plan: plan})
        }
      )
})
router.post('/', function(req, res, next){

  Professional.findById(req.session.professional)
              .then(
                professional => {
                  if(professional.payments.customer_id){

                  }else {
                    let options = {
                      user : req.session.professional,
                      stripe_token: req.body.stripe_token
                    }
                    Professional.createStripeCustomer(options, function(err, data){
                      if(err) return res.json(err)
                      res.json(data)
                    })
                  }
                }
              )
})

function formatPrice (price, currency, interval) {
  if(currency === 'EUR') currency = '€'
  if( interval === 'month') interval = 'mes'
  price = parseFloat(price/100).toFixed(2)
  if( price%parseInt(price) == 0) price = parseInt(price)
  return `${price} ${currency} / ${interval}`

}

const express = require('express');
let router = express.Router();
const Plan = require('../models/plan');

module.exports = function (app) {
  app.use('/subscription', router);
};

router.get('/', function(req, res, next){
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

function formatPrice (price, currency, interval) {
  if(currency === 'EUR') currency = '€'
  if( interval === 'month') interval = 'mes'
  price = parseFloat(price/100).toFixed(2)
  if( price%parseInt(price) == 0) price = parseInt(price)
  return `${price} ${currency} / ${interval}`

}

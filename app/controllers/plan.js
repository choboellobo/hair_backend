const express = require('express');
let router = express.Router();
const Plan = require('../models/plan');

module.exports = function (app) {
  app.use('/plan', router);
};

router.get('/create', function(req, res, next){
  let new_plan = new Plan({
    type: 'plus',
    name: "Plan Mensual Plus",
    amount: 900,
  })
  new_plan.save().then(
    plan => res.json(plan),
    error => res.json(error)
  )
})

const express = require('express');
const router = express.Router();
const Plan = require('../models/plan');

module.exports = function (app) {
  app.use('/plan', router);
};

// router.get('/create', function(req, res, next){
//   let new_plan = new Plan({
//     type: 'plus',
//     name: "Plan Anual Plus",
//     amount: 9000,
//     interval: 'year',
//     currency: 'EUR'
//   })
//   new_plan.save().then(
//     plan => res.json(plan),
//     error => res.json(error)
//   )
// })

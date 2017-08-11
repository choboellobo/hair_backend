const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const env = require('../env/env');
const stripe = require('stripe')(env.stripe_key);

let PlanSchema = new Schema(
	{
    type: {type: String, required: true},
    name: {type: String, required: true},
    amount: {type: Number, required: true},
    interval: {type: String, required: true, default: 'month'},
    currency: {type: String, required: true},
    valid: {type: Boolean, default: false },
	},
	{
		timestamps: {
								createdAt: 'created_at',
								updatedAt: 'updated_at'
						}
	}
)
PlanSchema.pre('save', function(next){
  let plan = {
    id: this.id,
    amount: this.amount,
    currency: 'EUR',
    interval: this.interval,
    name: this.name
  }
  stripe.plans.create(plan, (err, stripe_plan) => {
      if(err) {
        next()
      }else {
        this.valid = true;
        next()
      }
  })
})

module.exports = mongoose.model('Plans', PlanSchema);

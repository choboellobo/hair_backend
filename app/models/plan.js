const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const env = require('../env/env');
const stripe = require('stripe')(env.stripe_key);

let PlanSchema = new Schema(
	{
    recommended: {type: Boolean, default: false},
    options: {type: String},
		type: {type: String, required: true},
		name: {type: String, required: true},
		amount: {type: Number, required: true},
		interval: {type: String, required: true, default: 'month'},
		currency: {type: String, required: true},
		valid: {type: Boolean, default: false },
	},
	{
		toObject: {
			virtuals: true
	},
		toJSON: {
			virtuals: true
	},
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
)

/*** VIRTUALS ***/
PlanSchema.virtual('price').get(function(){
  let price = parseFloat(this.amount/100).toFixed(2)
  if( price%parseInt(price) == 0) price = parseInt(price)
	return price;
})
PlanSchema.virtual('interval_format').get(function(){
  let currency, interval;
  if(this.currency === 'EUR') currency = '€'
  if( this.interval === 'month') interval = 'mes'
  if( this.interval === 'year') interval = 'año'
  return currency +"/"+ interval
})
/*
	After create a plan, we create a plan in stripe.
*/
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

module.exports = mongoose.model('Plan', PlanSchema);

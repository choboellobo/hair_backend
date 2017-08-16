const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const env = require('../env/env');
const stripe = require('stripe')(env.stripe_key);

let SubscriptionSchema = new Schema(
	{
    professional: {
      type: mongoose.Schema.Types.ObjectId,
  		ref: 'Professional',
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
  		ref: 'Plan',
    },
    status: {type: String, default: 'inactive'},
    cancel_at_period_end: {type: Boolean, default: false},
    current_period_end: {type: Number},
    platform_id: {type: String},
    platform_name: {type: String}
	},
	{
		timestamps: {
								createdAt: 'created_at',
								updatedAt: 'updated_at'
						}
	}
)

SubscriptionSchema.statics.createSubscription = function(options, cb){
  // Crear subscription
  // We need professional and plan
  stripe.subscriptions.create({
    customer: options.user.customer_id,
    plan: options.plan
  }, (err, subscription)=> {
      if(err) return cb(err)
      this.create({
        professional: options.user.professional_id,
        plan: options.plan,
        platform_id: subscription.id,
        current_period_end: subscription.current_period_end,
        platform_name: 'stripe'
      }, cb)
  })
}
SubscriptionSchema.statics.updateSubscription = function(id){
  return new Promise((resolve, reject) => {
    stripe.subscriptions.retrieve(id, (err, subscription) => {
      if(err) return reject(err)
      this.update(
          {platform_id: id},
          {$set: {status: subscription.status, current_period_end: subscription.current_period_end, cancel_at_period_end: subscription.cancel_at_period_end}})
          .then(resolve)
          .catch(reject)
    })
  })
}
SubscriptionSchema.statics.cancelSubscription = function(id){
  return new Promise((resolve, reject) => {
    stripe.subscriptions.del(id, {at_period_end: true}, (err, confirmation)=>{
      this.update({platform_id: id}, {$set: {cancel_at_period_end: true}})
        .then(resolve)
        .catch(reject)
    })
  })

}
module.exports = mongoose.model('Subscription', SubscriptionSchema);

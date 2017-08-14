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
    nextBill: {type: Date},
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
        platform_name: 'stripe'
      }, cb)
  })
}
SubscriptionSchema.statics.updateStatus = function(id){
  return new Promise((resolve, reject) => {
    stripe.subscriptions.retrieve(id, (err, subscription) => {
      if(err) return reject(err)
      this.update({platform_id: id},{$set: {status: subscription.status}})
          .then(resolve)
          .catch(reject)
    })
  })
}
module.exports = mongoose.model('Subscription', SubscriptionSchema);

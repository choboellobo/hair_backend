const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const env = require('../env/env');
const stripe = require('stripe')(env.stripe_key);
const Subscription = require('./subscription');
const moment = require('moment')

let InvoiceSchema = new Schema({
  platform_id: {type: String, required: true, unique: true},
  platform_name: {type: String},
  amount: {type: Number},
  subscription_platform: {type: String},
  customer_platform: {type: String},
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
    //required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    //required: true
  },
  period_start: {type: Number},
  period_end: {type: Number},
  next_payment: {type: Number},
  status: {type: String, default: 'created'}
}, {
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
})


/*** VIRTUALS ****/
InvoiceSchema.virtual('invoice_format').get(function(){
  let created = moment(this.createdAt).format('DD/MM/YYYY');
  let amount = parseFloat(this.amount / 100).toFixed(2).replace('.',',') + " €"
  return `La factura ${this.platform_id} fue creada el ${created}, por valor de ${amount}`
})
/*** STATICS *****/
InvoiceSchema.statics.createOrUpdate = function(event){

  return new Promise((resolve, reject)=> {
    let invoice_data = event.data.object;
    let invoice_detail = {
      platform_id: invoice_data.id,
      platform_name: 'stripe',
      amount: invoice_data.total,
      subscription_platform: invoice_data.subscription,
      customer_platform: invoice_data.customer,
      period_start: invoice_data.period_start,
      period_end: invoice_data.period_end,
      next_payment: invoice_data.next_payment_attempt,
      status: getStatus(event.type)
    }

    // Find an invoice by Id
    this.findOne({platform_id: invoice_data.id})
        .then(
          invoice => {
            // 1 ) If not exists, create a new invoice
            if(invoice == null) {
              this.create(invoice_detail)
                .then(resolve)
                .catch(reject)
            }else {
              // 2) If exists, update the invoice
              this.update({platform_id: invoice_data.id}, invoice_detail)
                .then(resolve)
                .catch(reject)
            }
            // Update subscription status
            Subscription.updateSubscription(invoice_data.subscription)
          }
        )
        .catch(reject)
  })
}
function getStatus(type){
  let status;
  if(type == 'invoice.payment_failed') status = 'failed'
  if(type == 'invoice.payment_succeeded') status = 'paid'
  if(type == 'invoice.created') status = 'created'
  return status;
}

module.exports = mongoose.model('Invoice', InvoiceSchema);

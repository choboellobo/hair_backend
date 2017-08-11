var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
const env = require('../env/env');
const stripe = require('stripe')(env.stripe_key);
mongoosePaginate.paginate.options = {
	lean: true,
	limit: 20,
	sort: {
		_id: -1
	}
};

var ProfessionalSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function (email) {
				var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
				return re.test(email);
			},
			message: 'Email incorrecto'
		}
	},
  schedules: {
    type: String
  },
  slug: {type: String},
  gender: {
    type: String,
    required: true,
		index: true
  },
  birthday: {
    type: Date,
    required: true
  },
	password: {
		type: String,
		required: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	avatar: {
		type: String,
		required: true
	},
	working_images: {
		type: Array
	},
	background: {
		type: JSON
	},
	document_id: {
		type: String
	},
	slug: {type: String},
	options: {
		store: {type: Boolean},
		home: {type: Boolean},
		payments: {
			card: {type: Boolean},
			cash: {type: Boolean, default: true}
		}
	},
	phone: {
		type: Number,
		required: true,
		validate: {
			validator: function (v) {
				return /^[9|6|7][0-9]{8}$/.test(v);
			},
			message: 'El numero de telefono no es correcto'
		}
	},
	services: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Services',
		required: true
	}],
	active: {
		type: Boolean,
		default: false
	},
	address: {
		coordinates: {
			lat: {type: Number},
			lng: {type: Number}
		},
		place: {
			type: String
		},
		location: {
			type: String
		},
		postal_code: {
			type: Number
		}
	},
	working_place: {
		type: Array
	},
	type: {
		type: String,
		default: 'professional'
	},
  payments: {
    account: {type: String},
    customer_id: {type: String}
  }
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
});
ProfessionalSchema.plugin(mongoosePaginate);
ProfessionalSchema.virtual('fullname')
.get(function () {
	return this.first_name + ' ' + this.last_name;
});
/* STATICS */
ProfessionalSchema.statics.createStripeCustomer = function(options, cb){
	// Create a customers into stripe
  stripe.customers.create({
    email: options.professional_email,
    description: "This user id is " + options.professional_id,
    source: options.stripe_token
  }, (err, customer) => {
      if(!err){
        this.update({_id: options.professional_id}, {$set: {payments: {account: 'stripe', customer_id: customer.id }}}, function(err, data){
					cb(err, customer.id);
				})
      }else {
        cb(err)
      }
  })
}
ProfessionalSchema.pre('save', function(next) {
  function removeAccents(s){
      var r=s.toLowerCase();
      r = r.replace(new RegExp(/\s/g),"");
      r = r.replace(new RegExp(/[àáâãäå]/g),"a");
      r = r.replace(new RegExp(/æ/g),"ae");
      r = r.replace(new RegExp(/ç/g),"c");
      r = r.replace(new RegExp(/[èéêë]/g),"e");
      r = r.replace(new RegExp(/[ìíîï]/g),"i");
      r = r.replace(new RegExp(/ñ/g),"n");
      r = r.replace(new RegExp(/[òóôõö]/g),"o");
      r = r.replace(new RegExp(/œ/g),"oe");
      r = r.replace(new RegExp(/[ùúûü]/g),"u");
      r = r.replace(new RegExp(/[ýÿ]/g),"y");
      r = r.replace(new RegExp(/\W/g),"");
      return r;
  };
  this.slug = removeAccents(this.first_name).replace(/ /g, "-").toLowerCase()+"-"+removeAccents(this.last_name).replace(/ /g, "-").toLowerCase()
  next()
});
module.exports = mongoose.model('Professional', ProfessionalSchema);

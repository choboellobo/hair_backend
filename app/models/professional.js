var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

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
  gender: {
    type: String
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
		type: String,
		required: true
	},
	avatar: {
		type: String,
		required: true
	},
	working_images: {
		type: Array
	},
	background: {
		type: String,
		required: true
	},
	document_id: {
		type: String,
		required: true,
		unique: true
	},
	slug: {type: String},
	options: {
		store: {type: Boolean},
		home: {type: Boolean},
		payments: {
			card: {type: Boolean},
			cash: {type: Boolean}
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
		price: Number,
		service: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Services',
			required: true
		}
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
module.exports = mongoose.model('Professional', ProfessionalSchema);

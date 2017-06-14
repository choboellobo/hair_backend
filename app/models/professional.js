var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	mongoosePaginate = require('mongoose-paginate');
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
	document_id: {
		type: String,
		required: true
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
	active: {
		type: Boolean,
		default: false
	},
	address: {
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
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});
ProfessionalSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Professional', ProfessionalSchema);

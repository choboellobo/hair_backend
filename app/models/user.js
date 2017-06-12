var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	mongoosePaginate = require('mongoose-paginate');
	mongoosePaginate.paginate.options = {
			lean : true,
			limit: 20,
			sort: { _id: -1 }
	};

var UserSchema = new Schema({
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
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
	password: {type: String, required: true},
	type: {type: String, default: 'user'},
	document_id: {type: String, required: true},
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
	}
},
{
  	timestamps: {
  		createdAt: 'created_at',
  		updatedAt: 'updated_at'
  	}
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);

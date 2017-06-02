var mongoose = require('mongoose'),
  	Schema = mongoose.Schema;

var ProfessionalSchema = new Schema({
  email: {type: String, required: true},
	password: {type: String, required: true},
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	document_id: {type: String, required: true},
	phone: {type: Number, required: true, validate: {
		validator: function(v){
			return /^[9|6|7][0-9]{8}$/.test(v);
		},
		message: "El numero de telefono no es correcto"
	}},
	active: {type: Boolean, default: false},
	address: {
		place: {type: String},
		location: {type: String},
		postal_code: {type: Number}
	},
  working_place: {type: Array}
});

module.exports = mongoose.model('Professional', ProfessionalSchema);

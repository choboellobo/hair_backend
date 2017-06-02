var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {type: String, required: true},
	password: {type: String, required: true},
  type: {type: String, default: "user"}
})

module.exports = mongoose.model('User', UserSchema);

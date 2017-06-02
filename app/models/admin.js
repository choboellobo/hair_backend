var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
	crypto = require("../helpers/crypto"),
	jwt = require("../helpers/jwt")

var AdminSchema = new Schema({
	email: {type: String, required: true},
	password: {type: String, required: true},
	level: {type: Number, required: true},
  type: {type: String, default: "admin"}
},{
	collection: "admin"
})

module.exports = mongoose.model('admin', AdminSchema);

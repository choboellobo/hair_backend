const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require("../helpers/crypto");
const jwt = require("../helpers/jwt");

let AdminSchema = new Schema({
	email: {type: String, required: true},
	password: {type: String, required: true},
	level: {type: Number, required: true},
	type: {type: String, default: "admin"}
},{
	collection: "admin",
	timestamps: {
						createdAt: 'created_at',
						updatedAt: 'updated_at'
				}
})

module.exports = mongoose.model('admin', AdminSchema);

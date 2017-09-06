const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ServicesSchema = new Schema({
	name: {type: String, required: true},
	image: {type: String, required: true},
  professions: {type: Array}
},
{
	timestamps: {
							createdAt: 'created_at',
							updatedAt: 'updated_at'
					}
})

module.exports = mongoose.model('Services', ServicesSchema);

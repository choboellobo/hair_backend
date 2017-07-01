var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ServicesSchema = new Schema({
	name: {type: String, required: true},
	image: {type: String, required: true}
},
{
	timestamps: {
							createdAt: 'created_at',
							updatedAt: 'updated_at'
					}
})

module.exports = mongoose.model('Services', ServicesSchema);

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ServicesSchema = new Schema({
	name: {type: String, required: true},
	price: {type: Number, required: true},
  coin: {type: String, default: "EUR"},
	iso3: {type: String, default: "€"},
	iva: {type: Number, default: 21}
},
{
  timestamps: {
              createdAt: 'created_at',
              updatedAt: 'updated_at'
          }
})

module.exports = mongoose.model('Services', ServicesSchema);

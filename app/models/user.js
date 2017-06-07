var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
  type: {type: String, default: "user"}
},
{
  timestamps: {
              createdAt: 'created_at',
              updatedAt: 'updated_at'
          }
})

module.exports = mongoose.model('User', UserSchema);

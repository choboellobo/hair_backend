var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  mongoosePaginate = require('mongoose-paginate');
  mongoosePaginate.paginate.options = {
      lean:  true,
      limit: 20,
      sort: { _id: -1 }
  };

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
UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);

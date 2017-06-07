var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  mongoosePaginate = require('mongoose-paginate');
  mongoosePaginate.paginate.options = {
      lean:  true,
      limit: 20,
      sort: { date: -1 }
  };
var AppointmentSchema = new Schema({
    user_id : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
		professional_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional'
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Services'
    },
    date: {type: Date, required: true},
    completed: {
      status: {type: Boolean, default: false},
      date: {type: Date}
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })
  AppointmentSchema.plugin(mongoosePaginate);
  /*
    Static method to know if an Appointment exists
  */
  AppointmentSchema.statics.exists = function(professional_id, date){
    return new Promise((resolve, reject)=> {
      this.find({professional_id: professional_id, date: date})
            .then( a => resolve(a) )
            .catch( error => reject(error) )
    })
  }

module.exports = mongoose.model('Appointment', AppointmentSchema);

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AppointmentSchema = new Schema({
    user_id : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
		professional_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })

module.exports = mongoose.model('Appointment', AppointmentSchema);

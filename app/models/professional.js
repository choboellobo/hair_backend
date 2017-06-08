var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  mongoosePaginate = require('mongoose-paginate');
  mongoosePaginate.paginate.options = {
      lean:  true,
      limit: 20,
      sort: { _id: -1 }
  };

var ProfessionalSchema = new Schema({
  avatar: {
    type: String,
    default: "http://i2.esmas.com/2013/03/15/492937/cosas-que-debe-tener-un-buen-estilista-300x380.jpg"
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  document_id: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return /^[9|6|7][0-9]{8}$/.test(v);
      },
      message: "El numero de telefono no es correcto"
    }
  },
  active: {
    type: Boolean,
    default: false
  },
  address: {
    place: {
      type: String
    },
    location: {
      type: String
    },
    postal_code: {
      type: Number
    }
  },
  working_place: {
    type: Array
  },
  type: {
    type: String,
    default: "professional"
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});
ProfessionalSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Professional', ProfessionalSchema);

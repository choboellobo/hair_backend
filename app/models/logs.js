const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Professional = require('./professional');

let LogsSchema = new Schema(
  {
    type: {type: String},
    who: {type: String},
    ip: {type: String}
  },
  {
    timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
  })
  /** STATIC **/

  LogsSchema.statics.visit = function(slug, ip){
    Professional.findOne({slug: slug})
      .then(
        professional => {
          let yesterday = new Date(new Date().getTime() - (1000*60*60*24))
          let tomorrow = new Date(new Date().getTime() + (1000*60*60*24))
          this.find({who: professional.id, ip: ip, created_at: {$gt: yesterday, $lt: tomorrow}})
          .then(logs => {
            if(logs.length == 0) {
              this.create({type: professional.type, who: professional.id, ip: ip })
                  .then(log => {
                    if( !professional.visits ) professional.visits = 1;
                    else professional.visits++
                    professional.save()
                  })
            }
          })
        })
  }
  module.exports = mongoose.model('Logs', LogsSchema);

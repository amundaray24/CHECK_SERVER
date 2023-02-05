import {Schema, model} from 'mongoose';

const schedulerSchema = new Schema({
  daysOfWeek: {
    type: [String],
    unique: true,
    required: [true, 'dayOfWeek field its mandatory'],
    enum: ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
  },
  entryHour: {
    type: String,
    required: [true, 'entryHour field its mandatory'],
    //match: [/[7-9]{1}:[0-5]{1}[0-9]{1}/gm, 'Please fill a valid Entry time between 07:00 and 09:59']
    match: [/[0-9]{2}:[0-5]{1}[0-9]{1}/gm, 'Please fill a valid Entry time between 00:00 and 23:59']
  },
  exitHour: {
    type: String,
    required: [true, 'exitHour field its mandatory'],
    //match: [/1[4-9]{1}:[0-5]{1}[0-9]{1}/gm, 'Please fill a valid Entry time between 14:00 and 19:00']
    match: [/[0-9]{2}:[0-5]{1}[0-9]{1}/gm, 'Please fill a valid Entry time between 00:00 and 23:59']
  }
});

schedulerSchema.methods.toJSON = function() {
  const { _id ,__v, ...rest} = this.toObject();
  return Object.assign({id: _id}, rest);
}


export default model('CHECK_SCHEDULER',schedulerSchema,'CHECK_SCHEDULER');



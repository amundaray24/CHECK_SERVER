import {Schema, model} from 'mongoose';

const holidaySchema = new Schema({
  date: {
    type: String,
    unique: true,
    required: [true, 'date field its mandatory']
  }
});

holidaySchema.methods.toJSON = function() {
  const { _id ,__v, ...rest} = this.toObject();
  return Object.assign(rest);
}

export default model('CHECK_HOLIDAYS',holidaySchema,'CHECK_HOLIDAYS');
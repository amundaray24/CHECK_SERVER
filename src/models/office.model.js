import {Schema, model} from 'mongoose';

const officeSchema = new Schema({
  date: {
    type: String,
    unique: true,
    required: [true, 'date field its mandatory']
  }
});

officeSchema.methods.toJSON = function() {
  const { _id ,__v, ...rest} = this.toObject();
  return Object.assign(rest);
}

export default model('CHECK_OFFICE_DAY',officeSchema,'CHECK_OFFICE_DAY');
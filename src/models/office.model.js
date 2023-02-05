import {Schema, model} from 'mongoose';

const officeSchema = new Schema({
  date: {
    type: String,
    unique: true,
    required: [true, 'date field its mandatory']
  }
});

export default model('CHECK_OFFICE_DAY',officeSchema,'CHECK_OFFICE_DAY');
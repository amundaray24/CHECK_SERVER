import {Schema, model} from 'mongoose';

const holidaySchema = new Schema({
  date: {
    type: String,
    unique: true,
    required: [true, 'date field its mandatory']
  }
});

export default model('CHECK_HOLIDAYS',holidaySchema,'CHECK_HOLIDAYS');
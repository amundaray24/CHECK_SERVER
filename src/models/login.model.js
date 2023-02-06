import {Schema, model} from 'mongoose';

const loginSchema = new Schema({
  user: {
    type: String,
    required: [true, 'user field its mandatory']
  },
  password: {
    type: String,
    required: [true, 'password field its mandatory']
  },
  attempts: {
    type: Number,
    required: [true, 'attempts field its mandatory']
  }
});

loginSchema.methods.toJSON = function() {
  const { _id ,__v, password, ...rest} = this.toObject();
  return Object.assign({id: _id}, rest);
}

export default model('CHECK_LOGIN_USER',loginSchema,'CHECK_LOGIN_USER');
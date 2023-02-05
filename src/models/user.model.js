import {Schema, model} from 'mongoose';

const userSchema = new Schema({
  user: {
    type: String,
    required: [true, 'user field its mandatory']
  },
  password: {
    type: String,
    required: [true, 'password field its mandatory']
  },
  url: {
    type: String,
    required: [true, 'url field its mandatory']
  }
});

userSchema.methods.toJSON = function() {
  const { _id ,__v, password, ...rest} = this.toObject();
  return Object.assign({id: _id}, rest);
}

export default model('CHECK_USER',userSchema,'CHECK_USER');
import {Schema, model} from 'mongoose';

const notificationSchema = new Schema({
  email: {
    type: String,
    required: [true, 'user field its mandatory']
  },
  password: {
    type: String,
    required: [true, 'password field its mandatory']
  },
  itsEnabled: {
    type: Boolean,
    default: true
  }
});

notificationSchema.methods.toJSON = function() {
  const { _id ,__v, password, ...rest} = this.toObject();
  return Object.assign({id: _id}, rest);
}

export default model('CHECK_NOTIFICATIONS',notificationSchema,'CHECK_NOTIFICATIONS');
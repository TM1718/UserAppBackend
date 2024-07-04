const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserRequest' }],
});

module.exports = mongoose.model('User', UserSchema);

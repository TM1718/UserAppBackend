const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String, // Changed to String type for phoneNumber
    required: true,
    unique: true, // Ensure uniqueness of phone number
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);

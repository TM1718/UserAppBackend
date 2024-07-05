const mongoose = require('mongoose');

const UserRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  goodsName: {
    type: String,
    required: true,
  },
  vehicleCount: {
    type: Number,
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  fromTime: {
    type: String,
    required: true,
  },
  toTime: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  fromPlace: {
    type: String,
    required: true,
  },
  toPlace: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('UserRequest', UserRequestSchema);

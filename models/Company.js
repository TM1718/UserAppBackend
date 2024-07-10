const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRequest',
  }],
});

module.exports = mongoose.model('Company', CompanySchema);

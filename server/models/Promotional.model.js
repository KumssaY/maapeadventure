const mongoose = require('mongoose');

const promotionalSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

const Promotional = mongoose.model('Promotional', promotionalSchema);
module.exports = { Promotional };

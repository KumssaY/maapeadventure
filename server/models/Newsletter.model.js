const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isSubscribed: { type: Boolean, default: true },
  unsubscribeToken: { type: String, unique: true },  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
module.exports = { Newsletter };

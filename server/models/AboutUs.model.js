const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AboutUs', aboutUsSchema);

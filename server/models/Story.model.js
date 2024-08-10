const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adventure: { type: mongoose.Schema.Types.ObjectId, ref: 'Adventure', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [String],
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Story', storySchema);

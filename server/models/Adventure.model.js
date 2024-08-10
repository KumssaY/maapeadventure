const mongoose = require('mongoose');

const adventureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: {
    duration: { type: String, required: true },
    startTime: { type: String, required: true },
    requiredItems: [String],
    providedItems: [String],
    pricing: {
      adults: { type: Number, required: true },
      children: { type: Number, required: true },
    },
    itinerary: [[String]],
    whyChooseThisAdventure: [String]
  },
  images: [String],
  activeOrInactiveAdventure: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Adventure', adventureSchema);

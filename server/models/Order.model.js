const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adventure: { type: mongoose.Schema.Types.ObjectId, ref: 'Adventure', required: true },
  date: { type: Date, required: true },
  adults: { type: Number, required: true },
  children: { type: Number, required: true },
  paymentDetails: {
    transactionId: { type: String, default: '' },
    amount: { type: Number, required: true }
  },
  status: { type: String, enum: ['pending', 'paid', 'initiated'], default: 'pending' },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

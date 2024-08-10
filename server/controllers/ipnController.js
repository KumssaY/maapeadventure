const { Order } = require('../models/Order.model');

exports.handleIPN = async (req, res) => {
  console.log('Received IPN:', req.body);
  const ipnData = req.body;

  const orderTrackingId = ipnData.order_tracking_id;
  const paymentStatus = ipnData.payment_status;

  try {
    const order = await Order.findOne({ 'paymentDetails.transactionId': orderTrackingId });
    if (order) {
      order.status = paymentStatus === 'COMPLETED' ? 'paid' : 'pending';
      await order.save();
      res.status(200).send('IPN Processed');
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    console.error('Error processing IPN:', error);
    res.status(500).send('Internal Server Error');
  }
};

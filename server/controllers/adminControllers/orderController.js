const Order = require('../../models/Order.model');
const { Adventure } = require('../../models/Adventure.model');

const handleError = (res, error, message) => {
  console.error(error);
  res.status(500).send({ message });
};

exports.getAllOrders = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const pastOrders = await Order.find({ date: { $lt: now } })
      .populate('user', 'username')
      .populate('adventure', 'title description details duration startTime requiredItems providedItems images');

    const presentOrders = await Order.find({ date: { $gte: now, $lt: startOfTomorrow } })
      .populate('user', 'username')
      .populate('adventure', 'title description details duration startTime requiredItems providedItems images');

    const futureOrders = await Order.find({ date: { $gte: startOfTomorrow } })
      .populate('user', 'username')
      .populate('adventure', 'title description details duration startTime requiredItems providedItems images');

    res.status(200).send({ pastOrders, presentOrders, futureOrders });
  } catch (error) {
    handleError(res, error, "Internal Server Error");
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username')
      .populate('adventure', 'title description details duration startTime requiredItems providedItems images');
    
    if (!order) {
      console.error(`Order with id ${req.params.id} not found`);
      return res.status(404).send({ message: "Order not found" });
    }

    res.status(200).send(order);
  } catch (error) {
    handleError(res, error, "Internal Server Error");
  }
};

exports.markOrderAsCompleted = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { isCompleted: true }, { new: true });
    if (!order) return res.status(404).send({ message: 'Order not found' });
    res.status(200).send({ message: 'Order marked as completed', order });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
};

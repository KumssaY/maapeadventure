const Adventure = require('../../models/Adventure.model');
const Order = require('../../models/Order.model');
const pesapal = require('../../utils/pesapal');
const mongoose = require('mongoose');
const config = require('../../config');
const { request } = require('express');


const exposedURL = config.exposedURL;

const ipnEndpointUrl = `${exposedURL}/api/ipn/endpoint`;

exports.getAllAdventures = async (req, res) => {
  try {
    const adventures = await Adventure.find({activeOrInactiveAdventure: true });
    res.status(200).send(adventures);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getAdventureById = async (req, res) => {
  try {
    console.log(req);
    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) return res.status(404).send({ message: "Adventure not found" });
    res.status(200).send(adventure);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    console.log("Received create order request:", req.body);
    const { adventure, date, adults, children, email, paymentType } = req.body;

    const adventureDetails = await Adventure.findById(adventure);
    if (!adventureDetails) {
      console.error('Adventure not found');
      return res.status(404).send({ message: 'Adventure not found' });
    }

    console.log('Fetched adventure details:', adventureDetails);

    const totalPrice = (adults * adventureDetails.details.pricing.adults) + (children * adventureDetails.details.pricing.children);

    const order = new Order({
      user: req.user._id,
      adventure: adventureDetails._id,
      date,
      adults,
      children,
      paymentDetails: {
        amount: totalPrice,
      },
      status: paymentType === 'payLater' ? 'pending' : 'initiated'
    });

    await order.save();
    console.log('Order saved:', order);

    if (paymentType === 'payLater') {
      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'username email')
        .populate('adventure');

      console.log('Populated order:', populatedOrder);
      return res.status(201).json(populatedOrder);
    } else {
      const token = await pesapal.authenticate();
      console.log('Pesapal token received:', token);

      const registerIPNResponse = await pesapal.registerIPNUrl(token, ipnEndpointUrl, 'GET');
      const ipnId = registerIPNResponse.ipn_id;

      const orderDetails = {
        id: order._id.toString(),
        currency: 'KES',
        amount: totalPrice,
        description: 'Adventure Order',
        callback_url: ipnEndpointUrl,
        notification_id: ipnId,
        billing_address: {
          email_address: email,
          first_name: req.user.username
        }
      };

      const pesapalOrder = await pesapal.submitOrderRequest(token, orderDetails);

      if (pesapalOrder.error) {
        console.error('Pesapal order submission error:', pesapalOrder.error);
        throw new Error(pesapalOrder.error.message);
      }

      order.paymentDetails.transactionId = pesapalOrder.order_tracking_id;
      await order.save();

      const populatedOrderWithTransaction = await Order.findById(order._id)
        .populate('user', 'username email')
        .populate('adventure');

      console.log('Final populated order with transaction:', populatedOrderWithTransaction);

      return res.status(201).json({
        order: populatedOrderWithTransaction,
        redirect_url: pesapalOrder.redirect_url
      });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    if (!res.headersSent) {
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  }
};

exports.createPayLaterOrder = async (req, res) => {
  try {
    console.log("Received create pay-later order request:", req.body);

    const { adventure, date, adults, children } = req.body;

    if (!adventure || !date || adults === undefined || children === undefined) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const adventureDetails = await Adventure.findById(adventure);
    if (!adventureDetails) {
      console.error('Adventure not found');
      return res.status(404).send({ message: 'Adventure not found' });
    }

    console.log('Fetched adventure details:', adventureDetails);

    const totalPrice = (adults * adventureDetails.details.pricing.adults) + (children * adventureDetails.details.pricing.children);

    const order = new Order({
      user: req.user._id,
      adventure: adventureDetails._id,
      date,
      adults,
      children,
      paymentDetails: {
        amount: totalPrice,
      },
      status: 'pending'
    });

    await order.save();
    console.log('Order saved:', order);

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'username email')
      .populate('adventure');

    console.log('Populated order:', populatedOrder);

    return res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating pay later order:', error);
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    console.log(req.user);
    const now = new Date();
    const pastOrders = await Order.find({ user: req.user._id, date: { $lt: now } })
      .populate('user', 'username email')
      .populate('adventure', 'title description details duration startTime requiredItems providedItems images');
      


    const futureOrders = await Order.find({ user: req.user._id, date: { $gte: now } })
      .populate('user', 'username email')
      .populate('adventure', 'title description details duration startTime requiredItems providedItems images');

    res.status(200).json({ pastOrders, futureOrders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('adventure', 'title');
    console.log(req.params.id);
    console.log(req.user._id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const checkPaymentStatus = async (orderId, orderTrackingId, token, retries = 10) => {
  try {
    const transactionStatus = await pesapal.getTransactionStatus(token, orderTrackingId);

    if (transactionStatus.status_code === 1) { 
      await Order.findByIdAndUpdate(orderId, { status: 'paid' });
    } else if (retries > 0) {
      setTimeout(() => {
        checkPaymentStatus(orderId, orderTrackingId, token, retries - 1);
      }, 60000); 
    } else {
      await Order.findByIdAndUpdate(orderId, { status: 'pending' });
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    if (retries > 0) {
      setTimeout(() => {
        checkPaymentStatus(orderId, orderTrackingId, token, retries - 1);
      }, 60000);
    }
  }
};

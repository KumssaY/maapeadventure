const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/auth');
const { getAllAdventures, getAdventureById, createOrder, createPayLaterOrder, getAllOrders, getOrderById} = require('../../controllers/clientControllers/adventureController');

router.get('/', getAllAdventures);
router.post('/order', authenticateToken, createOrder);
router.post('/order/pay-later', authenticateToken, createPayLaterOrder);
router.get('/orders', authenticateToken, getAllOrders);
router.get('/orders/:id', authenticateToken, getOrderById);
router.get('/:id', getAdventureById);

module.exports = router;

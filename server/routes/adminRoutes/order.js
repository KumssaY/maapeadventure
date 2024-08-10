const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');
const { getAllOrders, getOrderDetails, markOrderAsCompleted } = require('../../controllers/adminControllers/orderController');

router.get('/', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllOrders);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), getOrderDetails);
router.patch('/:id/complete', authenticateToken, authorizeRoles('admin', 'main-admin'), markOrderAsCompleted);


module.exports = router;

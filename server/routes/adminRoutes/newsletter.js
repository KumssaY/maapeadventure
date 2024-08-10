const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');
const { getAllSubscribers, sendPromotionalEmail } = require('../../controllers/adminControllers/newsletterController');

router.get('/', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllSubscribers);
router.post('/send', authenticateToken, authorizeRoles('admin', 'main-admin'), sendPromotionalEmail);

module.exports = router;

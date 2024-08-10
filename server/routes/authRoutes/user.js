const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/auth');
const { getUserProfile, updateUserProfile} = require('../../controllers/authControllers/userController');

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router;

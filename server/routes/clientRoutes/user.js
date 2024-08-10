const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/auth');
const { editUserProfile, deleteUserAccount } = require('../../controllers/clientControllers/userController');

router.put('/profile', authenticateToken, editUserProfile);
router.delete('/account', authenticateToken, deleteUserAccount);

module.exports = router;

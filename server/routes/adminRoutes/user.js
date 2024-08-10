const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');
const { getAllUsers, getUserDetails, promoteToAdmin, demoteFromAdmin} = require('../../controllers/adminControllers/userController');

router.get('/', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), getUserDetails);
router.patch('/promote/:id', authenticateToken, authorizeRoles('main-admin'), promoteToAdmin);
router.patch('/demote/:id', authenticateToken, authorizeRoles('main-admin'), demoteFromAdmin);

module.exports = router;

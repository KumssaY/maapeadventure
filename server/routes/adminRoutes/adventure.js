const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');
const { createAdventure, updateAdventure, setActiveStatus, getAllAdventures, getAdventureById} = require('../../controllers/adminControllers/adventureController');

router.post('/', authenticateToken, authorizeRoles('admin', 'main-admin'), createAdventure);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), updateAdventure);
router.get('/', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllAdventures);
router.patch('/:id/active-status', authenticateToken, authorizeRoles('admin', 'main-admin'), setActiveStatus);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), getAdventureById);

module.exports = router;

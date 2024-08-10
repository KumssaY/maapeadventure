const express = require('express');
const router = express.Router();
const {
  getAllStories,
  getStoryById,
  approveStory,
  unapproveStory
} = require('../../controllers/adminControllers/storyController');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');

router.get('/', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllStories);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), getStoryById);
router.patch('/approve/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), approveStory);
router.patch('/unapprove/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), unapproveStory);

module.exports = router;

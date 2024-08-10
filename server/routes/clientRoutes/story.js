const express = require('express');
const router = express.Router();
const {
  getAllApprovedStories,
  getAllUnapprovedStories,
  getStoryById,
  getUnapprovedStoryById,
  createStory,
  deleteStory,
  getApprovedStoryById,
  getAllUserApprovedStories
} = require('../../controllers/clientControllers/storyController');
const { authenticateToken } = require('../../middleware/auth');

router.get('/', getAllApprovedStories);

router.get('/unapproved', authenticateToken, getAllUnapprovedStories);
router.get('/unapproved/:id', authenticateToken, getUnapprovedStoryById);

router.get('/approved', authenticateToken, getAllUserApprovedStories);
router.get('/approved/:id', authenticateToken, getApprovedStoryById);


router.post('/', authenticateToken, createStory); 
router.delete('/:id', authenticateToken, deleteStory);

router.get('/:id', getStoryById);


module.exports = router;

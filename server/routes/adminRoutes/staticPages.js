const express = require('express');
const router = express.Router();
const {
  createAboutUs,
  getAllAboutUs,
  getAboutUsById,
  updateAboutUs,
  deleteAboutUs,
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
  createLegal,
  getAllLegals,
  getLegalById,
  updateLegal,
  deleteLegal,
  createMeetTheTeam,
  getAllMeetTheTeams,
  getMeetTheTeamById,
  updateMeetTheTeam,
  deleteMeetTheTeam,
  createSafetyPromise,
  getAllSafetyPromises,
  getSafetyPromiseById,
  updateSafetyPromise,
  deleteSafetyPromise
} = require('../../controllers/adminControllers/staticPagesControllers');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');

router.post('/about', authenticateToken, authorizeRoles('admin', 'main-admin'), createAboutUs);
router.get('/about', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllAboutUs);
router.get('/about/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), getAboutUsById);
router.put('/about/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), updateAboutUs);
router.delete('/about/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), deleteAboutUs);

router.post('/faq', authenticateToken, authorizeRoles('admin', 'main-admin'), createFAQ);
router.get('/faq', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllFAQs);
router.get('/faq/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), getFAQById);
router.put('/faq/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), updateFAQ);
router.delete('/faq/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), deleteFAQ);

router.post('/legal', authenticateToken, authorizeRoles('admin', 'main-admin'), createLegal);
router.get('/legal', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllLegals);
router.get('/legal/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), getLegalById);
router.put('/legal/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), updateLegal);
router.delete('/legal/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), deleteLegal);

router.post('/team', authenticateToken, authorizeRoles('admin', 'main-admin'), createMeetTheTeam);
router.get('/team', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllMeetTheTeams);
router.get('/team/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), getMeetTheTeamById);
router.put('/team/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), updateMeetTheTeam);
router.delete('/team/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), deleteMeetTheTeam);

router.post('/safety', authenticateToken, authorizeRoles('admin', 'main-admin'), createSafetyPromise);
router.get('/safety', authenticateToken, authorizeRoles('admin', 'main-admin'), getAllSafetyPromises);
router.get('/safety/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), getSafetyPromiseById);
router.put('/safety/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), updateSafetyPromise);
router.delete('/safety/:id', authenticateToken, authorizeRoles('admin', 'main-admin'), deleteSafetyPromise);

module.exports = router;

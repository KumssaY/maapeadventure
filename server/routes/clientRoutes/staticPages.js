const express = require('express');
const router = express.Router();
const {
  getAllAboutUs,
  getAboutUsById,
  getAllFAQs,
  getFAQById,
  getAllLegals,
  getLegalById,
  getAllMeetTheTeams,
  getMeetTheTeamById,
  getAllSafetyPromises,
  getSafetyPromiseById
} = require('../../controllers/adminControllers/staticPagesControllers');

router.get('/about', getAllAboutUs);
router.get('/about/:id', getAboutUsById);

router.get('/faq', getAllFAQs);
router.get('/faq/:id', getFAQById);

router.get('/legal', getAllLegals);
router.get('/legal/:id', getLegalById);

router.get('/team', getAllMeetTheTeams);
router.get('/team/:id', getMeetTheTeamById);

router.get('/safety', getAllSafetyPromises);
router.get('/safety/:id', getSafetyPromiseById);

module.exports = router;

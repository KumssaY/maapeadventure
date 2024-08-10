const AboutUs = require('../../models/AboutUs.model');
const FAQ = require('../../models/FAQ.model');
const Legal = require('../../models/Legal.model');
const MeetTheTeam = require('../../models/MeetTheTeam.model');
const SafetyPromise = require('../../models/SafetyPromise.model');

const createStaticPage = async (req, res, Model) => {
  try {
    const newPage = new Model(req.body);
    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllStaticPages = async (req, res, Model) => {
  try {
    const pages = await Model.find();
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStaticPageById = async (req, res, Model) => {
  try {
    const page = await Model.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStaticPage = async (req, res, Model) => {
  try {
    const page = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteStaticPage = async (req, res, Model) => {
  try {
    const page = await Model.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAboutUs: (req, res) => createStaticPage(req, res, AboutUs),
  getAllAboutUs: (req, res) => getAllStaticPages(req, res, AboutUs),
  getAboutUsById: (req, res) => getStaticPageById(req, res, AboutUs),
  updateAboutUs: (req, res) => updateStaticPage(req, res, AboutUs),
  deleteAboutUs: (req, res) => deleteStaticPage(req, res, AboutUs),

  createFAQ: (req, res) => createStaticPage(req, res, FAQ),
  getAllFAQs: (req, res) => getAllStaticPages(req, res, FAQ),
  getFAQById: (req, res) => getStaticPageById(req, res, FAQ),
  updateFAQ: (req, res) => updateStaticPage(req, res, FAQ),
  deleteFAQ: (req, res) => deleteStaticPage(req, res, FAQ),

  createLegal: (req, res) => createStaticPage(req, res, Legal),
  getAllLegals: (req, res) => getAllStaticPages(req, res, Legal),
  getLegalById: (req, res) => getStaticPageById(req, res, Legal),
  updateLegal: (req, res) => updateStaticPage(req, res, Legal),
  deleteLegal: (req, res) => deleteStaticPage(req, res, Legal),

  createMeetTheTeam: (req, res) => createStaticPage(req, res, MeetTheTeam),
  getAllMeetTheTeams: (req, res) => getAllStaticPages(req, res, MeetTheTeam),
  getMeetTheTeamById: (req, res) => getStaticPageById(req, res, MeetTheTeam),
  updateMeetTheTeam: (req, res) => updateStaticPage(req, res, MeetTheTeam),
  deleteMeetTheTeam: (req, res) => deleteStaticPage(req, res, MeetTheTeam),

  createSafetyPromise: (req, res) => createStaticPage(req, res, SafetyPromise),
  getAllSafetyPromises: (req, res) => getAllStaticPages(req, res, SafetyPromise),
  getSafetyPromiseById: (req, res) => getStaticPageById(req, res, SafetyPromise),
  updateSafetyPromise: (req, res) => updateStaticPage(req, res, SafetyPromise),
  deleteSafetyPromise: (req, res) => deleteStaticPage(req, res, SafetyPromise),
};

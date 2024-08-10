const express = require('express');
const router = express.Router();
const ipnController = require('../controllers/ipnController');

router.post('/endpoint', ipnController.handleIPN);

module.exports = router;

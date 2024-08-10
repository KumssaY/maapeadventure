const express = require('express');
const router = express.Router();
const { registerUser, verifyUser, loginUser,requestPasswordReset, resetPassword } = require('../../controllers/authControllers/authController');

router.post('/register', registerUser);
router.get('/verify/:id/:token', verifyUser);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;

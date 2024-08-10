const { User } = require('../../models/User.model');
const Token = require('../../models/Token.model');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sendEmail = require('../../utils/sendEmail');
const config = require('../../config');
const {generateAccessToken} = require('../../middleware/auth')

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send({ message: 'User not found' });

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, profilePicture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: "User not found" });

    if (email && email !== user.email) {
      user.verified = false;

      const token = generateAccessToken(user);  // Generate the access token
      const verificationUrl = `${config.frontendUrl}/verify-email/${user._id}/${token}`;
      
      await sendEmail(email, "Verify your new email", `
        Dear ${user.username},

        You have requested to change your email address. Please follow the link below to verify your new email:

        ${verificationUrl}

        Best regards,
        Your Application Team`);

      user.email = email;
    }

    user.username = username || user.username;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.status(200).send({ message: "Profile updated successfully. Please verify your new email address if it was changed." });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
};
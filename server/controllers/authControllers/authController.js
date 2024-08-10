const { User, validateUser, validateLogin } = require('../../models/User.model');
const Token = require('../../models/Token.model');
const { Newsletter } = require('../../models/Newsletter.model');
const crypto = require('crypto');
const sendEmail = require('../../utils/sendEmail');
const bcrypt = require('bcrypt');
const config = require('../../config');
const { generateAccessToken } = require('../../middleware/auth');

exports.registerUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(config.saltRounds));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({ ...req.body, password: hashPassword });
    await user.save();

    const token = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(token, Number(config.saltRounds));

    await new Token({ userId: user._id, token: hash }).save();

    const url = `${config.frontendUrl}/verification/${user._id}/${token}`;
    await sendEmail(user.email, "Email Account Verification To Sign into MaapeAdventures", `
      Dear ${user.username},

      Thank you for using our platform. To ensure the security of your account and maintain the integrity of our services, we require your cooperation in verifying your identity.

      Please follow the link below to complete the verification process:

      ${url}

      Best regards,
      MaapeAdventures`);

    res.status(201).send({ message: "An Email sent to your account please verify" });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      console.error('User not found');
      return res.status(400).send({ message: "Invalid link" });
    }

    const token = await Token.findOne({ userId: user._id });
    if (!token) {
      console.error('Token not found');
      return res.status(400).send({ message: "Invalid link" });
    }

    const isValid = await bcrypt.compare(req.params.token, token.token);
    if (!isValid) {
      console.error('Invalid token');
      return res.status(400).send({ message: "Invalid link" });
    }

    user.verified = true;
    await user.save();
    await Token.deleteOne({ _id: token._id });

    let newsletter = await Newsletter.findOne({ email: user.email });
    if (!newsletter) {
      newsletter = new Newsletter({ email: user.email, isSubscribed: true });
    } else {
      newsletter.isSubscribed = true;
    }
    await newsletter.save();

    res.status(200).send({ message: "Email verified successfully and subscribed to the newsletter" });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

    if (!user.verified) {
      await Token.deleteMany({ userId: user._id });

      const refreshToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(refreshToken, Number(config.saltRounds));

      await new Token({ userId: user._id, token: hash }).save();

      const url = `${config.frontendUrl}/verification/${user._id}/${refreshToken}`;
      await sendEmail(user.email, "Verify Email", `
        Dear ${user.username},

        Please verify your email by clicking the link below:

        ${url}

        Best regards,
        MaapeAdventures`);

      return res.status(400).send({ message: "An Email sent to your account please verify." });
    }

    const token = generateAccessToken(user);
    res.status(200).send({ token, message: "Logged in successfully" });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ message: "User with this email does not exist." });

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour expiration

    await user.save();

    const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    await sendEmail(user.email, "Password Reset Request", `
      Dear ${user.username},

      We received a request to reset your password. Click the link below to reset your password:

      ${resetUrl}

      If you did not request a password reset, please ignore this email.

      Best regards,
      MaapeAdventures`);

    res.status(200).send({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// controllers/authControllers/authControllers.js

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      passwordResetToken: req.body.token,
      passwordResetExpires: { $gt: Date.now() } // Check if the token is still valid
    });
    if (!user) return res.status(400).send({ message: "Invalid or expired token." });

    const salt = await bcrypt.genSalt(Number(config.saltRounds));
    user.password = await bcrypt.hash(req.body.password, salt);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();
    res.status(200).send({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

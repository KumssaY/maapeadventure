const { User } = require('../../models/User.model');
const bcrypt = require('bcrypt');


exports.editUserProfile = async (req, res) => {
  try {
    const { username, email, password, profilePicture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: "User not found" });

    if (email && email !== user.email) {
      user.verified = false;
      const token = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(token, Number(config.saltRounds));
      await new Token({ userId: user._id, token: hash }).save();

      const url = `${config.baseUrl}/api/auth/verify/${user._id}/${token}`;
      await sendEmail(email, "Verify Email", `
        Dear ${user.username},

        You have requested to change your email address. Please follow the link below to verify your new email:

        ${url}

        Best regards,
        MaapeAdventures`);

      user.email = email;
    }

    user.username = username || user.username;
    if (password) {
      const salt = await bcrypt.genSalt(Number(config.saltRounds));
      user.password = await bcrypt.hash(password, salt);
    }
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.status(200).send({ message: "Profile updated successfully. Please verify your new email address if it was changed." });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    if (req.body.prompt !== 'DELETE') {
      return res.status(400).send({ message: 'Invalid prompt. Please type "DELETE" to confirm account deletion.' });
    }

    await User.findByIdAndDelete(req.user._id);
    res.status(200).send({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

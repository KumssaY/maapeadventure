const { User } = require('../../models/User.model');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: 'User not found' });

    if (user.role === 'admin' || user.role === 'main-admin') {
      return res.status(400).send({ message: 'User is already an admin' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).send({ message: 'User promoted to admin' });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.demoteFromAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: 'User not found' });

    if (user.role !== 'admin') {
      return res.status(400).send({ message: 'User is not an admin' });
    }

    user.role = 'user';
    await user.save();

    res.status(200).send({ message: 'User demoted from admin' });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

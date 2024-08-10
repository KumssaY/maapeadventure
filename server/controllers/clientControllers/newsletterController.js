const { Newsletter } = require('../../models/Newsletter.model');


exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    let newsletter = await Newsletter.findOne({ email });
    if (!newsletter) {
      newsletter = new Newsletter({ email });
    } else {
      newsletter.isSubscribed = true;
    }
    await newsletter.save();
    res.status(200).send({ message: "Subscribed to the newsletter" });
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).send({ message: "Token is required" });
    }

    const newsletter = await Newsletter.findOne({ unsubscribeToken: token });
    if (!newsletter) {
      return res.status(404).send({ message: "Invalid token" });
    }

    newsletter.isSubscribed = false;
    await newsletter.save();
    res.status(200).send({ message: "Successfully unsubscribed from the newsletter." });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const { Newsletter } = require('../../models/Newsletter.model');
const { Promotional } = require('../../models/Promotional.model');
const sendEmail = require('../../utils/sendEmail');
const config = require('../../config');
const crypto = require('crypto');

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    res.status(200).send(subscribers);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.sendPromotionalEmail = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const subscribers = await Newsletter.find({ isSubscribed: true });

    const promotional = new Promotional({ subject, message });
    await promotional.save();

    const emailPromises = subscribers.map(async subscriber => {
      let unsubscribeToken = subscriber.unsubscribeToken;
      
      if (!unsubscribeToken) {
        unsubscribeToken = crypto.randomBytes(32).toString("hex");
        subscriber.unsubscribeToken = unsubscribeToken;
        await subscriber.save();
      }

      const unsubscribeLink = `${config.frontendUrl}/unsubscribe?token=${unsubscribeToken}`;

      const emailMessage = `
        ${message}
        <br><br>
        If you no longer wish to receive these emails, you can unsubscribe by clicking <a href="${unsubscribeLink}">here</a>.
      `;

      return sendEmail(subscriber.email, subject, emailMessage);
    });

    await Promise.all(emailPromises);

    res.status(200).send({ message: "Promotional emails sent successfully" });
  } catch (error) {
    console.error('Error sending promotional emails:', error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

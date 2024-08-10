const nodemailer = require('nodemailer');
const config = require('../config');

const sendEmail = async (email, subject, text, attachments) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

    await transporter.sendMail({
      from: config.emailUser,
      to: email,
      subject: subject,
      text: text,
      html: text,
      attachments: attachments,
      attachDataUrls: attachments,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.log('Email not sent');
    console.log(error);
    throw new Error('Email not sent');
  }
};

module.exports = sendEmail;

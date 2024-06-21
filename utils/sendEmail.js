require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: 'Vonture',
    to: options.to,
    subject: options.subject,
    text: options.text
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

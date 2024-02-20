require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {    
    user: process.env.USER_EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

async function sendEmail(email, code) {
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Recovery",
      text: `Here is the reset code requested: ${code}.`,
    });
}

module.exports = { sendEmail };
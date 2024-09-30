require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVICE,
  port: process.env.PORT_EMAIL,
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

async function sendSupportEmail(data){
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: process.env.USER_EMAIL,
    subject: data.subject,
    text: `id_user: ${data.id_user}, email: ${data.email}\ndescription: ${data.description}`,
  });
}

module.exports = { sendEmail, sendSupportEmail };
require('dotenv').config();
const nodemailer = require("nodemailer");
const fs = require('fs');

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

async function sendSupportEmail(data) {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: process.env.USER_EMAIL,
    subject: data.subject,
    text: `id_user: ${data.id_user}, email: ${data.email}\ndescription: ${data.description}`,
  };

  
  if (data.file) {
    mailOptions.attachments = [
      {
        path: data.file, 
      },
    ];
  }

 
  await transporter.sendMail(mailOptions);

  if (data.file) {
    fs.unlink(data.file, (err) => {
      if (err) {
        console.error('Erro ao apagar o arquivo:', err);
      } else {
        console.log('Arquivo apagado com sucesso:', data.file);
      }
    });
  }
}

async function sendAdminCredentialEmail(email, password, register){
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: 'Task Life Administrator Credentials',
    text: `Administrator register: ${register}, Email: ${email}, Password: ${password}`
  };

  await transporter.sendMail(mailOptions);
}


module.exports = { sendEmail, sendSupportEmail, sendAdminCredentialEmail };
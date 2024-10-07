require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.SMTP_FROM,
  to: 'pozdnyakov151994@gmail.com',
  subject: 'Тестовое письмо',
  text: 'Это тестовое письмо отправлено через Brevo SMTP',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Ошибка при отправке письма:', error);
  }
  console.log('Письмо успешно отправлено:', info.response);
});

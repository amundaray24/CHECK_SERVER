const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.FICHAJE_NOTIFICATION_EMAIL || 'email@prueba.com',
    pass: process.env.FICHAJE_NOTIFICATION_PASSWORD || 'password',
  },
});

if (process.env.FICHAJE_NOTIFICATION_ENABLED === 'true' && process.env.FICHAJE_NOTIFICATION_VERIFY === 'true') {
  transporter.verify()
  .then(() => {
    console.log('---- EMAIL VERIFY OK ----');
  })
  .catch(console.error);
}

module.exports = {
  transporter
}
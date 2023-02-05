import nodemailer from 'nodemailer';

export const getEmailClient = (email, password) => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: email || 'email@prueba.com',
      pass: password || 'password'
    }
  });
}
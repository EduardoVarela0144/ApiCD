const nodemailer = require('nodemailer');
const fs = require('fs'); 

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD,
  },
});

let emailHTML; 

fs.readFile('./src/api/email/Email.html', 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo HTML:', err);
    throw err; 
  }
  
  emailHTML = data;
});

exports.sendEmail = (req, res) => {
  const { recipients, subject, date, time } = req.body;

  if (!recipients || !subject || !date || !time) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  const recipientList = Array.isArray(recipients) ? recipients : [recipients];

  const emailPromises = [];

  recipientList.forEach((to) => {

    const emailHTMLWithDateAndTime = emailHTML
      .replace('[Fecha]', date)
      .replace('[Hora]', time);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: emailHTMLWithDateAndTime,
    };

    const emailPromise = new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          reject(error);
        } else {
          console.log('Correo enviado con exito:', info.response);
          resolve(info.response);
        }
      });
    });

    emailPromises.push(emailPromise);
  });

  Promise.all(emailPromises)
    .then(() => {
      return res.json({ success: true });
    })
    .catch((error) => {
      return res.status(500).json({ error: 'Error al enviar el correo' });
    });
};

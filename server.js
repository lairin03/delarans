const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('./'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post('/send-email', async (req, res) => {
  const { user_name, user_email, user_phone, message } = req.body;

  if (!user_name || !user_email || !user_phone || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'Delaranslairin9@gmail.com',
      subject: `Nuevo mensaje de ${user_name} desde NovaTech`,
      html: `
        <h2>Nuevo contacto desde la web</h2>
        <p><strong>Nombre:</strong> ${user_name}</p>
        <p><strong>Correo:</strong> ${user_email}</p>
        <p><strong>Teléfono:</strong> ${user_phone}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    res.json({ success: true, message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar:', error);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en puerto 3000');
  console.log('Visita: http://localhost:3000');
});

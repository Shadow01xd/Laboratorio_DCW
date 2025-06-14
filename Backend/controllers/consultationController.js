const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verificar conexión al servidor de correo
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error al conectar con el servidor de correo:', error.message);
  } else {
    console.log('✅ Servidor de correo listo para enviar mensajes');
  }
});

const enviarConsulta = async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body;

  if (![nombre, email, telefono, mensaje].every(Boolean)) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const templatePath = path.join(__dirname, '..', 'templates', 'consultationEmail.html');
    let emailHtml = await fs.readFile(templatePath, 'utf8');

    // Reemplazar marcadores
    emailHtml = emailHtml
      .replace('{{nombre}}', nombre)
      .replace('{{email}}', email)
      .replace('{{telefono}}', telefono)
      .replace('{{mensaje}}', mensaje);

    const mailOptions = {
      from: `"${nombre}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nueva consulta de ${nombre}`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Consulta enviada correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar la consulta:', error.message);
    res.status(500).json({
      message: 'Error al enviar la consulta',
      error: error.message
    });
  }
};

module.exports = {
  enviarConsulta
};

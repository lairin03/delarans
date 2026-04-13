// Script de prueba para EmailJS
// Abre la consola del navegador (F12) y pega este código para probar

const templateParams = {
  to_email: 'delarans03@outlook.com',
  user_name: 'Prueba',
  user_email: 'test@example.com',
  user_phone: '+123456789',
  message: 'Este es un mensaje de prueba desde la consola'
};

emailjs.send('service_hxxzkql', 'template_3cwa03p', templateParams)
  .then(response => {
    console.log('✅ Email enviado exitosamente:', response);
  })
  .catch(error => {
    console.error('❌ Error al enviar email:', error);
  });
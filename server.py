from flask import Flask, jsonify, request
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

EMAIL_USER = os.getenv('EMAIL_USER', '')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')
RECIPIENT = 'Delaranslairin9@gmail.com'

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    user_name = data.get('user_name', '')
    user_email = data.get('user_email', '')
    user_phone = data.get('user_phone', '')
    message = data.get('message', '')

    if not all([user_name, user_email, user_phone, message]):
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Nuevo mensaje de {user_name} desde NovaTech'
        msg['From'] = EMAIL_USER
        msg['To'] = RECIPIENT

        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Nuevo contacto desde la web</h2>
                <p><strong>Nombre:</strong> {user_name}</p>
                <p><strong>Correo:</strong> {user_email}</p>
                <p><strong>Teléfono:</strong> {user_phone}</p>
                <p><strong>Mensaje:</strong></p>
                <p>{message.replace(chr(10), '<br>')}</p>
            </body>
        </html>
        """

        part = MIMEText(html, 'html')
        msg.attach(part)

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)

        return jsonify({'success': True, 'message': 'Correo enviado exitosamente'})
    except Exception as e:
        print(f'Error al enviar: {str(e)}')
        return jsonify({'error': f'Error al enviar el correo: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)

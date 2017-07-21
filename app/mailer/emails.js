const nodemailer = require('nodemailer');
const env = require('../env/env');
class Mails {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: env.email.user, // Your email id
          pass: env.email.password // Your password
      }
    });
  }

  recovery_password(to, url) {
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'choboellobo84@gmail.com', // sender address
        to: to, // list of receivers
        subject: 'Puedes modificar tu contraseña aquí', // Subject line
        text: 'Este email no soporta texto plano, visualiza este email con un programa de correo', // plain text body
        html: `
            <h3>Modifica tu contraseña aquí</h3>
            <p>Este email te  ha llegado porque nos has pedido modificar tu contraseña porque no la recuerdas o porque quieres cambiarla, pulsa en el enlace de abajo y podras cambiar tu contraseña</p>
            <a href="${env.host + url}"> ${env.host + url}</a>
            <p>
              <small>Todos los derechos reservados<small>
            </p>
        ` // html body
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
          if (error) return reject(error)
          resolve(info)
      });
    })
  }
}

module.exports = new Mails();

const nodemailer = require('nodemailer');
const env = require('../env/env');
const EmailTemplate = require('email-templates').EmailTemplate
const path = require('path')

class Mails {
  constructor() {
    this.transporter = nodemailer.createTransport({
        host: 'smtp.urbhair.com',
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: env.email.user,
          pass: env.email.password
        },
        tls: {
          rejectUnauthorized: false
      }
    });
  }
  validate_account(to, url) {
    let mailOptions = {
        from: '"UrbHair" <app@urbhair.com>', // sender address
        to: to, // list of receivers
        subject: 'Valida tu cuenta', // Subject line
        text: 'Este email no soporta texto plano, visualiza este email con un programa de correo', // plain text body
        html: null
    };
    return this.getTemplate('validate_account', { url: env.host + url })
        .then(
          email => {
            mailOptions.html = email.html;
            return this.send_email(mailOptions);
          }
        )
  }
  recovery_password(to, url) {
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"UrbHair" <app@urbhair.com>', // sender address
        to: to, // list of receivers
        subject: 'Puedes modificar tu contraseña aquí', // Subject line
        text: 'Este email no soporta texto plano, visualiza este email con un programa de correo', // plain text body
        html: null
    };
    return this.getTemplate('recovery_password', {url: env.host + url })
                .then(
                  email => {
                    mailOptions.html = email.html
                    return this.send_email(mailOptions);
                  }
                )
  }
  send_email(mailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
          if (error) return reject(error)
          resolve(info)
      });
    })
  }
  getTemplate(template, data) {
    var templateDir = path.join(__dirname, '../emailtemplate', template)
    var newsletter = new EmailTemplate(templateDir)
    return new Promise((resolve, reject) => {
      newsletter.render(data, function(err, result){
        if(err) reject(err)
        else resolve(result)
      })
    })
  }
}

module.exports = new Mails();

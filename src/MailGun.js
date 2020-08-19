const nodemailer = require('nodemailer');

module.exports = class MailGun{
  static async fire(mail, message, attachments){
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: mail,
      subject: 'Message from test task - Niko',
      html: `<p>${message}</p>`,
      attachments
    };

    await transporter.sendMail(mailOptions, function (err, info) {
      err ? console.log(err) : console.log(info);
    });
  }
}

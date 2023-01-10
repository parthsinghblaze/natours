const nodemailer = require('nodemailer');

exports.sendEmail = async options => {
//  1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })

//  2) Define the email options
  const mailOptions = {
    from: 'parth singh <parth@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message
  }

//  3) Actually sending the email
  await transporter.sendMail(mailOptions)
}


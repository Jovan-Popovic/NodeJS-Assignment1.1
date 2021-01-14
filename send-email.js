const nodemailer = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require("dotenv").config();

const sendEmail = (email, filename) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADDRESS,
      pass: process.env.PASS,
    },
  });

  let mailOptions = {
    from: process.env.ADDRESS,
    to: email,
    subject: "WordToPdf Converter",
    text:
      "Dear user, than you for using this feature, enjoy your pdf file down bellow.",
    attachments: {
      path: `downloads/${filename}.pdf`,
    },
  };
  console.log(email, filename);
  transporter.sendMail(mailOptions, (error, info) =>
    error
      ? console.log("Sending failed: ", error)
      : console.log("Email sent: ", info)
  );
};

module.exports = sendEmail;

/* const { SMTPClient } = require("emailjs");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require("dotenv").config();

const sendEmail = () => {
  const client = new SMTPClient({
    host: "smtp.gmail.com",
    ssl: true,
    user: process.env.ADDRESS,
    password: process.env.PASSWORD,
  });

  client.send(
    {
      from: process.env.ADDRESS,
      to: "jovan.popovics1a@gmail.com",
      subject: "My Email-Js",
      text: "i hope this works",
    },
    (err, message) => {
      console.log(err || message);
    }
  );
};

sendEmail();
module.exports = sendEmail;
 */

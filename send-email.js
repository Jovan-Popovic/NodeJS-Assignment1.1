const nodemailer = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require("dotenv").config();

const sendEmail = () => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADDRESS,
      pass: process.env.PASS,
    },
  });

  let mailOptions = {
    from: process.env.ADDRESS,
    to: "jovan.popovics1a@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was NOT easy!",
  };

  transporter.sendMail(mailOptions, (error, info) =>
    error
      ? console.log("Lol nope: ", error)
      : console.log("Email sent: " + info)
  );
};
sendEmail();
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

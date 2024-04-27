const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.openjavascript.info",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
    const info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: `<h1>"hello world"</h1>`,
    });
    console.log("sent");
  } catch (error) {
    console.log(error);
  }
  console.log("message Sent: " + info.messageId);
};

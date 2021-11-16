const mongoose = require("mongoose");
const Logs = require("./schemas/logSchema");
const nodemailer = require("nodemailer");
const parking = require("./failureQueue");

mongoose.connect("mongodb://localhost:27017/newsletter");

async function main(results, dataBaseData) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "your email id", // generated ethereal user
      pass: "your password", // generated ethereal password
    },
  });

  // send mail with defined transport object

  transporter.sendMail(
    {
      from: '"Rameez" <rameeson@gmail.com>', // sender address
      to: results[results.length - 1].email, // list of receivers
      subject: results[results.length - 1].name, // Subject line
      text: `Hello ${dataBaseData}, ${results[results.length - 1].content} `, // plain text body
    },
    function (error, info) {
      if (error) {
        console.log(error);
        parking(results, dataBaseData);
      } else {
        const dateData = new Date();

        const logg = new Logs({
          data: dateData,
          email: results[results.length - 1].email,
          newsletter: results[results.length - 1].name,
        });
        logg
          .save()
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
        console.log(info);
      }
    }
  );
}

module.exports = main;

const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Person = require("./schemas/personSchema");
const csv = require("csv-parser");
const fs = require("fs");
const results = [];
let dataBaseData = "";
const fileUpload = require("express-fileUpload");
const sendToQueue = require("./sendQueue");

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/newsletter");

app.set("view engine", "ejs");
app.get("/",(req,res)=>{
  res.render("home")
})
app.get("/adduser", (req, res) => {
  res.render("adduser");
});
app.post("/adduser", (req, res) => {
  const person = new Person({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    age: req.body.age,
  });
  person
    .save()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/adduser");
});
app.get("/newsletter", (req, res) => {
  res.render("newsletter");
});
app.post("/newsletter", (req, res) => {
  let fileData = req.files.data;
  let dataname = fileData.name.toString();

  fileData.mv(`${__dirname}/${req.files.data.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    fs.createReadStream(dataname)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log(results);
        let queueResult = sendToQueue(results);
        console.log(queueResult);
  });

  res.redirect("/newsletter");
});
});

app.listen(3000, () => {
  console.log("Connected to the port 3000");
});



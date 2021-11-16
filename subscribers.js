const main = require("./mailSetup");
const mongoose = require("mongoose");
const Person = require("./schemas/personSchema");

mongoose.connect("mongodb://localhost:27017/newsletter");
let dataBaseData=""

let subscriber = (results) => {
  const amqp = require("amqplib/callback_api");
  amqp.connect(`amqp://localhost`, (err, connection) => {
    if (err) {
      throw err;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }
      let queueName = "technical";
      channel.assertQueue(queueName, {
        durable: false,
      });
      channel.consume(queueName, (msg) => {
        console.log(`Recieve:${(msg.content.toString())}`);
        let newData=JSON.parse(msg.content.toString()) 
        console.log(newData)
        Person.findOne(
          { email: results[results.length - 1].email },
          (err, data) => {
            if (!err) {
              dataBaseData = `${data.fname} ${data.lname}`;
            } else {
              console.log("Not Found");
            }
            main(newData, dataBaseData);
        channel.ack(msg);
          }
          
        );
        
      });
    });
  });

  
};
module.exports = subscriber;

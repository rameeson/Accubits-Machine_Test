let sendToQueue = (results) => {
  const amqp = require("amqplib/callback_api");
  const subscriber = require("./subscribers");

  amqp.connect(`amqp://localhost`, (err, connection) => {
    if (err) {
      throw err;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }
      console.log("result",results)
      
      let queueName = "technical";
      let message = JSON.stringify(results);
      channel.sendToQueue(queueName, Buffer.from(message));
      console.log(`Message: ${message}`);
      setTimeout(() => {
        connection.close();
      }, 1000);
    });
  });
  subscriber(results);
};
module.exports = sendToQueue;

let parking = (results, dataBaseData) => {
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
      // let mailer=results.email.toString()
      let queueName = "parking-lot-queue";
      let message = results[results.length - 1].content;
      channel.sendToQueue(queueName, Buffer.from(message));
      console.log(`Message: ${message}`);
      setTimeout(() => {
        connection.close();
      }, 1000);
    });
  });
  subscriber(results, dataBaseData);
};
module.exports = parking;

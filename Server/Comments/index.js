var amqp = require('amqplib/callback_api');
var repostitory = require("./repository").repostitory();


let queue = process.env.RABBITMQ_QUEUE || 'stop';



amqp.connect(process.env.RABBITMQ_URL,  function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(process.env.COMMENTS_QUEUE, {
      durable: true
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", process.env.COMMENTS_QUEUE);
    channel.consume(process.env.COMMENTS_QUEUE, async function (msg) {
      console.log(" [x] Received %s", JSON.parse(msg.content.toString()));
      let id
      let data = JSON.parse(msg.content.toString());
      switch(msg.properties.headers.type) {
        case "create":
          await repostitory.create(data);
          channel.sendToQueue(msg.properties.replyTo,
            Buffer.from('true'), {
            correlationId: msg.properties.correlationId
          });
          channel.ack(msg);
          break;
        case "delete":
          console.log("Delete: " + JSON.stringify(data))
          await repostitory.delete(data);
          channel.sendToQueue(msg.properties.replyTo,
            Buffer.from('true'), {
            correlationId: msg.properties.correlationId
          });
          channel.ack(msg);
          break;
        case "get_by_post":
           id = msg.content.toString()
          let commetns = await repostitory.get_all_by_post_id(id)
          channel.sendToQueue(msg.properties.replyTo,
            Buffer.from(JSON.stringify(commetns).toString()), {
            correlationId: msg.properties.correlationId
          });
          channel.ack(msg);
          break;
        case "delete_by_post":
           id =  data.id
           console.log(`Удаляем по комменарии посту ${id}`)
           await repostitory.delete_by_post(id)
      }
    }, {
      noAck: false
    });
  });
});
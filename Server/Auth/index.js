var amqp = require('amqplib/callback_api');
var get_service = require("./get_services/get_services_auth");

amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = process.env.RABBITMQ_QUEUE || 'stop';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log('Сервис Auth запущен');
    channel.consume(queue, async function reply(msg) {
      var n = parseInt(msg.content.toString());
      var content = msg.content.toString();
      if (msg.properties.headers.sender == "gatewayapi") {
        switch (msg.properties.headers.type) {
          case "check":
            let check = get_service.check_token(content);
            channel.sendToQueue(msg.properties.replyTo,
              Buffer.from(check.toString()), {
              correlationId: msg.properties.correlationId
            });
            channel.ack(msg);
            break;
          case "sign_up_default":
            let sign_up = "null"
            await  get_service.sign_up_default(content).then((res) => {
              sign_up = res
            }).catch((err) => {
              console.log(err)
            });
            channel.sendToQueue(msg.properties.replyTo,
              Buffer.from(sign_up.toString()), {
              correlationId: msg.properties.correlationId
            });
            channel.ack(msg);
            break;
          case "sign_in_default":
            let sign_in = await get_service.sign_in_default(content)
            channel.sendToQueue(msg.properties.replyTo,
              Buffer.from(JSON.stringify(sign_in).toString()), {
              correlationId: msg.properties.correlationId
            });
            channel.ack(msg);
            break;
        }
      }
    });
  });
});
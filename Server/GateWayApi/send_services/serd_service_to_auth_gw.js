
var amqp = require('amqplib/callback_api');

exports.check_token = (token) => {
  return new Promise((resolve, reject) => {
    amqp.connect(process.env.RABBITMQ_URL, function(error0, connection) {
      if (error0) {
        return reject(error0); // Отклоняем промис при ошибке подключения
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          return reject(error1); // Отклоняем промис при ошибке создания канала
        }
        channel.assertQueue('', { exclusive: true }, function(error2, q) {
          if (error2) {
            return reject(error2); // Отклоняем промис при ошибке создания очереди
          }
          const correlationId = generateUuid();

          channel.consume(q.queue, function(msg) {
            if (msg.properties.correlationId === correlationId) {
              console.log(' [.] Got %s', msg.content.toString());
              resolve(msg.content.toString()); // Разрешаем промис с полученным сообщением
              setTimeout(function() {
                connection.close();
              
              }, 500);
            }
          }, { noAck: false });

          channel.sendToQueue(process.env.AUTH_QUEUE,
            Buffer.from(token.toString()), {
              correlationId: correlationId,
              replyTo: q.queue,
              headers: {
                sender: "gatewayapi",
                type: "check"
              }
            });
        });
      });
    });
  });
};

exports.sign_up_default = (user) => {
  return new Promise((resolve, reject) => {
    amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
      if (error0) {
        return reject(error0); // Отклоняем промис в случае ошибки подключения
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          return reject(error1); // Отклоняем промис в случае ошибки создания канала
        }
        channel.assertQueue('', { exclusive: true }, (error2, q) => {
          if (error2) {
            return reject(error2); // Отклоняем промис в случае ошибки создания очереди
          }
          const correlationId = generateUuid();

          channel.consume(q.queue, (msg) => {
            if (msg.properties.correlationId === correlationId) {
              console.log(' [.] Got %s', msg.content.toString());
              resolve(msg.content.toString()); // Разрешаем промис с результатом
              setTimeout(() => {
                connection.close(); // Закрываем соединение после задержки
              }, 500);
            }
          }, { noAck: false });
          console.log("Taken user: " + JSON.stringify(user));
          channel.sendToQueue(process.env.AUTH_QUEUE,
            Buffer.from(JSON.stringify(user).toString()), {
              correlationId: correlationId,
              replyTo: q.queue,
              headers: {
                sender: "gatewayapi",
                type: "sign_up_default"
              }
            });
        });
      });
    });
  });
};

exports.sign_in_default = (body) => {
  return new Promise((resolve, reject) => {
      amqp.connect(process.env.RABBITMQ_URL, function(error0, connection) {
          if (error0) {
              return reject(error0); // Отклоняем промис в случае ошибки
          }
          connection.createChannel(function(error1, channel) {
              if (error1) {
                  return reject(error1); // Отклоняем промис в случае ошибки
              }
              channel.assertQueue('', { exclusive: true }, function(error2, q) {
                  if (error2) {
                      return reject(error2); // Отклоняем промис в случае ошибки
                  }
                  var correlationId = generateUuid();

                  channel.consume(q.queue, function(msg) {
                      if (msg.properties.correlationId === correlationId) {
                          console.log(' [.] Got %s', msg.content.toString());
                          resolve(msg.content.toString()); // Разрешаем промис с результатом
                          setTimeout(function() {
                              connection.close();
                          }, 500);
                      }
                  }, { noAck: false });

                  channel.sendToQueue(process.env.AUTH_QUEUE,
                      Buffer.from(JSON.stringify(body)), {
                          correlationId: correlationId,
                          replyTo: q.queue,
                          headers: {
                              sender: "gatewayapi",
                              type: "sign_in_default"
                          }
                      });
              });
          });
      });
  });
}

function generateUuid() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }
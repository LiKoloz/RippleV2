var amqp = require('amqplib/callback_api');

exports.create_comment = (comment) => {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
            if (error0) {
                return reject(error0); // Отклоняем промис при ошибке подключения
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    return reject(error1); // Отклоняем промис при ошибке создания канала
                }
                channel.assertQueue('', { exclusive: true }, function (error2, q) {
                    if (error2) {
                        return reject(error2); // Отклоняем промис при ошибке создания очереди
                    }
                    const correlationId = generateUuid();

                    channel.consume(q.queue, function (msg) {
                        if (msg.properties.correlationId === correlationId) {
                            console.log(' [.] Got %s', msg.content.toString() + " YYRRR");
                            resolve(); // Разрешаем промис с полученным сообщением
                            setTimeout(function () {
                                connection.close();
                                
                            }, 500);
                        }
                    }, { noAck: false });
                    comment = JSON.stringify(comment);
                    console.log("commet " + comment)
                    channel.sendToQueue(process.env.COMMENTS_QUEUE,
                        Buffer.from(comment.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "create"
                        }
                    });
                });
            });
        });
    });
};

exports.delete_comment = (comment) => {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
            if (error0) {
                return reject(error0); // Отклоняем промис при ошибке подключения
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    return reject(error1); // Отклоняем промис при ошибке создания канала
                }
                channel.assertQueue('', { exclusive: true }, function (error2, q) {
                    if (error2) {
                        return reject(error2); // Отклоняем промис при ошибке создания очереди
                    }
                    const correlationId = generateUuid();

                    channel.consume(q.queue, function (msg) {
                        if (msg.properties.correlationId === correlationId) {
                            console.log(' [.] Got %s', msg.content.toString());
                            resolve(msg.content.toString()); // Разрешаем промис с полученным сообщением
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, { noAck: false });
                    channel.sendToQueue(process.env.COMMENTS_QUEUE,
                        Buffer.from(comment.id.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            type: "delete"
                        }
                    });
                });
            });
        });
    });
};

function generateUuid() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}
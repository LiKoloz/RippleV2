
var amqp = require('amqplib/callback_api');

exports.get_user_by_email = (user) => {
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
                    user = JSON.stringify(user);
                    channel.sendToQueue(process.env.USERS_QUEUE,
                        Buffer.from(user.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "get_by_email"
                        }
                    });
                });
            });
        });
    });
};

exports.get_user_by_id = (id) => {
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
                    channel.sendToQueue(process.env.USERS_QUEUE,
                        Buffer.from(JSON.stringify({id: id}).toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "get_by_id"
                        }
                    });
                });
            });
        });
    });
};

exports.get_user_rating_history = (id) => {
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
                    channel.sendToQueue(process.env.USERS_QUEUE,
                        Buffer.from(id.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "get_user_rating_history"
                        }
                    });
                });
            });
        });
    });
};

exports.create_user = (user) => {
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
                    console.log("user + ",user)
                    user = JSON.stringify(user);
                    channel.sendToQueue(process.env.USERS_QUEUE,
                        Buffer.from(user.toString()), {
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

exports.delete_user = (user) => {
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
                    user = JSON.stringify(user);
                    channel.sendToQueue(process.env.USERS_QUEUE,
                        Buffer.from(user.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "delete"
                        }
                    });
                });
            });
        });
    });
};

exports.update_user = (user) => {
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
                    user = JSON.stringify(user);
                    channel.sendToQueue(process.env.USERS_QUEUE,
                        Buffer.from(user.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "update"
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
var amqp = require('amqplib/callback_api');

exports.send_to_delete_comments = async (id) => {
    amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = process.env.COMMENTS_QUEUE || 'stop';
            channel.assertQueue(queue, {
                durable: true           
            });

            channel.sendToQueue(queue, Buffer.from(id.toString()), {
                headers:{
                    sender: "posts",
                    type: "delete"
                },
                persistent: true
            });
        });
    });
}

exports.send_to_delete_rating = async (user_id, post_id, type_of_item, rating_value) => {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
            if (error0) {
                console.error("Error connecting to RabbitMQ for rating update:", error0.message);
                return reject(error0);
            }

            connection.createChannel(function (error1, channel) {
                if (error1) {
                    console.error("Error creating channel for rating update:", error1.message);
                    connection.close();
                    return reject(error1);
                }

                // Очередь, куда отправляем запрос (предполагаем, что это users_queue)
                var queue = process.env.USERS_QUEUE || 'users_queue'; 

                channel.assertQueue(queue, {
                    durable: true
                });
 
                let messagePayload = {
                    user_id: user_id,
                    id: post_id,        // ID элемента (поста, комментария и т.д.)
                    type: type_of_item, // Например, "comment", "post", "like"
                    rating: rating_value // Значение изменения рейтинга (-1 для удаления, +1 для добавления)
                };

                channel.sendToQueue(queue, Buffer.from(JSON.stringify(messagePayload)), {
                    headers: {
                        sender: "posts",
                        // >>> Изменено на "delete_rating" <<<
                        type: "delete_rating" 
                    },
                    persistent: true
                });
                console.log(`[x] Sent delete_rating message to ${queue} for user ${user_id}. Change: ${rating_value}`);

                setTimeout(() => {
                    if (channel) channel.close();
                    if (connection) connection.close();
                    resolve({ status: "Message sent" });
                }, 100); 
            });
        });
    });
};
exports.send_to_add_rating = async (user_id, post_id, type_of_item, rating_value) => {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
            if (error0) {
                console.error("Error connecting to RabbitMQ for rating update:", error0.message);
                return reject(error0);
            }

            connection.createChannel(function (error1, channel) {
                if (error1) {
                    console.error("Error creating channel for rating update:", error1.message);
                    connection.close();
                    return reject(error1);
                }

                // Очередь, куда отправляем запрос (предполагаем, что это users_queue)
                var queue = process.env.USERS_QUEUE || 'users_queue'; 

                channel.assertQueue(queue, {
                    durable: true
                });
 
                let messagePayload = {
                    user_id: user_id,
                    id: post_id,        // ID элемента (поста, комментария и т.д.)
                    type: type_of_item, // Например, "comment", "post", "like"
                    rating: rating_value // Значение изменения рейтинга (-1 для удаления, +1 для добавления)
                };

                channel.sendToQueue(queue, Buffer.from(JSON.stringify(messagePayload)), {
                    headers: {
                        sender: "posts",
                        // >>> Изменено на "delete_rating" <<<
                        type: "add_rating" 
                    },
                    persistent: true
                });
                console.log(`[x] Sent delete_rating message to ${queue} for user ${user_id}. Change: ${rating_value}`);

                setTimeout(() => {
                    if (channel) channel.close();
                    if (connection) connection.close();
                    resolve({ status: "Message sent" });
                }, 100); 
            });
        });
    });
};

// Функция для генерации уникального ID
function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
}
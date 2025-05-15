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

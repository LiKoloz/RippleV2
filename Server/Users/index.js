var amqp = require('amqplib/callback_api');
var repository = require("./repository").repository();

let queue = process.env.RABBITMQ_QUEUE || 'stop';
amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    var data
    connection.createChannel(function (error1, channel) {
        let user
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queue, {
            durable: true
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, async function (msg) {
            console.log(" [x] Received %s", JSON.parse(msg.content.toString()));
                    console.log(msg.properties.headers.type)
                    switch (msg.properties.headers.type) {
                        case "get_by_email":
                            console.log(msg.content.toString())
                            let content = JSON.parse(msg.content.toString());
                            console.log(msg.content.toString())
                            user = await repository.get_by_email(content);
                            user = user == null ? "" : JSON.stringify(user).toString()
                            channel.sendToQueue(msg.properties.replyTo,
                                Buffer.from(user), {
                                correlationId: msg.properties.correlationId
                            });
                            channel.ack(msg);
                            break;
                        case "get_by_id":
                            console.log(msg.content.toString())
                            let content1 = JSON.parse(msg.content.toString()).id;
                            console.log('idDDD: + ' + content1)
                            console.log(msg.content.toString())
                            user = await repository.get_by_id(content1);
                            user = JSON.stringify(user).toString()
                            console.log('user: ' + user)
                            channel.sendToQueue(msg.properties.replyTo,
                                Buffer.from(user), {
                                correlationId: msg.properties.correlationId
                            });
                            channel.ack(msg);
                            break;
                        case "create":
                            user = JSON.parse(msg.content);
                            let result = false
                            console.log(user.nick_name + "JOPA")
                            await repository.create(user).then(() => result = true);
                            console.log("res + ",result)
                            channel.sendToQueue(msg.properties.replyTo,
                                Buffer.from(result.toString()), {
                                correlationId: msg.properties.correlationId
                            });
                            channel.ack(msg);
                            break;
                        case "update":
                            user = JSON.parse(msg.content.toString());
                            await repository.update(user);
                            channel.sendToQueue(msg.properties.replyTo,
                                Buffer.from("true"), {
                                correlationId: msg.properties.correlationId
                            });
                            channel.ack(msg);
                            break;
                        case "delete":
                            user = JSON.parse(msg.content.toString());
                            await repository.delete(user);
                            channel.sendToQueue(msg.properties.replyTo,
                                Buffer.from("true"), {
                                correlationId: msg.properties.correlationId
                            });
                            channel.ack(msg);
                            break;
                        case "get_by_ids":
                            console.log("get_by_ids")
                            let ids = JSON.parse(msg.content).ids.toString().split(',') 
                            console.log(`IDS: ${ids}`)
                            let authors = []
                            for(let i = 0; i < ids.length; i++){
                                let author = await repository.get_by_id(ids[i])
                                authors.push(author)
                            }
                            console.log(`Отправили: ${JSON.stringify(authors).toString()}`)
                            channel.sendToQueue(msg.properties.replyTo,
                                Buffer.from(JSON.stringify(authors).toString()), {
                                correlationId: msg.properties.correlationId
                            });
                            channel.ack(msg);
                            break;
                        case "add_rating":
                            console.log("add_rating")
                            data = JSON.parse(msg.content.toString())
                            console.log(data)
                            await repository.add_rating(data.user_id, data.rating)
                            await repository.add_rating_history(data.user_id, data.id, data.type, data.rating)
                            channel.ack(msg);
                            break;
                        case "delete_rating":
                            console.log("delete_rating")
                            data = JSON.parse(msg.content.toString())
                            console.log(data)
                            await repository.decrease_rating(data.user_id, data.rating)
                            await repository.add_rating_history(data.user_id, data.id, data.type, data.rating)
                            channel.ack(msg);
                            break;
                        case "get_user_rating_history":
                            console.log("get_user_rating_history")
                            data = (msg.content.toString())
                            console.log(data)
                            let history = await repository.get_user_rating_history(data)
                            console.log(history)
                            channel.sendToQueue(msg.properties.replyTo,
                                Buffer.from(JSON.stringify(history).toString()), {
                                correlationId: msg.properties.correlationId
                            });
                            channel.ack(msg);
                            break;
                    }
        }, {
            noAck: false
        });
    
    });
});

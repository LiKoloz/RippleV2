
var amqp = require('amqplib/callback_api');

exports.get_post_by_id = async (id) => {
    let post = () => new Promise((resolve, reject) => {
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
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(id.toString()), {
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
    post = await post()
    post = JSON.parse(post)
    console.log("Get post:" + JSON.stringify(post).toString())
    let comments = (id) => new Promise((resolve, reject) => {
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
                        Buffer.from(id.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "get_by_post"
                        }
                    });
                });
            });
        });
    });
    comments = await comments(post.id)
    console.log(`Get comments: ${comments}`)
    comments = JSON.parse(comments)

    let authors_ids = []

    if (comments != []) {
        for (let i = 0; i < comments.length; i++) {
            authors_ids.push(comments[i].author_id)
        }


        let get_authors = () => new Promise((resolve, reject) => {
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
                                console.log(' [.] Got %s', msg.content);
                                resolve(msg.content.toString())
                                setTimeout(function () {
                                    connection.close();
                                }, 500);
                            }
                        }, { noAck: false });
                        channel.sendToQueue(process.env.USERS_QUEUE,
                            Buffer.from(JSON.stringify({ ids: authors_ids }).toString()), {
                            correlationId: correlationId,
                            replyTo: q.queue,
                            headers: {
                                sender: "gatewayapi",
                                type: "get_by_ids"
                            }
                        });
                    });
                });
            });
        });
        get_authors = await get_authors()
        console.log(`Get authors ${get_authors}`)
        get_authors = JSON.parse(get_authors)

        for (let i = 0; i < comments.length; i++) {
            let author = get_authors.find(a => a.id == comments[i].author_id)
            comments[i].user = author
        }
        post.comments = comments
        console.log(`Get2 post: ${JSON.stringify(post)}`)
    };
    post.comments_count = comments.length
    return post
}

exports.create_post = (post) => {
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
                    post = JSON.stringify(post);
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(post.toString()), {
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

exports.delete_post = (post) => {
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
                    post = JSON.stringify(post);
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(post.toString()), {
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

exports.update_post = (user) => {
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
                    channel.sendToQueue(process.env.POSTS_QUEUE,
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
exports.get_all_post = () => {
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
                            console.log(' [.] Got %s', msg.content);
                            resolve(msg.content.toString()); // Разрешаем промис с полученным сообщением
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, { noAck: false });
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from("none"), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "get_all"
                        }
                    });
                });
            });
        });
    });
};

exports.get_all_pagination_post = async (page) => {
    let get_all_pagination = await new Promise((resolve, reject) => {
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
                            console.log(' [.] Got %s', msg.content);
                            resolve(msg.content.toString())
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, { noAck: false });
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(JSON.stringify(page).toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "get_all_pagination"
                        }
                    });
                });
            });
        });
    });

    get_all_pagination = JSON.parse(get_all_pagination)
    console.log(JSON.parse(JSON.stringify(get_all_pagination.posts).toString()))
    console.log(get_all_pagination.posts != "")
    let authors_ids = []

    console.log(`Length: ${get_all_pagination.posts.length}`)
    let posts = get_all_pagination.posts
    if (posts != "") {
        for (let i = 0; i < posts.length; i++) {
            authors_ids.push(posts[i].author_id)
        }


        let get_authors = await new Promise((resolve, reject) => {
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
                                console.log(' [.] Got %s', msg.content);
                                resolve(msg.content.toString())
                                setTimeout(function () {
                                    connection.close();
                                }, 500);
                            }
                        }, { noAck: false });
                        channel.sendToQueue(process.env.USERS_QUEUE,
                            Buffer.from(JSON.stringify({ ids: authors_ids }).toString()), {
                            correlationId: correlationId,
                            replyTo: q.queue,
                            headers: {
                                sender: "gatewayapi",
                                type: "get_by_ids"
                            }
                        });
                    });
                });
            });
        });
        get_authors = JSON.parse(get_authors)

        for (let i = 0; i < get_all_pagination.posts.length; i++) {
            let author = get_authors.find(user => user.id == get_all_pagination.posts[i].author_id)
            get_all_pagination.posts[i].author = "@" + author.nick_name
        }
    }
    console.log(JSON.stringify(get_all_pagination) + "RESSS")
    console.log("AUTHORS  " + authors_ids)
    return get_all_pagination
};

exports.get_all_pagination_post_non_checked = async (page) => {
    page = { ...page, checked: false }
    let get_all_pagination = await this.get_all_pagination_post(page)
    get_all_pagination.posts = get_all_pagination.posts.filter(post => post.checked == false);
    console.log(`GEGEEGEGE ${get_all_pagination}`)
    return get_all_pagination
};

exports.get_all_pagination_post_checked = async (page) => {
    page = { ...page, checked: true }
    let get_all_pagination = await this.get_all_pagination_post(page)
    get_all_pagination.posts = get_all_pagination.posts.filter(post => post.checked == true);
    console.log(`GEGEEGEGE ${get_all_pagination}`)
    return get_all_pagination
};




exports.add_or_delete_like = (data) => {
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
                            console.log(' [.] Got %s', msg.content);
                            resolve(msg.content.toString()); // Разрешаем промис с полученным сообщением
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, { noAck: false });
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(JSON.stringify(data).toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "add_or_delete_like"
                        }
                    });
                    console.log(`data ${JSON.stringify(data)}`)
                    channel.sendToQueue(process.env.USERS_QUEUE,
                        Buffer.from(JSON.stringify(data).toString()), {
                        headers: {
                            sender: "gatewayapi",
                            type: "add_or_delete_rating"
                        }
                    });
                });
            });
        });
    });
}

exports.reject_all_posts = () => {
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
                            console.log(' [.] Got %s', msg.content);
                            resolve(msg.content.toString()); // Разрешаем промис с полученным сообщением
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, { noAck: false });
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(""), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "reject_all_posts"
                        }
                    });
                });
            });
        });
    });
}

exports.accept_all_posts = () => {
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
                            console.log(' [.] Got %s', msg.content);
                            resolve(msg.content.toString()); // Разрешаем промис с полученным сообщением
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, { noAck: false });
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(""), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "accept_all_posts"
                        }
                    });
                });
            });
        });
    });
}
exports.reject_post = (id) => {
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
                            console.log(' [.] Got %s', msg.content);
                            let post_bad = JSON.parse(msg.content)
                            channel.sendToQueue(process.env.USERS_QUEUE,
                                Buffer.from(JSON.stringify({user_id: post_bad.author_id, id:id, type: post_bad.bad_words == true? 'reject post with bad content' : 'reject post', rating: post_bad.bad_words == true? -10 : -5 }).toString()), {
                                headers: {
                                    sender: "gatewayapi",
                                    type: "delete_rating"
                                }
                            });
                            resolve("true"); // Разрешаем промис с полученным сообщением
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, { noAck: false });
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(id.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "reject_post"
                        }
                    });
                });
            });
        });
    });
}
exports.accept_post = (id) => {
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
                            console.log(' [.] Got %s', msg.content);
                            resolve(msg.content.toString()); // Разрешаем промис с полученным сообщением
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, { noAck: false });
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(id.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "accept_post"
                        }
                    });
                });
            });
        });
    });
}

exports.post_like = (data) => {
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
                            console.log(' [.] Got %s', msg.content);
                            resolve(msg.content.toString()); // Разрешаем промис с полученным сообщением
                            setTimeout(function () {
                                connection.close();
                            }, 500);
                        }
                    }, { noAck: false });
                    channel.sendToQueue(process.env.POSTS_QUEUE,
                        Buffer.from(JSON.stringify(data).toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue,
                        headers: {
                            sender: "gatewayapi",
                            type: "post_like"
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
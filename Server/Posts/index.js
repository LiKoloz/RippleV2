var amqp = require('amqplib/callback_api');
var repository = require("./repository").repository();
var post_send_service = require("./send_services/post_send_service")
let queue = process.env.RABBITMQ_QUEUE || 'stop';

const bad_words_regex = /(?<![а-яё])(?:(?:(?:у|[нз]а|(?:хитро|не)?вз?[ыьъ]|с[ьъ]|(?:и|ра)[зс]ъ?|(?:о[тб]|п[оа]д)[ьъ]?|(?:\S(?=[а-яё]))+?[оаеи-])-?)?(?:[её](?:б(?!о[рй]|рач)|п[уа](?:ц|тс))|и[пб][ае][тцд][ьъ]).*?|(?:(?:н[иеа]|(?:ра|и)[зс]|[зд]?[ао](?:т|дн[оа])?|с(?:м[еи])?|а[пб]ч|в[ъы]?|пр[еи])-?)?ху(?:[яйиеёю]|л+и(?!ган)).*?|бл(?:[эя]|еа?)(?:[дт][ьъ]?)?|\S*?(?:п(?:[иеё]зд|ид[аое]?р|ед(?:р(?!о)|[аое]р|ик)|охую)|бля(?:[дбц]|тс)|[ое]ху[яйиеё]|хуйн).*?|(?:о[тб]?|про|на|вы)?м(?:анд(?:[ауеыи](?:л(?:и[сзщ])?[ауеиы])?|ой|[ао]в.*?|юк(?:ов|[ауи])?|е[нт]ь|ища)|уд(?:[яаиое].+?|е?н(?:[ьюия]|ей))|[ао]л[ао]ф[ьъ](?:[яиюе]|[еёо]й))|елд[ауые].*?|ля[тд]ь|(?:[нз]а|по)х)(?![а-яё])/ui
amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queue, {
            durable: true
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, async function (msg) {
            var posts
            var id
            var post
            if (msg != null) {
                console.log(" [x] Received %s", msg.content.toString());
                switch (msg.properties.headers.sender) {
                    case "gatewayapi":
                        console.log("From gateway api");
                        switch (msg.properties.headers.type) {
                            case "get_all_pagination":
                                console.log("get_all_pagination");
                                posts = await repository.get_all();
                                let page = parseInt(JSON.parse(msg.content).page)
                                let user_id = JSON.parse(msg.content).user_id
                                page--
                                posts = posts.reverse()
                                let checked = JSON.parse(msg.content).checked
                                console.log(`checked: ${checked}`)
                                if (posts.length != 0) {
                                    if (checked) {
                                        posts = posts.filter(p => p.checked == true)
                                    }
                                    else {
                                        posts = posts.filter(p => p.checked == false)
                                    }
                                }
                                let max_page = posts.length % 5 == 0 || posts.length==0? Math.floor(posts.length/5) :Math.floor(posts.length/5) + 1 
                                posts = posts.slice(page*5,page*5+5)
                                console.log("Постов " +posts.length );
                                console.log(max_page + "max+page")
                                if (posts.length == 0) {
                                    posts = {posts: ""}
                                }
                                else {
                                    posts = {posts: posts}
                                    if (max_page != 0){
                                        posts = {...posts, max_page: max_page}
                                    }
                                    console.log("Posts: ++" + posts)
                                }
                                posts.posts = JSON.parse(JSON.stringify(posts.posts))
                                for (let i = 0; i < posts.posts.length; i++) {
                                    console.log("uer_id: " + user_id)
                                    if ( isNaN(user_id)) {
                                        posts.posts[i]['is_liked'] = false
                                    }
                                    else {
                                        let check_like = await repository.get_like(user_id, posts.posts[i].id)
                                        console.log("likes123 ", check_like)
                                        console.log(`Like: auhtor: ${1} post : ${posts.posts[i].id} \n Result: ${check_like}`)
                                        if (check_like != null) {
                                            console.log("lucky")
                                            posts.posts[i]['is_liked'] = true
                                        }
                                        else {
                                            console.log('unlucky')
                                            posts.posts[i]['is_liked'] = false
                                        }
                                    }
                                }
                                
                                posts = JSON.stringify(posts).toString()
                                console.log(`Отправляем: ${posts}`)
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from(posts), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "get_all":
                                console.log("get_all");
                                    posts = await repository.get_all();
                                console.log("Постов " +posts.length );
                                if (posts.length == 0) {
                                    posts = ""
                                }
                                else {
                                    posts = JSON.stringify(posts).toString()
                                }
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from(posts), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "get_all_by_author_id":
                                let author_id = JSON.parse(msg.content.toString()).author_id;
                                let posts_by_author_id = await repository.get_all_by_author_id(author_id);
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from(JSON.stringify(posts_by_author_id).toString()), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "get_by_id":
                                console.log(`Id: ${msg.content.toString()}`)
                                id = JSON.parse(msg.content.toString());
                                post = await repository.get_by_id(id);
                                console.log(`Post: ${JSON.stringify(post).toString()}`)
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from(JSON.stringify(post).toString()), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "create":
                                user = JSON.parse(msg.content.toString());
                                console.log(`Bad content: ${user.content}`)
                                user.bad_words = bad_words_regex.test(user.content + " " + user.title) || (user.content + " " + user.title).toLowerCase().includes("плохо")
                                console.log(`Bad words: ${user.bad_words}`)
                                await repository.create(user);
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from("true"), {
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
                                id = JSON.parse(msg.content.toString());
                                await repository.delete(id);
                                channel.sendToQueue(process.env.COMMENTS_QUEUE,
                                    Buffer.from(JSON.stringify({id: id}).toString()), {
                                    headers: {
                                        type: "delete_by_post"
                                    }
                                });
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from("true"), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "add_or_delete_like":
                                post = JSON.parse(msg.content.toString())
                                let try_get_like = await repository.get_like(post.user_id, post.id)
                                if (try_get_like == null)
                                {
                                    console.log("ДОБАВЛЯЕМ ЛАЙК")
                                    await repository.add_like(parseInt(post.user_id),parseInt(post.id))
                                    console.log("ИД ЮЗЕРА ", post.user_id, " ИД ПОСТА ", post.id)
                                    let ress = await repository.get_like(parseInt(post.user_id),parseInt(post.id))
                                    console.log(`ReSSS: `, ress)
                                    let post_like = (await repository.get_by_id(post.id)).likes
                                    let a = await repository.update_likes(post.id, post_like)
                                    console.log('Resss2 ', a)
                                    await post_send_service.send_to_add_rating(post.user_id,post.id, "add like", "2")
                                }
                                else{
                                    console.log("УДАЛЯЕМ ЛАЙК")
                                    await repository.delete_like(try_get_like.id)
                                    await post_send_service.send_to_delete_rating(post.user_id, post.id, "delete like", "2")
                                }
                                 channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from("true"), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "reject_all_posts":
                                await repository.delete_all_rejected()
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from("true"), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "accept_all_posts":
                                await repository.accept_all_rejected()
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from("true"), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "reject_post":
                                id = msg.content.toString()
                                let author_id1 = await repository.get_by_id(id)
                                await repository.delete(id)
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from(JSON.stringify(author_id1).toString()), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "accept_post":
                                id = msg.content.toString()
                                console.log(id)
                                await repository.accept(id)
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from("true"), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                            case "post_like":
                                data =JSON.parse(msg.content.toString())
                                console.log("ИД ЮЗЕРА2 ", data.user_id, " ИД ПОСТА2 ", data.post_id)
                                let res = await repository.get_like(parseInt(data.user_id),parseInt( data.post_id))
                                console.log("ВОТ ТАКОЙ РЕЗУЛЬТ ", res)
                                channel.sendToQueue(msg.properties.replyTo,
                                    Buffer.from(JSON.stringify(res).toString()), {
                                    correlationId: msg.properties.correlationId
                                });
                                channel.ack(msg);
                                break;
                        }
                }
            }
        });
    });
});


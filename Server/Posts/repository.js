const db = require("./db_connector");

// РЕПОЗИТОРИЙ: РАБОТА С БД ПОСТАМИ
exports.repository = () => {
  return {
    // СОЗДАИНЕ ПОСТА
    create: async post => {
        await db.Post.create({
            title: post.title,
            content: post.content,
            author_id: post.author_id,
            bad_words: post.bad_words
        }).then(post => console.log('СОЗДАН ПОСТ'+ '\n' + post.id)).catch(err => console.log(err));
    },
    // ОБНВОЛЕНИЕ ПОСТА
    update: async post => {
        await db.Post.update({
            title: post.title,
            content: post.content,
            checked: post.checked || false
        }, {
            where: {
                id: post.id
            }
        }).then(post => console.log('ОБНОВЛЕН ПОСТ'+ '\n' + post.id)).catch(err => console.log(err));
    },
    // УДАЛЕНИЕ ПОСТА
    delete: async id => {
        await db.Post.destroy({
            where: {
                id: id
            }
        }).then(post => console.log('УДАЛЕН ПОСТ'+ '\n' + post.id)).catch(err => console.log(err));
    },
    delete_all_by_author_id: async id => {
      await db.Post.destroy({
        where: {
          author_id: id
        }
      }).then(post => console.log('УДАЛЕН ПОСТ'+ '\n' + post.id)).catch(err => console.log(err));
    },
    get_all: async () => {
      return await db.Post.findAll();
    },
    get_by_id: async id => {
      return await db.Post.findByPk(id);
    },
    get_by_author_id: async id => {
      return await db.Post.findAll({
        where: {
          author_id: id
        }
      });
    },
    add_like: async (author_id, post_id) => {
      return  await db.Likes.create({
          user_id: author_id,
          post_id: post_id
      })
    },
    delete_like: async (id) => {
      return await db.Likes.destroy({
        where: {
          id: id
        }
      })
    },
    update_likes: async (post_id, likes) => {
      return await db.Post.update({
        likes: likes + 1
      },{
        where:{
          id:post_id
        }
      })
    },
    get_like: async (user_id, post_id) =>{
      return await db.Likes.findOne({
        where: {
          post_id: post_id,
          user_id: user_id
        }
      })
    },
    delete_all_rejected: async () => {
        return await db.Post.destroy({
          where: {
            checked: false
          }
        })
    },
    accept_all_rejected: async () => {
      return await db.Post.update({
        checked: true
      },{
        where: {
          checked: false
        }
      })
    },
    accept: async (id) => {
      return await db.Post.update({
        checked: true
      }, {
        where: {
          id: id
        }
      })
    },
  }
}
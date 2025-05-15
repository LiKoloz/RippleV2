const { where } = require("sequelize");
const db = require("./db_connector");

// РЕПОЗИТОРИЙ: РАБОТА С БД КОММЕНТАРИЯМИ
exports.repostitory = () => {
  return {
    // СОЗДАНИЕ КАММЕНТАРИЯ
    create: async comment => {
        await db.Comment.create({
            content: comment.content,
            author_id: comment.author_id,
            post_id: comment.post_id
        }).then(comment => console.log('СОЗДАН КОММЕНТАРИЙ'+ '\n' + comment.id)).catch(err => console.log(err));
    },
    // УДАЛЕНИЕ КАММЕНТАРИЯ
    delete: async id => {
        await db.Comment.destroy({
            where: {
                id: id
            }
        }).then(comment => console.log('УДАЛЕН КОММЕНТАРИЙ'+ '\n' + comment.id)).catch(err => console.log(err));
    },
    get_all_by_post_id: async id => {
        return await db.Comment.findAll({
            where:{
                post_id: id
            }
        })
    },
    delete_by_post: async id =>{
        return await db.Comment.destroy({
            where: {
                post_id: id
            }
        })
    }
  }
}
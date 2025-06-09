const db = require("./db_connector");
const { Sequelize } = require('sequelize');

// РЕПОЗИТОРИЙ: РАБОТА С БД ПОЛЬЗОВАТЕЛЯМИ
exports.repository = () => {
  return {
    // СОЗДАИНЕ ПОЛЬЗОВАТЕЛЯ
    create: async user => {
        await db.User.create({
            nick_name: user.nickname,
            first_name: user.first_name,
            second_name: user.second_name,
            nick_name: user.nick_name,
            password: user.password,
            email: user.email,
            role: user.role
        }).then(user => console.log('СОЗДАН ПОЛЬЗОВАТЕЛЬ'+ '\n' + user.id)).catch(err => console.log(err));
    },
    // ОБНВОЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
    update: async user => {
        await db.User.update({
            nick_name: user.nickname,
            first_name: user.first_name,
            second_name: user.second_name,
            nick_name: user.nick_name,
            password: user.password,
            email: user.email,
            checked: user.checked || false
        }, {
            where: {
                id: user.id
            }
        }).then(user => console.log('ОБНОВЛЕН ПОЛЬЗОВАТЕЛЬ'+ '\n' + user.id)).catch(err => console.log(err));
    },
    // УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
    delete: async id => {
        await db.User.destroy({
            where: {
                id: id
            }
        }).then(user => console.log('УДАЛЕН ПОЛЬЗОВАТЕЛЬ'+ '\n' + user.id)).catch(err => console.log(err));
    },
    get_by_email: async email => {
        return await db.User.findOne({
            where: {
                email: email
            }
        }).then(user => user).catch(err => console.log(err));
    },
    get_by_id: async id =>{
        return await db.User.findOne({
            where: {
                id: id
            }
        }).then(user => user).catch(err => console.log(err));
    },
    add_rating: async (id, count) =>{
        return await db.User.update({
            rating: Sequelize.literal(`rating + ${count}`)
        },{
            where: {
                id: id
            }
        })
    },
    decrease_rating: async (id, count) =>{
        return await db.User.update({
            rating: Sequelize.literal(`rating + ${count}`)
        },{
            where: {
                id: id
            }
        })
    },
    add_rating_history: async (user_id, post_id, type, count) =>{
        return await db.Rating_history.create({
            user_id: user_id,
            post_id: post_id,
            type: type,
            rating: count
        })
    },
    get_user_rating_history: async (user_id) =>{
        return await db.Rating_history.findAll({
            where: {
                user_id: user_id
            }
        })
    }
  }
}
const Sequelize = require("sequelize");
var sq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "postgres",
    host: process.env.DB_HOST
})

exports.Comment = sq.define("comment", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    author_id:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    post_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
},
{
    indexes: [
        {
            unique: false, 
            fields: ['post_id']
        }
    ]
});


sq.sync({force: true}).then(() => {
    console.log("Database synced");
}).catch((error) => {
    console.log(error)
});
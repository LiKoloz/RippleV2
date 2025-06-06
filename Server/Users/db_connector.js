const Sequelize = require("sequelize");
var sq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "postgres",
    host: process.env.DB_HOST
})
 
exports.User = sq.define("user", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nick_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    second_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.STRING,
        defaultValue: "user"
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    rating: {
        type: Sequelize.INTEGER,
        defaultValue: 10
    }
});

exports.Rating_history = sq.define("likes_history", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rating:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

async function createAdminUser() {
    try {
        await exports.User.create({
            nick_name: 'admin',
            first_name: 'Admin',
            second_name: 'System',
            role: "admin",
            checked: true,
            email: 'admin@example.com',
            password: '123' 
        });
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

// Синхронизация и создание админа
sq.sync({ force: true })
    .then(() => {
        console.log("Database synced");
        return createAdminUser();
    })
    .catch((error) => {
        console.log("Database sync error:", error);
    });
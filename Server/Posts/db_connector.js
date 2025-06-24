const Sequelize = require("sequelize");
var sq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "postgres",
    host: process.env.DB_HOST
})

exports.Post = sq.define("post", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    checked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    author_id:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    bad_words: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
},
{
    indexes: [
        {
            unique: false, 
            fields: ['author_id']
        }
    ]
});

exports.Likes  = sq.define("likes", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    post_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    user_id: {
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


function generateRandomContent() {
    const sentences = [
        "Этот пост посвящен интересной теме.",
        "Сегодня мы обсудим важные вопросы.",
        "В современном мире эта проблема актуальна как никогда.",
        "Автор делится своим уникальным опытом.",
        "Этот материал поможет вам разобраться в сложной теме.",
        "Не упустите возможность узнать что-то новое.",
        "Практические советы из личного опыта.",
        "Анализ текущей ситуации и перспективы развития.",
        "Как избежать распространенных ошибок?",
        "Пошаговое руководство для начинающих."
    ];
    
    const paragraphs = [];
    for (let i = 0; i < 3; i++) {
        paragraphs.push(sentences[Math.floor(Math.random() * sentences.length)]);
    }
    return paragraphs.join(' ');
}

// Генерация тестовых данных
async function generateTestPosts() {
    try {
        // Синхронизация моделей с БД
        await sq.sync({ force: true });
        console.log("Database synced");

        // Массив для хранения промисов создания постов
        const postPromises = [];
        
        // Генерация 20 постов
        for (let i = 1; i <= 20; i++) {
            postPromises.push(
                exports.Post.create({
                    title: `Тестовый пост ${i}`,
                    content: generateRandomContent(),
                    checked: Math.random() > 0.5,
                    author_id: 1,
                    likes: Math.floor(Math.random() * 100)
                })
            );
        }

        // Ожидаем завершения всех операций
        await Promise.all(postPromises);
        console.log('20 тестовых постов успешно созданы');

        // Можно также создать тестовые лайки
        await exports.Likes.create({
            post_id: 1,
            user_id: 1
        });
        console.log('Тестовый лайк создан');

    } catch (error) {
        console.error('Ошибка при генерации тестовых данных:', error);
    } finally {
        // Закрываем соединение
    }
}

sq.sync({force: true}).then(() => {
    console.log("Database synced");
    generateTestPosts();
}).catch((error) => {
    console.log(error)
});
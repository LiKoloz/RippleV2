
const express = require('express');
const app = express();
const cors = require('cors');
const post_router = require("./routes/post_routes");
const user_router = require("./routes/user_routes");
const comment_router = require("./routes/comment_routes")
const bodyparser = require("body-parser");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

app.use(cors({
 origin: 'http://85.198.80.78:5173'
}))

app.use(( req, res, next) => {
  console.log(req.body)  
  next()
});


app.get("/", (req, res) => {
  console.log("Получили тестовый запрос");
  res.send("Hello World!");
})

app.use("/users", user_router);
app.use("/posts", post_router);
app.use("/comments", comment_router)

// Обработчик 404 для несуществующих маршрутов
app.use(function (req, res) {
  res.status(404).send("Not Found");
});

// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack); // Логируем ошибку в консоль
  res.status(500).send('Что-то пошло не так!'); // Отправляем ответ клиенту
});

app.listen(port, () => {
  console.log("Сервер запущен на порту " + port);
});
const express = require('express');
const comment_router = express.Router();
const comment_controller = require("../controllers/comment_controller");


comment_router.post("/create", comment_controller.create_comment)

comment_router.delete("/delete", comment_controller.delete_comment)


module.exports = comment_router
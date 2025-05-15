const express = require('express');
const user_router = express.Router();
const user_controller = require("../controllers/user_controller");

user_router.get("/role/:email", user_controller.get_user_role);
user_router.get("/get/:user_id", user_controller.get_user_by_id);
user_router.get("get/:email", user_controller.get_user);
user_router.get("/rating/history/:user_id", user_controller.get_user_rating_history);
user_router.put("/update", user_controller.update_user);
user_router.delete("/delete", user_controller.delete_user);
user_router.put("/sign_in", user_controller.sign_in_default);
user_router.put("/sign_up", user_controller.sign_up_default);

module.exports = user_router;
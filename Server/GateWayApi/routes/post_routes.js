const express = require('express');
const post_router = express.Router();
const post_controller = require("../controllers/post_controller");

post_router.get("/all/noncheked/:page", post_controller.get_all_pagination_post_non_checked);
post_router.get("/all/:page", post_controller.get_all_pagination_post_checked);
post_router.get("/all", post_controller.get_all_post);
post_router.post("/create", post_controller.create_post);
post_router.put("/add_or_delete_like", post_controller.add_or_delete_like)
post_router.put("/update", post_controller.update_post);

post_router.delete("/reject/all", post_controller.reject_all_posts)
post_router.delete("/reject/:post_id", post_controller.reject_post)

post_router.get("/accept/all", post_controller.accept_all_posts)
post_router.get("/accept/:post_id", post_controller.accept_post)

post_router.delete("/delete", post_controller.delete_post);
post_router.get("/:id", post_controller.get_post);


module.exports = post_router;
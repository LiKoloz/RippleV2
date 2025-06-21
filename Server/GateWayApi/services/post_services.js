var send_service_to_post_gw = require("../send_services/serd_service_to_post_gw");
var send_service_to_comment_gw = require("../send_services/serd_service_to_comment_gw");

exports.get_post = async (id) => {
    return await send_service_to_post_gw.get_post_by_id(id);
}

exports.get_all_post = async () => {
    return await send_service_to_post_gw.get_all_post();
}

exports.create_post = async (post) => {
    return await send_service_to_post_gw.create_post(post);
}

exports.update_post = async (post) => {
    return await send_service_to_post_gw.update_post(post);
}

exports.delete_post = async (post) => {
    return await send_service_to_post_gw.delete_post(post.id);
}

exports.get_all_pagination_post_checked = async (page) => {
    return await send_service_to_post_gw.get_all_pagination_post_checked(page)
}
exports.get_all_pagination_post_non_checked = async (page) => {
    return await send_service_to_post_gw.get_all_pagination_post_non_checked(page)
}

exports.add_or_delete_like = async (data) => {
    return await send_service_to_post_gw.add_or_delete_like(data)
}

exports.reject_all_posts = async () => {
    return await send_service_to_post_gw.reject_all_posts()
}

exports.accept_all_posts = async () => {
    return await send_service_to_post_gw.accept_all_posts()
}

exports.reject_post = async (data) => {
    return await send_service_to_post_gw.reject_post(data.id)
}

exports.accept_post = async (data) => {
    return await send_service_to_post_gw.accept_post(data.id)
}

exports.post_like = async (data) => {
    return await send_service_to_post_gw.post_like(data)
}
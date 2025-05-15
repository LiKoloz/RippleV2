const send_service_to_comment_gw = require("../send_services/serd_service_to_comment_gw")


exports.create_comment = async (comment) =>{
    return await send_service_to_comment_gw.create_comment(comment)
}

exports.delete_comment = async (comment) =>{
    return await send_service_to_comment_gw.delete_comment(comment)
}
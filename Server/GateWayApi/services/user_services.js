var send_service_to_auth = require("../send_services/serd_service_to_auth_gw.js");
var send_service_to_user = require("../send_services/serd_service_to_user_gw.js");

exports.get_user = async (email) => {
    return await send_service_to_user.get_user_by_email(email);
}

exports.get_user_role_by_email = async (email) => {
    console.log("YYYYYYYYYYYYYYYYYYYEEEEEEEEE")
    let res = await send_service_to_user.get_user_by_email(email)
    console.log("RESSS" + res)
    res = JSON.parse(res).role
    console.log("RESSS2 ",res)
    return await res;
}


exports.sign_in_default = async (user) => { 
    let true_user = await send_service_to_user.get_user_by_email(user.email);
    if(true_user == "")
        return {is_valid: false}
    return await send_service_to_auth.sign_in_default({ false_user: user, true_user: true_user });
}


exports.sign_up_default = async (user) => {
    let check = await send_service_to_user.create_user(user)
    console.log(check + "CHECKCHECK")
    if(check == 'true') {
        let jwt = await send_service_to_auth.sign_up_default(user)
        console.log("JWT +", jwt)
        return {
            email: user.email,
            jwt: jwt
        }
    }
    return await send_service_to_auth.sign_up_default(user);
}

exports.update_user = async (user) => {
    return await send_service_to_user.update_user(user);
}

exports.delete_user = async (user) => {
    return await send_service_to_user.delete_user(user.id);
}

exports.get_user_rating_history = async (id) => {
    return await send_service_to_user.get_user_rating_history(id);
}

exports.get_user_by_id = async (id) => {
    return await send_service_to_user.get_user_by_id(id);
}
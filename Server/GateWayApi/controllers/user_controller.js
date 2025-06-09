var user_services = require('../services/user_services');

exports.sign_up_default = async (req, res) => {
    let body = req.body
    await user_services.sign_up_default(body)
        .then((user) => {
            console.log("Get User+ " + JSON.stringify(user).toString())
            if(user.jwt)
                console.log(JSON.stringify(user).toString())
                return res.status(200).json(user)
            return res.status(500)
        })
        .catch((err) => res.status(500).json(err));
}
exports.sign_in_default = async (req, res) => {
    await user_services.sign_in_default(req.body).then(
        (result) => {
            result = JSON.parse(result)
            if(result.is_valid === true)
               return res.status(200).json({jwt: result.token, email: req.body.email, id: result.id})
            return res.status(404).json("Такого пользователя не существует")    
        })
        .catch((err) => {console.log(err);res.status(500).json(err)});
    }

exports.delete_user = async (req, res) => await user_services.delete_user(req.body).then((user) => res.status(200).json(user)).catch((err) => res.status(500).json(err));
exports.update_user = async (req, res) => await user_services.update_user(req.body).then((user) => res.status(200).json(user)).catch((err) => res.status(500).json(err));
exports.get_user = async (req, res) => await user_services.get_user(req.params["email"]).then((user) => res.status(200).json(user)).catch((err) => res.status(500).json(err));
exports.get_user_role = async (req, res) => await user_services.get_user_role_by_email(req.params["email"]).then((user) => res.status(200).json(user)).catch((err) => res.status(500).json(err));

exports.get_user_rating_history = async (req, res) => await user_services.get_user_rating_history(req.params["user_id"]).then((user) => res.status(200).json(user)).catch((err) => res.status(500).json(err));

exports.get_user_by_id = async (req, res) => await user_services.get_user_by_id(req.params["user_id"]).then((user) => res.status(200).json(user)).catch((err) => res.status(500).json(err));
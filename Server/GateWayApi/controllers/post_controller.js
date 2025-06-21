var post_services = require("../services/post_services");

exports.create_post = async (req, res) => await post_services.create_post(req.body).then((post) => res.status(200).json(post)).catch((err) => res.status(500).json(err));

exports.update_post = async (req, res) => await post_services.update_post(req.body).then((post) => res.status(200).json(post)).catch((err) => res.status(500).json(err));

exports.delete_post = async (req, res) => await post_services.delete_post(req.body).then((post) => res.status(200).json(post)).catch((err) => res.status(500).json(err));

exports.add_or_delete_like = async (req, res) => await post_services.add_or_delete_like(req.body).then((post) => res.status(200).json(post)).catch((err) => res.status(500).json(err));

exports.get_post = async (req, res) => await post_services.get_post(req.params["id"]).then((post) => res.status(200).json(post)).catch((err) => res.status(500).json(err));

exports.get_all_post = async (req, res) => { 
    console.log("Запросили все посты");
    return await post_services.get_all_post()
        .then((post) => res.status(200).json(post))
        .catch((err) =>{
            console.log(err);
            res.status(500).json(err)
        });}

exports.get_all_pagination_post_checked = async (req, res) => await post_services.get_all_pagination_post_checked({ page: req.params["page"], user_id: req.headers.user_id }).then(posts => res.status(200).json(posts)).catch((err) => res.status(500).json(err))

exports.get_all_pagination_post_non_checked = async (req, res) =>  await post_services.get_all_pagination_post_non_checked({ page: req.params["page"], user_id: req.headers.user_id }).then(posts => res.status(200).json(posts)).catch((err) => res.status(500).json(err))

exports.reject_all_posts = async (req, res) => await post_services.reject_all_posts().then(() => res.status(200)).catch((err) => res.status(500).json(err))

exports.accept_all_posts = async (req, res) => await post_services.accept_all_posts().then(() => res.status(200)).catch((err) => res.status(500).json(err))

exports.reject_post = async (req, res) => await post_services.reject_post({id: req.params["post_id"]}).then(() => {console.log("Пост отклонен"); return res.sendStatus(200)}).catch((err) => res.status(500).json(err))

exports.accept_post = async (req, res) => await post_services.accept_post({id: req.params["post_id"]}).then(() => res.status(200)).catch((err) => res.status(500).json(err))

exports.post_like = async (req, res) => await post_services.post_like(req.body).then((data) => {
    console.log("Data++ ",data)
    if(data != 'null'){
        res.status(200).json()
    }
    else{
        res.status(500).json()
    }
}).catch((err) => res.status(500).json(err))
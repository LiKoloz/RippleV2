var comment_service = require("../services/comment_services")

exports.create_comment =async (req, res)=> await comment_service.create_comment(req.body).then(() => res.status(200).json()).catch((err) => res.status(500).json(err));

exports.delete_comment =async (req, res)=> await comment_service.delete_comment(req.body).then(() => res.status(200).json()).catch((err) => res.status(500).json(err));
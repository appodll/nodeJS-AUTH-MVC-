const { getTokenInfo } = require("../func/helpers.js");
const Post = require("../models/SocialModels/post_model.js");
const CommentModel = require('../models/SocialModels/comment_model.js');

const get_all_post = async (req, res) => {

    const { token, post_type, content, file_url } = req.query
    res.send(getTokenInfo(token))
}

const add_post = async (req, res) => {
    const { token, post_type, content, file_url } = req.body
    const tokenValue = getTokenInfo(token);

    const newPost = await Post.create({
        user_id: tokenValue.user_id,
        post_type: post_type,
        content: content,
        file_url: file_url,
        comments_count: 0,
        comments_id: 0
    })
    const newComment = await CommentModel.create({
        user_id: tokenValue.user_id,
        post_id: newPost.id,
        likes_count: 0,
        reply_list: []
    })

    await Post.update(
        { comments_id: newComment.id },
        { where: { id: newPost.id } }
    )
    res.status(200).send({
        "status": "success",
        "message": "Post-unuz uğurla əlavə edildi"
    })

}

module.exports = { get_all_post, add_post }
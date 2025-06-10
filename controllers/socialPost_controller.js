const { getTokenInfo } = require("../utils/helpers.js");
const Post = require("../models/SocialModels/post_model.js");
const CommentModel = require('../models/SocialModels/comment_model.js');
const PostLikes = require('../models/SocialModels/postLikes_model.js');
const CommentLikes = require('../models/SocialModels/commentlikes_model.js');
const ReplyComment = require('../models/SocialModels/replyComment_model.js');
const ReplyLikes = require('../models/SocialModels/replyLikes_model.js');

const get_all_post = async (req, res) => {
    try {
        const { token, post_type, content, file_url } = req.query
        res.send(getTokenInfo(token))
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
}

const add_post = async (req, res) => {
    try {
        const { token, post_type, content } = req.body
        const tokenValue = getTokenInfo(token);

        let file_url = null

        if (post_type == "text") {
            await Post.create({
                user_id: tokenValue.user_id,
                post_type: post_type,
                content: content,
            })
        } else if (post_type === "image" || post_type === "video") {
            file_url = req.files.find(file => file.fieldname === "file_url");
            console.log(file_url)
            await Post.create({
                user_id: tokenValue.user_id,
                post_type: post_type,
                file_url: file_url ? file_url.path : null
            })
        }

        res.status(200).send({
            "status": "success",
            "message": "Post-unuz uğurla əlavə edildi"
        })
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
}

const add_comments = async (req, res) => {
    try {
        const { token, post_id, comment } = req.body

        const tokenValue = getTokenInfo(token);

        await CommentModel.create({
            user_id: tokenValue.user_id,
            post_id: post_id,
            comment: comment,
            reply_list: []
        })

        let allCommentList = [];

        const allComment = await CommentModel.findAll({ where: { post_id: post_id } })

        for (let comment of allComment) {
            let allReplyList = [];
            const allreply = await ReplyComment.findAll({ where: { comment_id: comment.id } })
            const comment_likes = await CommentLikes.findAll({ where: { comment_id: comment.id } })

            const comment_isLiked = await CommentLikes.findOne({
                where: { comment_id: comment.id, user_id: tokenValue.user_id }
            });

            for (let reply of allreply) {
                const reply_likes = await ReplyLikes.findAll({ where: { reply_comment_id: reply.id } })
                const reply_isLikes = await ReplyLikes.findOne({ where: { reply_comment_id: reply.id, user_id: tokenValue.user_id } })
                allReplyList.push({
                    ...reply.toJSON(),
                    likes_count: reply_likes.length,
                    isLiked: !!reply_isLikes
                })
            }

            allCommentList.push({
                ...comment.toJSON(),
                likes_count: comment_likes.length,
                isLiked: !!comment_isLiked,
                reply_comment: allReplyList,
            })
        }

        res.status(200).send({
            "status": "success",
            "message": "Commentiniz uğurla əlavə edildi",
            "data": allCommentList
        })
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
}

const all_comments = async (req, res) => {
    try {
        const { post_id, token } = req.query
        const tokenValue = getTokenInfo(token);

        let allCommentList = [];

        const allComment = await CommentModel.findAll({ where: { post_id: post_id } })

        for (let comment of allComment) {
            let allReplyList = [];
            const allreply = await ReplyComment.findAll({ where: { comment_id: comment.id } })
            const comment_likes = await CommentLikes.findAll({ where: { comment_id: comment.id } })

            const comment_isLiked = await CommentLikes.findOne({
                where: { comment_id: comment.id, user_id: tokenValue.user_id }
            });

            for (let reply of allreply) {
                const reply_likes = await ReplyLikes.findAll({ where: { reply_comment_id: reply.id } })
                const reply_isLikes = await ReplyLikes.findOne({ where: { reply_comment_id: reply.id, user_id: tokenValue.user_id } })
                allReplyList.push({
                    ...reply.toJSON(),
                    likes_count: reply_likes.length,
                    isLiked: !!reply_isLikes
                })
            }

            allCommentList.push({
                ...comment.toJSON(),
                likes_count: comment_likes.length,
                isLiked: !!comment_isLiked,
                reply_comment: allReplyList,
            })
        }

        res.status(200).send({
            "status": "success",
            "data": allCommentList
        })
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
}

const reply_comment = async (req, res) => {
    try {
        const { token, comment_id, comment, post_id } = req.body

        const tokenValue = getTokenInfo(token);

        await ReplyComment.create({
            comment_id,
            user_id: tokenValue.user_id,
            comment
        })

        let allCommentList = [];

        const allComment = await CommentModel.findAll({ where: { post_id: post_id } })

        for (let comment of allComment) {
            let allReplyList = [];
            const allreply = await ReplyComment.findAll({ where: { comment_id: comment.id } })
            const comment_likes = await CommentLikes.findAll({ where: { comment_id: comment.id } })

            const comment_isLiked = await CommentLikes.findOne({
                where: { comment_id: comment.id, user_id: tokenValue.user_id }
            });

            for (let reply of allreply) {
                const reply_likes = await ReplyLikes.findAll({ where: { reply_comment_id: reply.id } })
                const reply_isLikes = await ReplyLikes.findOne({ where: { reply_comment_id: reply.id, user_id: tokenValue.user_id } })
                allReplyList.push({
                    ...reply.toJSON(),
                    likes_count: reply_likes.length,
                    isLiked: !!reply_isLikes
                })
            }

            allCommentList.push({
                ...comment.toJSON(),
                likes_count: comment_likes.length,
                isLiked: !!comment_isLiked,
                reply_comment: allReplyList,
            })
        }

        res.status(200).send({
            "status": "success",
            "data": allCommentList
        })
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
}

const toggle_like = async (req, res) => {
    try {
        const { token, post_id, comment_id, reply_comment_id } = req.body
        const token_value = getTokenInfo(token)

        if (post_id) {
            const isPostLike = await PostLikes.findOne({
                where: {
                    user_id: token_value.user_id,
                    post_id: post_id
                }
            })
            if (isPostLike) {
                await PostLikes.destroy({
                    where: {
                        user_id: token_value.user_id,
                        post_id: post_id
                    }
                })
            } else {
                await PostLikes.create({
                    user_id: token_value.user_id,
                    post_id: post_id
                })
            }
            res.status(200).send({
                "status": "success",
            })
        } else if (reply_comment_id) {
            const isReplyLikes = await ReplyLikes.findOne({
                where: {
                    user_id: token_value.user_id,
                    reply_comment_id
                }
            })
            if (isReplyLikes) {
                await ReplyLikes.destroy({
                    where: {
                        user_id: token_value.user_id,
                        reply_comment_id
                    }
                })
            } else {
                await ReplyLikes.create({
                    user_id: token_value.user_id,
                    reply_comment_id
                })
            }
            res.status(200).send({
                "status": "success",
            })
        } else {
            const isCommentLike = await CommentLikes.findOne({
                where: {
                    user_id: token_value.user_id,
                    comment_id: comment_id
                }
            })
            if (isCommentLike) {
                await CommentLikes.destroy({
                    where: {
                        user_id: token_value.user_id,
                        comment_id: comment_id
                    }
                })
            } else {
                await CommentLikes.create({
                    user_id: token_value.user_id,
                    comment_id: comment_id
                })
            }
            res.status(200).send({
                "status": "success",
            })
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
}

module.exports = { get_all_post, add_post, add_comments, all_comments, reply_comment, toggle_like }
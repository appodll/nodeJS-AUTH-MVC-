const db = require('../../config/db.js');
const { DataTypes } = require("sequelize");


const CommentLikes = db.define("post_comment_likes", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = CommentLikes
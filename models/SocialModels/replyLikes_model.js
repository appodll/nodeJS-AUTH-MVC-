const db = require('../../config/db.js');
const { DataTypes } = require("sequelize");

const ReplyLikes = db.define("reply_likes", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reply_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: "post_reply_likes",
    defaultScope: {
        attributes: { exclude: ['user_id'] }
    }
})

module.exports = ReplyLikes
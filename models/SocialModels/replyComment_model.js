const db = require('../../config/db.js');
const { DataTypes } = require("sequelize");

const ReplyComment = db.define("reply_comment", {
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
},
{
    tableName: "post_reply_comments",
    defaultScope: {
        attributes: { exclude: ['user_id'] }
    }
})

module.exports = ReplyComment
const db = require('../../config/db.js');
const { DataTypes } = require("sequelize");

const CommentModel = db.define("comment", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    likes_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reply_list: {
        type: DataTypes.JSON,
        allowNull: false,
    },
},{
    tableName: "post_comments"
})

module.exports = CommentModel
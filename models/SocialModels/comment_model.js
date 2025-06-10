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
},{
    tableName: "post_comments",
    defaultScope: {
        attributes: { exclude: ['user_id'] }
    }
})

module.exports = CommentModel
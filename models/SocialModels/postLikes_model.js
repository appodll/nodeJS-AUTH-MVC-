const db = require('../../config/db.js');
const { DataTypes } = require("sequelize");

const PostLikes = db.define("post_likes", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = PostLikes
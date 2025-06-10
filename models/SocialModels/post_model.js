const db = require('../../config/db.js');
const { DataTypes } = require("sequelize");

const Post = db.define("post", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    post_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    file_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},
    {
        tableName: "social_posts"
    })

module.exports = Post

const db = require('../../config/db.js');
const { DataTypes } = require("sequelize");

const FollowModel = db.define("follow", {
    follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    followed_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "follows"
});

module.exports = FollowModel;
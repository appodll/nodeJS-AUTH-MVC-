const db = require('../../config/db.js');
const { DataTypes } = require('sequelize');

const Token = db.define("token", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    timestamps: false
})


module.exports = Token
const db = require('../config/db.js');
const { DataTypes } = require('sequelize');

const User = db.define("user", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hashed_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    update_at: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    otp_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    timestamps: false,
    tableName: 'users',
    defaultScope: {
        attributes: { exclude: ['password'] }
    }
})

module.exports = User

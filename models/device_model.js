const db = require("../config/db.js");
const { DataTypes } = require('sequelize');

const Device = db.define("deviceInfo", {
    user_id: {
        type: DataTypes.INTEGER,
    },
    device_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    os: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    os_version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.TIME,
        allowNull: false,
    },
},
    {
        tableName: "device_info",
        timestamps: false
    }
)

module.exports = Device
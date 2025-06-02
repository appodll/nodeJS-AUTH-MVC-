const { Sequelize } = require("sequelize");

var db = new Sequelize('flicksy', "root", "3122005x", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = db
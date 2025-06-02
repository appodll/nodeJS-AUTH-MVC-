const User = require('../models/user_model.js');

const authMiddleWare = async (req, res, next) => {
    console.log(req.user);
    next()
}

module.exports = authMiddleWare
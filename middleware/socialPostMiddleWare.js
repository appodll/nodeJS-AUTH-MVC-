const Token = require('../models/AuthModels/token_model.js');

const socialMiddleWare = async (req, res, next) => {

    try {
        const token = req.query.token || req.body.token;
        const token_db = await Token.findAll({ where: { token: token } })
        if (token_db && token_db.length > 0) {
            next();
        }
    } catch (error) {
        console.error(err);
    }
}

module.exports = socialMiddleWare
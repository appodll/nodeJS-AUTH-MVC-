const User = require('../models/AuthModels/user_model.js');
const Token = require('../models/AuthModels/token_model.js');
const DeviceModel = require('../models/AuthModels/device_model.js');
const bcrypt = require("bcrypt");
const { getToken, sendOTP, isInvalidEmail, isInvalidPassword } = require('../utils/helpers.js');
const { validationResult } = require("express-validator");
const { Op } = require('sequelize');
const useragent = require('express-useragent');

const register = async (req, res) => {
    const { username, password, email, role } = req.body;

    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(409).send({
            errors: error.array()
        })
    }


    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.findOne({
        where: {
            [Op.or]: [
                { email: email },
                { username: username }
            ]
        }
    })

    if (user) {
        return res.status(409).send({
            "status": "warning",
            "message": "Daxil etdiyiniz məlumatlar bazada var"
        })
    } else {
        await User.create({
            username: username,
            password: password,
            email: email,
            otp_code: sendOTP(email),
            hashed_password: hashedPassword,
            role: role,
            created_at: new Date(),
            update_at: new Date()
        })
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        const token = getToken(user)

        const tokenUser = await Token.findOne({ where: { user_id: user.user_id } })

        if (tokenUser) {
            await Token.update({
                token: token
            }, { where: { user_id: user.user_id } })
        } else {
            await Token.create({
                user_id: user.user_id,
                token: token,
                created_at: new Date()
            })
        }
        const newToken = await Token.findOne({ where: { user_id: user.user_id } })
        const device = req.useragent
        let device_type = 'Unknown';
        if (device['isWindows'] == true) {
            device_type = 'Windows'
        } else if (device['isLinux'] == true) {
            device_type = 'Linux'
        } else if (device['isMac'] == true) {
            device_type = 'Mac'
        } else if (device['isMobile'] == true) {
            device_type = 'Mobile'
        }
        await DeviceModel.create({
            user_id: user.user_id,
            device_type: device_type,
            os: device['os'],
            os_verison: device['version'],
            ip_address: req.ip,
            created_at: new Date()
        })
        const safeUser = user.toJSON();
        delete safeUser.otp_code;

        const responseUser = {
            ...safeUser,
            token: newToken.token
        }

        return res.status(200).send({
            "status": "success",
            "message": "Dogrulama kodu göndərildi",
            "page": "otp",
            "data": responseUser
        });
    }

}


const login = async (req, res) => {
    const { usernameORemail, password } = req.body;

    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(409).send(error)
    }
    let user;

    user = await User.findOne({
        where: usernameORemail.includes("@") ?
            { email: usernameORemail } :
            { username: usernameORemail }
    })

    if (!user) {
        return res.status(409).send({
            "status": "warning",
            "message": "Məlumatları düzgün yazın",
        })
    } else {
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password)

        if (isPasswordValid) {
            if (user.is_verified != 1) {
                user.otp_code = sendOTP(user.email);
                user.save()
            }
            const token = getToken(user)

            const tokenUser = await Token.findOne({ where: { user_id: user.user_id } })
            if (tokenUser) {
                await Token.update({
                    token: token
                }, { where: { user_id: user.user_id } })
            } else {
                await Token.create({
                    user_id: user.user_id,
                    token: token,
                    created_at: new Date()
                })
            }
            const newToken = await Token.findOne({ where: { user_id: user.user_id } })

            const safeUser = user.toJSON();
            delete safeUser.otp_code;

            const responseUser = {
                ...safeUser,
                token: newToken.token
            }

            return res.status(200).send({
                "status": "success",
                "message": user.is_verified == 1 ? "Uğurla daxil oldunuz" : "Dogrulama kodu göndərildi",
                "page": user.is_verified == 1 ? "dashboard" : "otp",
                "data": responseUser
            })
        } else {
            return res.status(409).send({
                "status": "warning",
                "message": "Məlumatları düzgün yazın",
            })
        }
    }
}

const check_pin_code = async (req, res) => {
    const { pin_code, token } = req.body

    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(409).send(error)
    }

    const tokenInfo = await Token.findOne({ where: { token } })
    const user = await User.findOne({ where: { user_id: tokenInfo.user_id } })


    if (user.otp_code === pin_code) {
        user.otp_code = null;
        user.is_verified = 1;
        await user.save();

        return res.status(200).send({
            "status": "success",
            "message": "Uğurla daxil oldunuz",
            "page": "dashboard",
        })
    } else {
        return res.status(409).send({
            "status": "warning",
            "message": "Doğrulama kodu səhv qeyd olundu",
        })
    }
}

const resend_code = async (req, res) => {
    const { user_id } = req.body
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(409).send(error)
    }
    const user = await User.findOne({ where: { user_id: user_id } })

    user.otp_code = sendOTP(user.email)
    await user.save()
    return res.status(200).send({
        "status": "success",
        "message": "Doğrulama kodu göndərildi",
    })
}

const forgot_password = async (req, res) => {
    const { email, password, request_type, id, pin_code } = req.body

    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(409).send(error)
    }

    if (request_type == "send_otp") {

        const user = await User.findOne({
            where: { email: email }
        })
        if (!user) {
            return res.status(409).send({
                "status": "error",
                "message": "Belə istifadəçi yoxdur"
            })
        }
        user.otp_code = sendOTP(user.email);
        await user.save()
        return res.status(200).send({
            "status": "success",
            "message": "Doğrulama kodu göndərildi",
            "page": 'otp',
            "data": user
        })
    } else if (request_type == "check_pin_code") {
        const user = await User.findOne({
            where: { user_id: id }
        })

        if (user.otp_code == pin_code) {
            user.otp_code = null;
            await user.save();
            return res.status(200).send({
                "status": "success",
                "message": "Doğrulama kodu təsdiqləndi",
                "page": "reset_password"
            })
        } else {
            return res.status(409).send({
                "status": "warning",
                "message": "Doğrulama kodu səhv qeyd olundu",
            })
        }
    } else if (request_type == "reset_password") {
        const user = await User.findOne({
            where: { user_id: id }
        })
        const hashed_password = await bcrypt.hash(password, 10);

        user.password = password;
        user.hashed_password = hashed_password;
        await user.save();
        return res.status(200).send({
            "status": "success",
            "message": "Şifrəniz yeniləndi",
            "page": "login"
        })
    }
}


module.exports = { register, login, check_pin_code, resend_code, forgot_password }

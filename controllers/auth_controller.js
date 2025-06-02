const User = require('../models/user_model.js');
const Token = require('../models/token_model.js');
const DeviceModel = require('../models/device_model.js');
const bcrypt = require("bcrypt");
const { getToken, sendOTP, isInvalidEmail, isInvalidPassword } = require('../func/helpers.js');
const { Op } = require('sequelize');
const useragent = require('express-useragent');

const register = async (req, res) => {
    const { username, password, email, role } = req.body;

    if (username.trim() != "" && email.trim() != "" && password.trim() != "") {
        if (!isInvalidEmail(email)) {
            return res.status(404).send({
                status: "error",
                message: "E-poçt formatı yanlışdır"
            });
        }
        if (!isInvalidPassword(password)) {
            return res.status(404).send({
                status: "error",
                message: "Şifrə ən az 8 simvol, hərf və rəqəm içerməlidir"
            });
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

            return res.status(200).send({
                "status": "success",
                "message": "Dogrulama kodu göndərildi",
                "page": "otp",
                "data": user
            });
        }

    } else {
        return res.status(409).send({
            "status": "warning",
            "message": "Məlumatları düzgün yazın",
        })
    }
}


const login = async (req, res) => {
    const { usernameORemail, password } = req.body;

    if (usernameORemail.trim() != "" && password.trim() != "") {

        if (usernameORemail.includes("@")) {
            if (!isInvalidEmail(usernameORemail)) {
                return res.status(404).send({
                    status: "error",
                    message: "E-poçt formatı yanlışdır"
                });
            }
        }
        if (!isInvalidPassword(password)) {
            return res.status(404).send({
                status: "error",
                message: "Şifrə ən az 8 simvol, hərf və rəqəm içerməlidir"
            });
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
                return res.status(200).send({
                    "status": "success",
                    "message": user.is_verified == 1 ? "Uğurla daxil oldunuz" : "Dogrulama kodu göndərildi",
                    "page": user.is_verified == 1 ? "dashboard" : "otp",
                    "data": user
                })
            } else {
                return res.status(409).send({
                    "status": "warning",
                    "message": "Məlumatları düzgün yazın",
                })
            }
        }

    } else {
        return res.status(409).send({
            "status": "warning",
            "message": "Məlumatları düzgün yazın",
        })
    }
}

const check_pin_code = async (req, res) => {
    const { pin_code, user_id } = req.body

    const user = User.findOne({ where: { user_id: user_id } })

    if (user.otp_code == pin_code) {
        const token = getToken(user)
        await Token.create({
            user_id: user.user_id,
            token: token,
            created_at: new Date()
        })
        return res.status(200).send({
            "status": "success",
            "message": "Uğurla daxil oldunuz",
            "page": "dashboard",
            "data": user
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

    const user = User.findOne({ where: { user_id: user_id } })

    user.otp_code = sendOTP(user.email)
    await user.save()
    return res.status(200).send({
        "status": "success",
        "message": "Doğrulama kodu göndərildi",
    })
}


module.exports = { register, login, check_pin_code, resend_code }

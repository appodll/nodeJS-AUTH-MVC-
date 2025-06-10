const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const getToken = (user) => {
    const token = jwt.sign({
        user_id: user.user_id,
        username: user.username,
        hashed_password: user.hashed_password,
        email: user.email
    },
        process.env.SECRET_KEY)
    return token;
}

const getTokenInfo = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return null;
    }
}

function isInvalidEmail(email) {
    const pattern = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
}

function isInvalidPassword(password) {
    return (
        password.length >= 8 &&
        /[a-zA-Z]/.test(password) &&
        /[0-9]/.test(password)
    );
}


const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    port: 587,
    auth: {
        user: "flicksy293@gmail.com",
        pass: "irra ogwy weow cjum"
    }
});

function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
}

function sendOTP(email) {
    const otp = generateOTP();

    const mailOptions = {
        from: "flicksy293@gmail.com",
        to: email,
        subject: "OTP Şifrən",
        text: `Sizin OTP şifrəniz: ${otp}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(`Error sending email: ${err}`);
        } else {
            console.log('OTP sent: ' + info.response);
        }
    });
    return otp;
}

function multerStroge(req, file, cb) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./upload");
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);

            const date = new Date();
            const dateSuffix = date.getFullYear().toString() +
                ('0' + (date.getMonth() + 1)).slice(-2) +
                ('0' + date.getDate()).slice(-2) + '-' +
                ('0' + date.getHours()).slice(-2) +
                ('0' + date.getMinutes()).slice(-2) +
                ('0' + date.getSeconds()).slice(-2);

            const newFilename = `${name}-${dateSuffix}${ext}`;

            cb(null, newFilename);
        }
    });
}


module.exports = { getToken, isInvalidEmail, isInvalidPassword, sendOTP, getTokenInfo, multerStroge }
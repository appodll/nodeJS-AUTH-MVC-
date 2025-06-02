const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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


module.exports = { getToken, isInvalidEmail, isInvalidPassword, sendOTP }
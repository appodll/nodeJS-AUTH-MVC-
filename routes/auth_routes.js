const express = require("express");
const { register, login, check_pin_code, resend_code, forgot_password } = require('../controllers/auth_controller.js');
const multer = require("multer");
const { registerValidation, loginValidation, checkPinValidation, resendCodeValidation, forgotPasswordValidation } = require('../validations/auth_validation.js');

const router = express.Router();
const upload = multer();


router.post('/register', upload.any(), registerValidation(), register)
router.post('/login', upload.any(), loginValidation(), login)
router.post('/check_pin_code', upload.any(), checkPinValidation(), check_pin_code)
router.post('/resend_code', upload.any(), resendCodeValidation(), resend_code)
router.post('/forgot_password', upload.any(), forgotPasswordValidation(), forgot_password)


module.exports = router
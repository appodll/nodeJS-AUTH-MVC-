const express = require("express");
const { register, login, check_pin_code, resend_code, forgot_password } = require('../controllers/auth_controller.js');
const multer = require("multer");

const router = express.Router();
const upload = multer();


router.post('/register', upload.any(), register)
router.post('/login', upload.any(), login)
router.post('/check_pin_code', upload.any(), check_pin_code)
router.post('/resend_code', upload.any(), resend_code)
router.post('/forgot_password', upload.any(), forgot_password)

module.exports = router
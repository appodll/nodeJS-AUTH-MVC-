const express = require("express");
const { register, login, check_pin_code, resend_code } = require('../controllers/auth_controller.js');
const authMiddleWare = require("../middleware/auth_middleWare.js");
const multer = require("multer");

const router = express.Router();
const upload = multer();


router.post('/register', upload.any(), register)
router.post('/login', upload.any(), login)
router.post('/check_pin_code', upload.any(), check_pin_code)
router.post('/resend_code', upload.any(), resend_code)

module.exports = router
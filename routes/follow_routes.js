const express = require("express");
const { follow_unfollow } = require('../controllers/follow_controller.js');
const multer = require("multer");

const router = express.Router();
const upload = multer();


router.post('/follow', upload.any(), follow_unfollow)

module.exports = router

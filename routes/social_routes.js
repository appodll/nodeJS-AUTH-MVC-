const express = require("express");
const multer = require("multer");

const { get_all_post, add_post } = require('../controllers/socialPost_controller.js');

const socialMiddleWare = require('../middleware/socialPostMiddleWare.js');

const router = express.Router();
const upload = multer();

router.get('/all_post', upload.any(), socialMiddleWare, get_all_post)
router.post("/add_post", upload.any(), socialMiddleWare, add_post)

module.exports = router
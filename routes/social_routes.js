const express = require("express");
const multer = require("multer");
const { multerStroge } = require("../utils/helpers.js");

const { get_all_post, add_post, add_comments, all_comments, reply_comment, toggle_like } = require('../controllers/socialPost_controller.js');

const socialMiddleWare = require('../middleware/socialPostMiddleWare.js');

const router = express.Router();
const upload = multer({ storage: multerStroge() });

router.get('/all_post', upload.any(), socialMiddleWare, get_all_post)
router.post("/add_post", upload.any(), socialMiddleWare, add_post)
router.post("/add_comment", upload.any(), socialMiddleWare, add_comments)
router.get("/all_comment", upload.any(), socialMiddleWare, all_comments)
router.post("/reply_comment", upload.any(), socialMiddleWare, reply_comment)
router.post("/social_media_likes", upload.any(), socialMiddleWare, toggle_like)


module.exports = router
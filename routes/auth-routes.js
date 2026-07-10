const authControllers = require("../controllers/auth-controllers");

const express = require("express");

const multerUpload = require("../middlewares/multer-middleware");

const router = express.Router();

router
	.post("/signup", multerUpload.single("imageUrl"), authControllers.signUp)
	.post("/signIn", multerUpload.single("imageUrl"), authControllers.signIn);

module.exports = router;

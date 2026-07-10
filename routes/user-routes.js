const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user-controllers");
const authenticationMiddleware = require("../middlewares/authentication-middleware");

router.get("/me", authenticationMiddleware, usersController.getProfile);
router.patch("/me", authenticationMiddleware, usersController.updateProfile);
router.patch(
	"/me/change-password",
	authenticationMiddleware,
	usersController.updatePassword,
);
router.delete("/me", authenticationMiddleware, usersController.deleteProfile);

module.exports = router;

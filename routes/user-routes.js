const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user-controllers");
const authenticationMiddleware = require("../middlewares/authentication-middleware");

router.get("/all", authenticationMiddleware, usersController.getAllProducts);

module.exports = router;

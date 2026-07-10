const express = require("express");

const cartController = require("../controllers/cart-controllers");
const authenticationMiddleware = require("../middlewares/authentication-middleware");

const router = express.Router();

router.use(authenticationMiddleware);

router
	.route("/")
	.post(cartController.addToCart)
	.get(cartController.getCart)
	.delete(cartController.clearCart);

router.route("/:productId").delete(cartController.removeFromCart);

module.exports = router;

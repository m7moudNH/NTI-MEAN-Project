const express = require("express");
const orderControllers = require("../controllers/order-controllers");
const authenticationMiddleware = require("../middlewares/authentication-middleware");
const authorizationMiddleware = require("../middlewares/authorization-middleware");

const router = express.Router();

router.use(authenticationMiddleware);

router
	.route("/")
	.post(orderControllers.createOrder)
	.get(orderControllers.getMyOrders);

router
	.route("/all")
	.get(authorizationMiddleware("admin"), orderControllers.getAllOrders);

router
	.route("/:id")
	.get(orderControllers.getOrderById)
	.patch(authorizationMiddleware("admin"), orderControllers.updateOrderStatus);

router.patch("/:id/cancel", orderControllers.cancelOrder);

module.exports = router;

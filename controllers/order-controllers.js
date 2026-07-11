const Order = require("../models/order-model");
const Cart = require("../models/Cart-model");
const Product = require("../models/Product-model");

const createOrder = async (req, res) => {
	try {
		const userId = req.user.id;
		const cart = await Cart.findOne({ userId });

		if (!cart || cart.items.length === 0) {
			return res.status(404).json({
				status: "fail",
				message: "Cart is empty",
			});
		}

		for (const item of cart.items) {
			const product = await Product.findById(item.productId);

			if (!product) {
				return res.status(404).json({
					status: "fail",
					message: "Product not found.",
				});
			}

			if (product.stock < item.quantity) {
				return res.status(400).json({
					status: "fail",
					message: "Not enough stock.",
				});
			}
			product.stock -= item.quantity;
			await product.save();
		}

		const order = await Order.create({
			userId,
			items: cart.items,
			totalPrice: cart.totalPrice,
		});

		cart.items = [];
		await cart.save();

		return res.status(201).json({
			status: "success",
			message: "Order created successfully.",
			data: { order },
		});
	} catch (err) {
		return res.status(500).json({
			status: "error",
			message: err.message,
		});
	}
};

const getMyOrders = async (req, res) => {
	try {
		const userId = req.user.id;

		const orders = await Order.find({ userId }).populate("items.productId");

		if (orders.length === 0) {
			return res.status(404).json({
				status: "fail",
				message: "No orders found.",
			});
		}

		return res.status(200).json({
			status: "success",
			data: { orders },
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate("items.productId")
			.populate("userId");

		if (!order) {
			return res.status(404).json({
				status: "fail",
				message: "Order not found.",
			});
		}

		if (
			order.userId._id.toString() !== req.user.id &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({
				status: "fail",
				message: "You have no access to this order.",
			});
		}

		return res.status(200).json({
			status: "success",
			data: { order },
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate("userId")
			.populate("items.productId");

		return res.status(200).json({
			status: "success",
			count: orders.length,
			data: { orders },
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const updateOrderStatus = async (req, res) => {
	try {
		const { status } = req.body;

		const order = await Order.findByIdAndUpdate(
			req.params.id,
			{ status },
			{
				new: true,
				runValidators: true,
			},
		);

		if (!order) {
			return res.status(404).json({
				status: "fail",
				message: "Order not found.",
			});
		}

		return res.status(200).json({
			status: "success",
			message: "Order status updated successfully.",
			data: { order },
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const cancelOrder = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);

		if (!order) {
			return res.status(404).json({
				status: "fail",
				message: "Order not found.",
			});
		}

		if (order.userId.toString() !== req.user.id) {
			return res.status(403).json({
				status: "fail",
				message: "You have no access to this order.",
			});
		}

		if (order.status !== "pending") {
			return res.status(400).json({
				status: "fail",
				message: "Order cannot be cancelled.",
			});
		}

		for (const item of order.items) {
			const product = await Product.findById(item.productId);

			if (product) {
				product.stock += item.quantity;
				await product.save();
			}
		}

		order.status = "cancelled";
		await order.save();

		return res.status(200).json({
			status: "success",
			message: "Order cancelled successfully.",
			data: { order },
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

module.exports = {
	createOrder,
	getMyOrders,
	getOrderById,
	getAllOrders,
	updateOrderStatus,
	cancelOrder,
};

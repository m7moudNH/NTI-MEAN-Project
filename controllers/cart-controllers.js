const Cart = require("../models/cart-model");
const Product = require("../models/Product-model");

const addToCart = async (req, res) => {
	try {
		const { productId, quantity } = req.body;

		if (!productId || !quantity || quantity < 1) {
			return res.status(400).json({
				message: "Product ID and quantity are required.",
			});
		}

		const product = await Product.findById(productId);

		if (!product) {
			return res.status(404).json({
				message: "Product not found.",
			});
		}

		const userId = req.user.id;

		if (!userId) {
			return res.status(401).json({
				message: "User not authenticated.",
			});
		}

		const cart = await Cart.findOne({ userId });

		if (!cart) {
			const newCart = new Cart({
				userId,
				items: [
					{
						productId: product._id,
						quantity,
						priceSnapshot: product.price,
					},
				],
			});

			await newCart.save();

			return res.status(201).json({
				message: "Product added to cart.",
				cart: newCart,
			});
		}

		const existingItem = cart.items.find(
			(item) => item.productId.toString() === productId,
		);

		if (existingItem) {
			existingItem.quantity += quantity;
			existingItem.priceSnapshot = product.price;
		} else {
			cart.items.push({
				productId: product._id,
				quantity,
				priceSnapshot: product.price,
			});
		}

		await cart.save();

		return res.status(200).json({
			status: "success",
			message: "Product added to cart.",
			data: {
				cart,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Server error.",
			error: error.message,
		});
	}
};

const getCart = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!userId) {
			return res.status(401).json({
				message: "User not authenticated.",
			});
		}

		const cart = await Cart.findOne({ userId }).populate("items.productId");

		if (!cart || cart.items.length === 0) {
			return res.status(200).json({
				message: "Cart is empty.",
				cart,
			});
		}

		return res.status(200).json({
			status: "success",
			message: "Cart retrieved successfully.",
			data: {
				cart,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Server error.",
			error: error.message,
		});
	}
};

const removeFromCart = async (req, res) => {
	try {
		const userId = req.user.id;
		const { productId } = req.body;

		const cart = await Cart.findOne({ userId });

		if (!cart) {
			return res.status(404).json({
				status: "fail",
				message: "Cart not found.",
			});
		}

		cart.items = cart.items.filter(
			(item) => item.productId.toString() !== productId,
		);

		await cart.save();

		return res.status(200).json({
			status: "success",
			message: "Removed item from cart.",
			data: {
				cart,
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: "failed",
			message: "Error during removing item.",
		});
	}
};

const clearCart = async (req, res) => {
	try {
		const userId = req.user.id;

		const cart = await Cart.findOne({ userId });

		if (!cart) {
			return res.status(404).json({
				status: "fail",
				message: "Cart not found.",
			});
		}

		cart.items = [];

		await cart.save();

		return res.status(200).json({
			status: "success",
			message: "Cart cleared successfully.",
			data: {
				cart,
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: "failed",
			message: "Error during clearing cart.",
		});
	}
};

module.exports = {
	addToCart,
	getCart,
	removeFromCart,
	clearCart,
};

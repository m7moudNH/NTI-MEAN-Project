const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find();

		res.status(200).json({
			status: "success",
			count: products.length,
			data: {
				products,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: error.message,
		});
	}
};

const createProduct = async (req, res) => {
	try {
		if (req.body.category) {
			req.body.category = req.body.category.toLowerCase();
		}

		if (req.body.gender) {
			req.body.gender = req.body.gender.toLowerCase();
		}

		if (req.body.size) {
			req.body.size = req.body.size.map((size) => size.toUpperCase());
		}

		const product = await Product.create(req.body);

		res.status(201).json({
			status: "success",
			message: "Product created successfully.",
			data: {
				product,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "error",
			message: error.message,
		});
	}
};

const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({
				status: "fail",
				message: "Product not found.",
			});
		}

		res.status(200).json({
			status: "success",
			data: {
				product,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "error",
			message: error.message,
		});
	}
};

const updateProductById = async (req, res) => {
	try {
		if (req.body.category) {
			req.body.category = req.body.category.toLowerCase();
		}

		if (req.body.gender) {
			req.body.gender = req.body.gender.toLowerCase();
		}

		if (req.body.size) {
			req.body.size = req.body.size.map((size) => size.toUpperCase());
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			},
		);

		if (!updatedProduct) {
			return res.status(404).json({
				status: "fail",
				message: "Product not found.",
			});
		}

		res.status(200).json({
			status: "success",
			message: "Product updated successfully.",
			data: {
				product: updatedProduct,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "error",
			message: error.message,
		});
	}
};

const deleteProductById = async (req, res) => {
	try {
		const deletedProduct = await Product.findByIdAndDelete(req.params.id);

		if (!deletedProduct) {
			return res.status(404).json({
				status: "fail",
				message: "Product not found.",
			});
		}

		res.status(200).json({
			status: "success",
			message: "Product deleted successfully.",
			data: {
				product: deletedProduct,
			},
		});
	} catch (error) {
		res.status(400).json({
			status: "error",
			message: error.message,
		});
	}
};

module.exports = {
	getAllProducts,
	createProduct,
	getProductById,
	updateProductById,
	deleteProductById,
};

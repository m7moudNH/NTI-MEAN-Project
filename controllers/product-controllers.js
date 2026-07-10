const Product = require("../models/Product-model");
const deleteUploadedFiles = require("../utils/deleteUploadedFiles");

const getAllProducts = async (req, res) => {
	try {
		const excludedFields = ["page", "sort", "limit"];
		const excludedQuery = { ...req.query };
		excludedFields.forEach((field) => delete excludedQuery[field]);

		const updatedQuery = queryRange(excludedQuery);

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const products = await Product.find(updatedQuery).skip(skip).limit(limit);

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
			req.body.size = Array.isArray(req.body.size)
				? req.body.size.map((size) => size.toUpperCase())
				: [req.body.size.toUpperCase()];
		}

		if (req.file) {
			req.body.imageUrl = req.file.filename;
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
		if (req.file) {
			deleteUploadedFiles("products", req.file.filename);
		}

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
		const product = await Product.findById(req.params.id);

		if (!product) {
			if (req.file) {
				deleteUploadedFiles("products", req.file.filename);
			}

			return res.status(404).json({
				status: "error",
				message: "Product not found",
			});
		}

		if (req.body.category) {
			req.body.category = req.body.category.toLowerCase();
		}

		if (req.body.gender) {
			req.body.gender = req.body.gender.toLowerCase();
		}

		if (req.body.size) {
			req.body.size = Array.isArray(req.body.size)
				? req.body.size.map((size) => size.toUpperCase())
				: [req.body.size.toUpperCase()];
		}

		if (req.file) {
			req.body.imageUrl = req.file.filename;

			if (product.imageUrl) {
				deleteUploadedFiles("products", product.imageUrl);
			}
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			},
		);

		res.status(200).json({
			status: "success",
			data: {
				product: updatedProduct,
			},
		});
	} catch (err) {
		if (req.file) {
			deleteUploadedFiles("products", req.file.filename);
		}

		res.status(400).json({
			status: "error",
			message: "Error updating product: " + err.message,
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

		if (deletedProduct.imageUrl) {
			deleteUploadedFiles("products", deletedProduct.imageUrl);
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

function queryRange(query) {
	const filtered = {};

	for (let key in query) {
		const value = query[key];
		const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);

		if (match) {
			const field = match[1];
			const operator = `$${match[2]}`;

			if (!filtered[field]) {
				filtered[field] = {};
			}

			filtered[field][operator] = +value;
		} else {
			filtered[key] = {
				$regex: value,
				$options: "i",
			};
		}
	}

	return filtered;
}

module.exports = {
	getAllProducts,
	createProduct,
	getProductById,
	updateProductById,
	deleteProductById,
};

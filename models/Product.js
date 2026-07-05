const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Product title is required"],
			unique: true,
			trim: true,
			minlength: [3, "Product title should be at least 3 characters"],
			maxlength: [100, "Product title shouldn't exceed 100 characters"],
		},

		description: {
			type: String,
			required: [true, "Product description is required"],
			trim: true,
			maxlength: [1000, "Description shouldn't exceed 1000 characters"],
		},

		price: {
			type: Number,
			required: [true, "Product price is required"],
			min: [0, "Price can't be negative"],
		},

		category: {
			type: String,
			required: [true, "Category is required"],
			enum: [
				"t-shirt",
				"hoodie",
				"pants",
				"shorts",
				"jacket",
				"shoes",
				"accessories",
			],
		},

		brand: {
			type: String,
			required: [true, "Brand is required"],
			trim: true,
		},

		gender: {
			type: String,
			enum: ["men", "women"],
		},

		size: [
			{
				type: String,
				enum: ["XS", "S", "M", "L", "XL", "XXL"],
			},
		],

		colors: [
			{
				type: String,
			},
		],

		images: [
			{
				type: String,
			},
		],

		stock: {
			type: Number,
			required: true,
			default: 0,
			min: 0,
		},

		discount: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},

		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},

		isFeatured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Product", productSchema);

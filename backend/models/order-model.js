const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		items: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},

				quantity: {
					type: Number,
					required: true,
					min: 1,
				},

				priceSnapshot: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],

		totalPrice: {
			type: Number,
			required: true,
			min: 0,
		},

		status: {
			type: String,
			enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Order", orderSchema);

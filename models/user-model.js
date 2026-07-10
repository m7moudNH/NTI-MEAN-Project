const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
		minLength: [3, "first name must be atleast 3 characters"],
		maxLength: [50, "first name cannot exceed 50 characters"],
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		minLength: [3, "first name must be atleast 3 characters"],
		maxLength: [50, "first name cannot exceed 50 characters"],
	},
	email: {
		type: String,
		require: [true, "mail is required"],
		unique: true,
		trim: true,
		lowercase: true,
		match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minLength: [3, "password must be atleast 3 characters"],
		maxLength: [50, "password  cannot exceed 50 characters"],
		select: false,
	},
	role: {
		type: String,
		enum: {
			values: ["admin", "user"],
			message: "Invalid Role",
		},
		default: "user",
	},
	phone: {
		type: String,
		trim: true,
		match: [/^\+?[0,9]{10,15}$/, "Invalid Phone Number"],
	},
	imageUrl: {
		type: String,
		trim: true,
		default: "l60Hf.jpg",
	},
});

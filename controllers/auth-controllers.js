const User = require("../models/users-model");
const generateToken = require("../utils/get-jwt");
const deleteUploadedFile = require("../utils/deleteUploadedFiles.js");
const bcrypt = require("bcryptjs");

const signUp = async (req, res) => {
	try {
		const user = await User.create({
			...req.body,
			role: "user",
			imageUrl: req.file?.filename,
		});
		const token = generateToken(user);
		res.status(201).json({
			status: "success",
			message: "user created",
			token,
			data: { user },
		});
	} catch (error) {
		if (req.file) {
			deleteUploadedFile("users", req.file.filename);
		}
		res.status(400).json({
			status: "error",
			message: `error sign up ${error}`,
		});
	}
};

const signIn = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).json({
				status: "fail",
				message: "Email and Password are required",
			});
		}

		const user = await User.findOne({
			email,
		}).select("+password");
		if (!user) {
			res.status(400).json({
				status: "fail",
				message: "Invalid Email or Password",
			});
		}
		const comparePassword = await bcrypt.compare(password, user.password);
		if (!comparePassword) {
			res.status(400).json({
				status: "fail",
				message: "Invalid Email or Password",
			});
		}
		user.password = undefined;
		const token = generateToken(user);
		res.status(200).json({
			status: "success",
			token,
			data: { user },
		});
	} catch (error) {
		res.status(400).json({
			status: "error",
			message: `error while signing in ${error}`,
		});
	}
};

module.exports = { signUp, signIn };

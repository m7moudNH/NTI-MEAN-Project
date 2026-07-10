const User = require("../models/user-model");

const getProfile = async (req, res) => {
	const user = await User.findById(req.user.id);
	if (!user) {
		return res.status(404).json({
			status: "failed",
			message: "no user found",
		});
	}
	return res.status(200).json({
		status: "done",
		data: [user],
	});
};

const updateProfile = async (req, res) => {
	const allowedFields = ["fistName", "lastName", "phone", "address", "imageUrl"];
	const updates = {};

	allowedFields.forEach((field) => {
		if (req.body[field] !== undefined) {
			updates[field] = req.body[field];
		}
	});
	const user = await User.findByIdAndUpdate(req.user.id, updates, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		return res.status(404).json({
			status: "failed",
			message: "No user found",
		});
	}

	return res.status(200).json({
		status: "success",
		data: user,
	});
};

const updatePassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({
				status: "failed",
				message: "Current password and new password are required",
			});
		}

		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json({
				status: "failed",
				message: "No user found",
			});
		}

		const isMatch = await user.comparePassword(currentPassword);

		if (!isMatch) {
			return res.status(401).json({
				status: "failed",
				message: "Current password is incorrect",
			});
		}

		const samePassword = await user.comparePassword(newPassword);

		if (samePassword) {
			return res.status(400).json({
				status: "failed",
				message: "New password must be different from the current password",
			});
		}

		user.password = newPassword;
		await user.save();

		return res.status(200).json({
			status: "success",
			message: "Password updated successfully",
		});
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: "An error occurred while updating the password",
		});
	}
};

const deleteProfile = async (req, res) => {
	//password send in body
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({
				status: "failed",
				message: "No user found",
			});
		}
		const { password } = req.body;
		if (!password) {
			return res.status(400).json({
				status: "failed",
				message: "Password is required",
			});
		}
		const passwordMatches = await bcrypt.compare(
			req.body.password,
			user.password,
		);
		if (!passwordMatches) {
			return res.status(401).json({
				status: "failed",
				message: "Incorrect password",
			});
		}
		await user.deleteOne();
		return res.status(200).json({
			status: "success",
			message: "User deleted successfully",
		});
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: "An error occurred while deleting the user",
		});
	}
};
module.exports = {
	getProfile,
	updateProfile,
	updatePassword,
	deleteProfile,
};

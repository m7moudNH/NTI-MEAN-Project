const User = require("../models/users-model");

const getAllProducts = async (req, res) => {
	console.log(req.user);

	const user = await User.findById(req.user.id);
	if (!user) {
		return res.status(404).json({
			status: "failed",
			message: "no user found",
		});
	}
	return res.status(200).json({
		status: "done",
		data: [user.myCourses],
	});
};
module.exports = { getAllProducts };

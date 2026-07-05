const mongoose = require("mongoose");

const dbConnect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			dbName: process.env.DB_NAME,
		});
		console.log("db connected");
	} catch (error) {
		console.log(error);
	}
};

module.exports = dbConnect;

const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let dest = "uploads";

		if (req.baseUrl.includes("products")) {
			dest = "uploads/products";
		} else if (req.baseUrl.includes("users") || req.baseUrl.includes("auth")) {
			dest = "uploads/users";
		}

		try {
			fs.mkdirSync(dest, { recursive: true });
			cb(null, dest);
		} catch (error) {
			cb(error, null);
		}
	},

	filename: function (req, file, cb) {
		try {
			const extension = file.mimetype.split("/")[1];
			let filename = "";

			if (req.baseUrl.includes("products")) {
				filename = `product-${Date.now()}.${extension}`;
			} else if (req.baseUrl.includes("users") || req.baseUrl.includes("auth")) {
				filename = `user-${Date.now()}.${extension}`;
			}

			cb(null, filename);
		} catch (error) {
			cb(error, null);
		}
	},
});

const fileFilter = (req, file, cb) => {
	const fileType = file.mimetype.split("/")[0];

	if (fileType === "image") {
		cb(null, true);
	} else {
		cb(new Error("Only images are allowed."), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
});

module.exports = upload;

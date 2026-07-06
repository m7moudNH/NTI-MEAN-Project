const path = require("path");
const fs = require("fs");

function deleteUploadedFiles(foldername, filename) {
	const filePath = path.join(__dirname, "../uploads", foldername, filename);

	fs.unlink(filePath, (error) => {
		if (error) {
			console.log(`Error deleting file: ${error.message}`);
		}
	});
}

module.exports = deleteUploadedFiles;
